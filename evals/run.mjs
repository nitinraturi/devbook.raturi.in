#!/usr/bin/env node
// Devbook evaluation runner (measured). See evals/README.md. For the free, modelled evaluation, see model.mjs.
//
// For each task × variant × model × repeat: copy the task's fixture into a temporary directory, install the
// Devbook variant (AGENTS.md, CLAUDE.md and .devbook/), commit that state, run Claude Code headless, then run the
// task's checks against the final files and the transcript. Raw runs go to evals/runs/<timestamp>/ (git-ignored);
// summaries go to evals/results/ (committed) through report.mjs.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { here, installRun, loadFixture, loadTasks, prepareFixture, prepareVariant } from './install.mjs';
import { parseTranscript, sh } from './lib.mjs';
import { writeResults } from './report.mjs';
import { validate } from './validate.mjs';

const { values: opts } = parseArgs({
	options: {
		task: { type: 'string' },
		variant: { type: 'string', default: 'none,main' },
		repeat: { type: 'string', default: '3' },
		model: { type: 'string' },
		models: { type: 'string', default: 'claude-sonnet-5-5' },
		credential: { type: 'string', default: 'auto' },
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
  --variant <names>       none, main, stable, local or ref:<git-ref>, comma-separated (default: none,main)
  --repeat <n>            runs per task, variant and model (default: 3)
  --models <ids>          comma-separated models (default: claude-sonnet-5-5); --model <id> is the same for one
  --credential <kind>     auto, oauth (CLAUDE_CODE_OAUTH_TOKEN) or api-key (ANTHROPIC_API_KEY); auto prefers oauth
  --max-budget-usd <n>    spending cap per run, passed to Claude Code (default: 2)
  --timeout-min <n>       wall-clock cap per run (default: 20)
  --dry-run               do everything except call the model
  --yes                   confirm a run that calls the model and spends usage
  --keep                  keep the temporary run directories
  --list                  list tasks and exit
  --validate              check tasks, fixtures, checks, rule signals and coverage, then exit (no setup, no model)`);
	process.exit(0);
}

const models = (opts.model ?? opts.models).split(',').map((s) => s.trim());

// ---------- Credentials ----------

/**
 * The credential for the child process. Claude Code ranks ANTHROPIC_API_KEY above CLAUDE_CODE_OAUTH_TOKEN, so the
 * one not chosen is removed from the child's environment; otherwise an API key would silently win.
 */
function credential() {
	const has = {
		oauth: Boolean(process.env.CLAUDE_CODE_OAUTH_TOKEN),
		'api-key': Boolean(process.env.ANTHROPIC_API_KEY),
	};
	const kind = opts.credential === 'auto' ? (has.oauth ? 'oauth' : has['api-key'] ? 'api-key' : null) : opts.credential;
	if (!kind || !has[kind]) return null;
	return kind;
}

function childEnv(configDir, kind) {
	const env = {
		...process.env,
		CLAUDE_CONFIG_DIR: configDir,
		CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1',
		CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
	};
	delete env.ANTHROPIC_AUTH_TOKEN;
	if (kind === 'oauth') delete env.ANTHROPIC_API_KEY;
	else delete env.CLAUDE_CODE_OAUTH_TOKEN;
	return env;
}

// ---------- Agent ----------

function claudeArgs(task, fixture, model) {
	return [
		'-p',
		task.prompt,
		'--output-format',
		'stream-json',
		'--verbose',
		'--model',
		model,
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
function runClaude(args, { cwd, env, transcriptPath }) {
	return new Promise((resolve) => {
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

// ---------- Main ----------

const allTasks = await loadTasks();
const { errors, coverage } = await validate(allTasks);
if (errors.length) {
	console.error(`Invalid eval definitions:\n  ${errors.join('\n  ')}`);
	process.exit(1);
}
if (opts.validate) {
	console.log(
		`Evals: ${allTasks.length} tasks valid; coverage: ${coverage.size} files and skills with at least 3 tasks each`,
	);
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
const total = tasks.length * variantNames.length * models.length * repeat;
const kind = credential();

if (!opts['dry-run']) {
	if (!opts.yes) {
		console.error(
			`This would make ${total} Claude Code run(s) with ${models.join(', ')}, up to $${opts['max-budget-usd']} each, and spend usage.\n` +
				'Re-run with --yes to confirm, with --dry-run to test the pipeline, or use the free modelled evaluation: node evals/model.mjs',
		);
		process.exit(2);
	}
	if (!kind) {
		console.error(
			'Set CLAUDE_CODE_OAUTH_TOKEN (from `claude setup-token`, uses your subscription) or ANTHROPIC_API_KEY: runs use an empty Claude Code config directory, so a saved login is not available.',
		);
		process.exit(2);
	}
}

const startedAt = new Date().toISOString();
const work = await mkdtemp(join(tmpdir(), 'devbook-evals-'));
const outDir = join(here, 'runs', startedAt.replace(/[:.]/g, '-'));
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
		for (const model of models) {
			for (let n = 1; n <= repeat; n++) {
				const id = `${task.id}__${variantName.replace(/[^\w.-]/g, '_')}__${model}__${n}`;
				const dir = join(work, 'runs', id);
				const runOut = join(outDir, 'runs', id);
				await mkdir(runOut, { recursive: true });
				const variant = variants.get(variantName);
				const initialCommit = await installRun({ task, fixture, variant, prepared, dir });
				const args = claudeArgs(task, fixture, model);
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
					const env = childEnv(configDir, kind);
					const { code, stderr, transcript } = await runClaude(args, { cwd: dir, env, transcriptPath });
					if (stderr.trim()) await writeFile(join(runOut, 'stderr.txt'), stderr);
					if (code !== 0) process.stdout.write(`(claude exited ${code}) `);
					transcriptText = transcript;
				}

				const transcript = parseTranscript(transcriptText);
				const checks = await runChecks(task, { dir, fixture, transcript, initialCommit, dryRun: opts['dry-run'] });
				const diff = await sh(`git add -A -N . && git diff ${initialCommit}`, { cwd: dir });
				await writeFile(join(runOut, 'diff.patch'), diff.stdout);
				const run = {
					task: task.id,
					variant: variantName,
					model,
					repeat: n,
					credential: opts['dry-run'] ? 'none (dry run)' : kind,
					pass: checks.every((c) => c.pass),
					checks,
					usage: usageOf(transcript.result),
					isError: Boolean(transcript.result?.is_error),
					permissionDenials: transcript.result?.permission_denials ?? [],
				};
				await writeFile(join(runOut, 'result.json'), `${JSON.stringify(run, null, 2)}\n`);
				runs.push(run);
				console.log(
					`${run.pass ? 'PASS' : 'FAIL'} ${checks.map((c) => `${c.pass ? '✓' : '✗'} ${c.check}`).join('  ')}`,
				);
			}
		}
	}
}

const meta = {
	method: opts['dry-run'] ? 'dry-run' : 'measured',
	startedAt,
	dryRun: opts['dry-run'],
	model: models.join(','),
	credential: opts['dry-run'] ? 'none (dry run)' : kind,
	repeat,
	variants: Object.fromEntries(
		variantNames.map((v) => [
			v,
			variants.get(v)
				? { label: variants.get(v).label, commit: variants.get(v).commit }
				: { label: 'no Devbook (project section only)', commit: null },
		]),
	),
};
await writeFile(join(outDir, 'report.json'), `${JSON.stringify({ meta, runs }, null, 2)}\n`);
// Dry runs never write to evals/results/, so committed results only ever hold real or modelled numbers.
const { summary, files } = await writeResults({ meta, runs }, { save: !opts['dry-run'] });
await writeFile(join(outDir, 'report.md'), summary);
console.log(`\n${summary.split('\n## Per task')[0]}`);
for (const f of files) console.log(`Wrote ${f}`);
console.log(`Raw runs: ${outDir}`);
if (opts.keep) console.log(`Run directories kept in ${work}`);
else await rm(work, { recursive: true, force: true });
