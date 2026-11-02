#!/usr/bin/env node
// Devbook evaluation runner. See evals/README.md.
//
// For each task × variant × repeat: copy the task's fixture into a temporary directory, install the
// Devbook variant (AGENTS.md, CLAUDE.md and .devbook/), commit that state, run Claude Code headless,
// then run the task's checks against the final files and the transcript. Writes report.json and
// report.md under evals/results/<timestamp>/.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { parseTranscript, sh } from './lib.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const DEVBOOK_PATHS = ['instructions', 'stacks', 'templates', 'skills', 'LICENSE-CC-BY-4.0'];
// Skills the setup skill links, by the instruction file that brings them (null: every project).
const SKILLS = {
	'devbook-security-review': null,
	'devbook-release-check': null,
	'devbook-feature-doc': 'instructions/feature-docs.md',
	'devbook-api-endpoint': 'instructions/api-data.md',
	'devbook-db-migration': 'instructions/database.md',
	'devbook-seo-audit': 'instructions/seo.md',
};

const { values: opts } = parseArgs({
	options: {
		task: { type: 'string' },
		variant: { type: 'string', default: 'none,main' },
		repeat: { type: 'string', default: '3' },
		model: { type: 'string', default: 'claude-sonnet-5-5' },
		'max-budget-usd': { type: 'string', default: '2' },
		'timeout-min': { type: 'string', default: '20' },
		'dry-run': { type: 'boolean', default: false },
		yes: { type: 'boolean', default: false },
		keep: { type: 'boolean', default: false },
		list: { type: 'boolean', default: false },
		validate: { type: 'boolean', default: false },
		help: { type: 'boolean', short: 'h', default: false },
	},
});

if (opts.help) {
	console.log(`Usage: node evals/run.mjs [options]

  --task <ids>            comma-separated task ids (default: all)
  --variant <names>       none, main, local or ref:<git-ref>, comma-separated (default: none,main)
  --repeat <n>            runs per task and variant (default: 3)
  --model <id>            model for Claude Code (default: claude-sonnet-5-5)
  --max-budget-usd <n>    spending cap per run, passed to Claude Code (default: 2)
  --timeout-min <n>       wall-clock cap per run (default: 20)
  --dry-run               do everything except call the model
  --yes                   confirm a run that calls the model and spends API credits
  --keep                  keep the temporary run directories
  --list                  list tasks and exit
  --validate              check tasks, fixtures and checks load, then exit (no setup, no model)`);
	process.exit(0);
}

// ---------- Load and validate tasks ----------

async function loadTasks() {
	const tasks = [];
	for (const name of (await readdir(join(here, 'tasks'))).filter((n) => n.endsWith('.yaml')).sort()) {
		try {
			tasks.push({ file: name, ...parseYaml(await readFile(join(here, 'tasks', name), 'utf8')) });
		} catch (error) {
			throw new Error(`tasks/${name}: ${error.message}`, { cause: error });
		}
	}
	return tasks;
}

async function loadFixture(name) {
	const dir = join(here, 'fixtures', name);
	return {
		name,
		dir,
		...JSON.parse(await readFile(join(dir, 'fixture.json'), 'utf8')),
		project: await readFile(join(dir, 'AGENTS.project.md'), 'utf8'),
	};
}

async function validate(tasks) {
	const errors = [];
	const ids = new Set();
	const checks = new Set((await readdir(join(here, 'checks'))).map((n) => n.replace(/\.mjs$/, '')));
	for (const task of tasks) {
		const where = `tasks/${task.file}`;
		if (!task.id || `${task.id}.yaml` !== task.file) errors.push(`${where}: id must match the file name`);
		if (ids.has(task.id)) errors.push(`${where}: duplicate id`);
		ids.add(task.id);
		if (!task.prompt) errors.push(`${where}: missing prompt`);
		if (!task.behaviour) errors.push(`${where}: missing behaviour`);
		try {
			await loadFixture(task.fixture);
		} catch {
			errors.push(`${where}: unknown fixture "${task.fixture}"`);
		}
		if (!task.checks?.length) errors.push(`${where}: needs at least one check`);
		for (const c of task.checks ?? []) if (!checks.has(c.check)) errors.push(`${where}: unknown check "${c.check}"`);
	}
	for (const name of checks) await import(join(here, 'checks', `${name}.mjs`));
	return errors;
}

// ---------- Fixtures and variants ----------

/** Copy a fixture without its harness files and run its setup once; runs copy this prepared tree. */
async function prepareFixture(fixture, root) {
	const dir = join(root, 'prepared', fixture.name);
	await cp(fixture.dir, dir, {
		recursive: true,
		filter: (src) => !/\/(fixture\.json|AGENTS\.project\.md)$/.test(src),
	});
	for (const command of fixture.setup ?? []) {
		console.log(`  setup ${fixture.name}: ${command}`);
		const { code, stderr } = await sh(command, { cwd: dir });
		if (code !== 0) throw new Error(`setup failed for ${fixture.name}: ${command}\n${stderr}`);
	}
	return dir;
}

/** Materialise a Devbook variant's files into `root/variants/<name>`. Returns { dir, label } or null for `none`. */
async function prepareVariant(name, root) {
	if (name === 'none') return null;
	const dir = join(root, 'variants', name.replace(/[^\w.-]/g, '_'));
	await mkdir(dir, { recursive: true });
	if (name === 'local') {
		for (const p of DEVBOOK_PATHS.filter((p) => existsSync(join(repo, p))))
			await cp(join(repo, p), join(dir, p), { recursive: true });
		const { stdout } = await sh('git rev-parse --short HEAD', { cwd: repo });
		return { dir, label: `working tree (HEAD ${stdout.trim()})` };
	}
	const ref = name.startsWith('ref:') ? name.slice(4) : name;
	const { code, stdout, stderr } = await sh(`git rev-parse --short '${ref}^{commit}'`, { cwd: repo });
	if (code !== 0) throw new Error(`unknown git ref "${ref}": ${stderr}`);
	// Older versions lack some folders (skills/ arrived with the loading tiers), so archive only what exists.
	const present = new Set((await sh(`git ls-tree --name-only '${ref}'`, { cwd: repo })).stdout.split('\n'));
	const paths = DEVBOOK_PATHS.filter((p) => present.has(p)).join(' ');
	const archive = await sh(`git archive '${ref}' ${paths} | tar -x -C '${dir}'`, { cwd: repo });
	if (archive.code !== 0) throw new Error(`git archive failed for ${ref}: ${archive.stderr}`);
	return { dir, label: `${ref} (${stdout.trim()})` };
}

/**
 * Build the project's AGENTS.md from the variant's own template: the fixture's Project section, then the
 * template's Devbook section with only the `@.devbook/...` lines this fixture uses. Lines that are not
 * imports (headings, notes, future "read when" lists) are kept as the template has them.
 */
async function agentsMd(fixture, variant) {
	if (!variant) return `# AGENTS.md\n\n${fixture.project.trim()}\n`;
	const template = await readFile(join(variant.dir, 'templates/AGENTS.md'), 'utf8');
	const devbook = template.slice(template.indexOf('## Devbook'));
	const wanted = [...fixture.devbook, ...fixture.stacks];
	// Templates before the loading tiers list every file as an `@` line; later ones keep `@` lines for
	// the always tier and a "- `.devbook/<path>`: when" list for the rest.
	const listed = (line) => line.match(/^(?:@|- `)\.devbook\/([^\s`]+)/)?.[1];
	const lines = devbook
		.split('\n')
		.filter((line) => !/^<!--.*-->$/.test(line.trim()))
		.filter((line) => !listed(line) || wanted.includes(listed(line)));
	while (lines.at(-1)?.trim() === '') lines.pop();
	const readList = /^- `\.devbook\//m.test(devbook);
	for (const path of wanted.filter((p) => !lines.some((line) => listed(line) === p))) {
		const topic = path.split('/').pop().replace(/\.md$/, '');
		lines.push(readList ? `- \`.devbook/${path}\`: work that touches ${topic}` : `@.devbook/${path}`);
	}
	return `# AGENTS.md\n\n${fixture.project.trim()}\n\n${lines.join('\n').trim()}\n`;
}

/** Create the links the setup skill creates: path-scoped instructions into .claude/rules, skills into .claude/skills. */
async function linkVariant(fixture, dir) {
	for (const path of fixture.devbook) {
		const text = await readFile(join(dir, '.devbook', path), 'utf8');
		if (!/^---\n[\s\S]*?^paths:/m.test(text)) continue;
		await mkdir(join(dir, '.claude/rules'), { recursive: true });
		const name = path.split('/').pop();
		await symlink(`../../.devbook/${path}`, join(dir, '.claude/rules', `devbook-${name}`));
	}
	for (const [skill, needs] of Object.entries(SKILLS)) {
		if (!existsSync(join(dir, '.devbook/skills', skill)) || (needs && !fixture.devbook.includes(needs))) continue;
		await mkdir(join(dir, '.claude/skills'), { recursive: true });
		await symlink(`../../.devbook/skills/${skill}`, join(dir, '.claude/skills', skill));
	}
}

async function installRun({ task, fixture, variant, prepared, dir }) {
	await cp(prepared, dir, { recursive: true });
	for (const [path, content] of Object.entries(task.files ?? {})) {
		await mkdir(dirname(join(dir, path)), { recursive: true });
		await writeFile(join(dir, path), content);
	}
	if (variant) {
		for (const p of DEVBOOK_PATHS.filter((p) => existsSync(join(variant.dir, p))))
			await cp(join(variant.dir, p), join(dir, '.devbook', p), { recursive: true });
		await linkVariant(fixture, dir);
	}
	await writeFile(join(dir, 'AGENTS.md'), await agentsMd(fixture, variant));
	const claudeMd = variant ? await readFile(join(variant.dir, 'templates/CLAUDE.md'), 'utf8') : '@AGENTS.md\n';
	await writeFile(join(dir, 'CLAUDE.md'), claudeMd);
	const git = 'git -c user.name=eval -c user.email=eval@example.invalid';
	await sh(`git init -q -b main && git add -A && ${git} commit -qm "fixture" --no-verify`, { cwd: dir });
	return (await sh('git rev-parse HEAD', { cwd: dir })).stdout.trim();
}

// ---------- Agent ----------

function claudeArgs(task, fixture) {
	return [
		'-p',
		task.prompt,
		'--output-format',
		'stream-json',
		'--verbose',
		'--model',
		opts.model,
		'--permission-mode',
		'acceptEdits',
		'--permission-prompts',
		'none',
		'--allowedTools',
		fixture.allowedTools.join(','),
		'--setting-sources',
		'project,local',
		'--no-session-persistence',
		'--max-budget-usd',
		opts['max-budget-usd'],
	];
}

/** Run Claude Code with an empty config directory, so the user's own memory, settings and plugins stay out. */
function runClaude(args, { cwd, configDir, transcriptPath }) {
	return new Promise((resolve) => {
		const env = {
			...process.env,
			CLAUDE_CONFIG_DIR: configDir,
			CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1',
			CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
		};
		const child = spawn('claude', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
		let out = '';
		let err = '';
		child.stdout.on('data', (d) => (out += d));
		child.stderr.on('data', (d) => (err += d));
		const timer = setTimeout(() => child.kill('SIGINT'), Number(opts['timeout-min']) * 60_000);
		child.on('close', async (code) => {
			clearTimeout(timer);
			await writeFile(transcriptPath, out);
			resolve({ code, stderr: err, transcript: out });
		});
	});
}

const quote = (a) => (/^[\w@%+=:,./-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`);

// ---------- Checks and report ----------

async function runChecks(task, ctx) {
	const results = [];
	for (const { check, ...params } of task.checks) {
		const fn = (await import(join(here, 'checks', `${check}.mjs`))).default;
		try {
			results.push({ check, ...(await fn({ ...ctx, params })) });
		} catch (error) {
			results.push({ check, pass: false, detail: `check crashed: ${error.message}` });
		}
	}
	return results;
}

function usageOf(result) {
	const u = result?.usage ?? {};
	return {
		inputTokens: (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0),
		cacheReadTokens: u.cache_read_input_tokens ?? 0,
		outputTokens: u.output_tokens ?? 0,
		costUsd: result?.total_cost_usd ?? 0,
		turns: result?.num_turns ?? 0,
	};
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const pct = (x) => `${Math.round(x * 100)}%`;
const int = (x) => Math.round(x).toLocaleString('en');

function summarise(runs) {
	const group = (key) => {
		const map = new Map();
		for (const r of runs) map.set(key(r), [...(map.get(key(r)) ?? []), r]);
		return map;
	};
	const stats = (rs) => ({
		runs: rs.length,
		passRate: mean(rs.map((r) => (r.pass ? 1 : 0))),
		meanInputTokens: mean(rs.map((r) => r.usage.inputTokens)),
		meanOutputTokens: mean(rs.map((r) => r.usage.outputTokens)),
		meanCostUsd: mean(rs.map((r) => r.usage.costUsd)),
		totalCostUsd: rs.reduce((a, r) => a + r.usage.costUsd, 0),
	});
	return {
		byVariant: Object.fromEntries([...group((r) => r.variant)].map(([v, rs]) => [v, stats(rs)])),
		byTask: Object.fromEntries(
			[...group((r) => `${r.task}\t${r.variant}`)].map(([k, rs]) => [
				k,
				{ ...stats(rs), task: rs[0].task, variant: rs[0].variant },
			]),
		),
	};
}

function markdown(meta, summary, runs) {
	const variants = Object.keys(summary.byVariant);
	const lines = [
		`# Devbook eval report${meta.dryRun ? ' (DRY RUN: no model was called)' : ''}`,
		'',
		`- Date: ${meta.startedAt}`,
		`- Model: ${meta.model}`,
		`- Variants: ${variants.map((v) => `${v} = ${meta.variants[v]}`).join('; ')}`,
		`- Runs per task and variant: ${meta.repeat}`,
		'',
		'## Overall',
		'',
		'| Variant | Runs | Pass rate | Mean input tokens | Mean output tokens | Mean cost | Total cost |',
		'|---|---|---|---|---|---|---|',
		...variants.map((v) => {
			const s = summary.byVariant[v];
			return `| ${v} | ${s.runs} | ${pct(s.passRate)} | ${int(s.meanInputTokens)} | ${int(s.meanOutputTokens)} | $${s.meanCostUsd.toFixed(3)} | $${s.totalCostUsd.toFixed(2)} |`;
		}),
		'',
		'## Per task (pass rate)',
		'',
		`| Task | ${variants.join(' | ')} |`,
		`|---|${variants.map(() => '---').join('|')}|`,
		...[...new Set(runs.map((r) => r.task))].map(
			(t) =>
				`| ${t} | ${variants
					.map((v) => {
						const s = summary.byTask[`${t}\t${v}`];
						return s ? pct(s.passRate) : '–';
					})
					.join(' | ')} |`,
		),
		'',
		'## Failed checks',
		'',
		...runs
			.filter((r) => !r.pass)
			.flatMap((r) =>
				r.checks
					.filter((c) => !c.pass)
					.map((c) => `- ${r.task} · ${r.variant} · run ${r.repeat}: **${c.check}**: ${c.detail}`),
			),
	];
	return `${lines.join('\n')}\n`;
}

// ---------- Main ----------

const allTasks = await loadTasks();
const errors = await validate(allTasks);
if (errors.length) {
	console.error(`Invalid eval definitions:\n  ${errors.join('\n  ')}`);
	process.exit(1);
}
if (opts.validate) {
	console.log(`Evals: ${allTasks.length} tasks valid`);
	process.exit(0);
}
if (opts.list) {
	for (const t of allTasks) console.log(`${t.id.padEnd(30)} ${t.fixture.padEnd(11)} ${t.behaviour}`);
	process.exit(0);
}

const wanted = opts.task?.split(',').map((s) => s.trim());
const tasks = wanted ? allTasks.filter((t) => wanted.includes(t.id)) : allTasks;
const unknown = (wanted ?? []).filter((id) => !allTasks.some((t) => t.id === id));
if (unknown.length) throw new Error(`unknown task(s): ${unknown.join(', ')}`);
const variantNames = opts.variant.split(',').map((s) => s.trim());
const repeat = Number(opts.repeat);
const total = tasks.length * variantNames.length * repeat;

if (!opts['dry-run']) {
	if (!opts.yes) {
		console.error(
			`This would make ${total} Claude Code run(s) with ${opts.model}, up to $${opts['max-budget-usd']} each, and spend API credits.\n` +
				'Re-run with --yes to confirm, or with --dry-run to test the pipeline without calling the model.',
		);
		process.exit(2);
	}
	if (!process.env.ANTHROPIC_API_KEY) {
		console.error(
			'Set ANTHROPIC_API_KEY: runs use an empty Claude Code config directory, so a saved login is not available.',
		);
		process.exit(2);
	}
}

const startedAt = new Date().toISOString();
const work = await mkdtemp(join(tmpdir(), 'devbook-evals-'));
const outDir = join(here, 'results', startedAt.replace(/[:.]/g, '-'));
await mkdir(outDir, { recursive: true });
console.log(`${opts['dry-run'] ? 'DRY RUN: ' : ''}${total} run(s). Work dir ${work}`);

const fixtures = new Map();
for (const name of new Set(tasks.map((t) => t.fixture))) {
	const fixture = await loadFixture(name);
	fixtures.set(name, { fixture, prepared: await prepareFixture(fixture, work) });
}
const variants = new Map();
for (const name of variantNames) variants.set(name, await prepareVariant(name, work));

const runs = [];
for (const task of tasks) {
	const { fixture, prepared } = fixtures.get(task.fixture);
	for (const variantName of variantNames) {
		for (let n = 1; n <= repeat; n++) {
			const id = `${task.id}__${variantName.replace(/[^\w.-]/g, '_')}__${n}`;
			const dir = join(work, 'runs', id);
			const runOut = join(outDir, 'runs', id);
			await mkdir(runOut, { recursive: true });
			const variant = variants.get(variantName);
			const initialCommit = await installRun({ task, fixture, variant, prepared, dir });
			const args = claudeArgs(task, fixture);
			const transcriptPath = join(runOut, 'transcript.jsonl');
			process.stdout.write(`- ${id}: `);

			let transcriptText;
			if (opts['dry-run']) {
				await writeFile(join(runOut, 'command.txt'), `cd ${dir}\nclaude ${args.map(quote).join(' ')}\n`);
				transcriptText = `${JSON.stringify({ type: 'result', subtype: 'dry_run', result: '', total_cost_usd: 0, num_turns: 0, usage: {} })}\n`;
				await writeFile(transcriptPath, transcriptText);
			} else {
				const configDir = join(work, 'claude-config', id);
				await mkdir(configDir, { recursive: true });
				const { code, stderr, transcript } = await runClaude(args, { cwd: dir, configDir, transcriptPath });
				if (stderr.trim()) await writeFile(join(runOut, 'stderr.txt'), stderr);
				if (code !== 0) process.stdout.write(`(claude exited ${code}) `);
				transcriptText = transcript;
			}

			const transcript = parseTranscript(transcriptText);
			const checks = await runChecks(task, { dir, fixture, transcript, initialCommit });
			const diff = await sh(`git add -A -N . && git diff ${initialCommit}`, { cwd: dir });
			await writeFile(join(runOut, 'diff.patch'), diff.stdout);
			const run = {
				task: task.id,
				variant: variantName,
				repeat: n,
				pass: checks.every((c) => c.pass),
				checks,
				usage: usageOf(transcript.result),
				isError: Boolean(transcript.result?.is_error),
				permissionDenials: transcript.result?.permission_denials ?? [],
			};
			await writeFile(join(runOut, 'result.json'), `${JSON.stringify(run, null, 2)}\n`);
			runs.push(run);
			console.log(`${run.pass ? 'PASS' : 'FAIL'} ${checks.map((c) => `${c.pass ? '✓' : '✗'} ${c.check}`).join('  ')}`);
		}
	}
}

const meta = {
	startedAt,
	dryRun: opts['dry-run'],
	model: opts.model,
	repeat,
	variants: Object.fromEntries(
		variantNames.map((v) => [v, variants.get(v)?.label ?? 'no Devbook (project section only)']),
	),
};
const summary = summarise(runs);
await writeFile(join(outDir, 'report.json'), `${JSON.stringify({ meta, summary, runs }, null, 2)}\n`);
await writeFile(join(outDir, 'report.md'), markdown(meta, summary, runs));
console.log(`\n${markdown(meta, summary, runs).split('\n## Per task')[0]}`);
console.log(`Report: ${join(outDir, 'report.md')}`);
if (opts.keep) console.log(`Run directories kept in ${work}`);
else await rm(work, { recursive: true, force: true });
