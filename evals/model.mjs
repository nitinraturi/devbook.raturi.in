#!/usr/bin/env node
// Modelled evaluation: what each Devbook variant puts in front of the assistant for each task, at no model cost.
//
// For each task × variant it installs the fixture and variant exactly as run.mjs does, then models how Claude Code
// loads them, following its documented behaviour:
//   - loaded: CLAUDE.md with its `@` imports expanded (relative to the importing file, at most 5 hops), rules in
//     .claude/rules without `paths:` plus those whose globs match a file the task touches, the name and description
//     of each linked skill, any `.devbook/` file the prompt names, and the body of each skill the trigger model fires;
//   - reachable: files the loaded text points to by path (the "read when" list, a skill's "Read …" step), which the
//     assistant has to decide to open.
// Each task lists the rules it tests; rules.json holds a content signal per rule, so versions from before rule IDs
// are judged on their text. A task passes (modelled) when every rule it tests is loaded or reachable and its skill
// expectation holds. Tokens are what Devbook adds: loaded text plus the smallest reachable file per missing rule.
//
// This is a model of loading, not of behaviour: it says whether the assistant can see a rule and what that costs,
// not whether it follows it. Measured runs (run.mjs --yes) answer that.
import { fileURLToPath } from 'node:url';
import { existsSync, lstatSync, realpathSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, matchesGlob, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { installRun, loadFixture, loadTasks, prepareFixture, prepareVariant } from './install.mjs';
import { writeResults } from './report.mjs';
import { loadSignals, validate } from './validate.mjs';

const MAX_IMPORT_HOPS = 5;
// Bytes per token. Devbook's budgets use 4 (devbook.manifest.json); --count-tokens uses Anthropic's free
// token-counting endpoint instead, which is exact for the counted model.
const BYTES_PER_TOKEN = 4;

const frontmatter = (text) => parseYaml(text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '') ?? {};
const body = (text) => text.replace(/^---\n[\s\S]*?\n---\n?/, '');
const readMaybe = (path) => readFile(path, 'utf8').catch(() => null);

/** Remove fenced code blocks and inline code, where Claude Code does not evaluate `@` imports. */
const stripCode = (text) => text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

/** CLAUDE.md with its imports expanded, as Claude Code loads it. Returns [{ path, text }] in load order. */
async function memoryFiles(dir) {
	const out = [];
	const seen = new Set();
	const visit = async (path, hops) => {
		const abs = resolve(path);
		if (seen.has(abs) || hops > MAX_IMPORT_HOPS) return;
		const text = await readMaybe(abs);
		if (text === null) return;
		seen.add(abs);
		out.push({ path: relative(dir, abs), text });
		for (const [, ref] of stripCode(text).matchAll(/(?:^|\s)@([^\s]+\.md)\b/g))
			await visit(join(dirname(abs), ref), hops + 1);
	};
	await visit(join(dir, 'CLAUDE.md'), 0);
	return out;
}

/** Files in .claude/rules (following links), with their `paths:` globs. */
async function ruleFiles(dir) {
	const root = join(dir, '.claude/rules');
	if (!existsSync(root)) return [];
	const out = [];
	for (const name of (await readdir(root)).filter((n) => n.endsWith('.md'))) {
		const text = await readFile(join(root, name), 'utf8');
		out.push({ path: `.claude/rules/${name}`, text, globs: frontmatter(text).paths ?? [] });
	}
	return out;
}

/** Linked skills: name, description and body. */
async function skillFiles(dir) {
	const root = join(dir, '.claude/skills');
	if (!existsSync(root)) return [];
	const out = [];
	for (const name of await readdir(root)) {
		const text = await readMaybe(join(root, name, 'SKILL.md'));
		if (!text) continue;
		const fm = frontmatter(text);
		out.push({
			name: fm.name ?? name,
			description: String(fm.description ?? ''),
			path: `.claude/skills/${name}/SKILL.md`,
			text,
		});
	}
	return out;
}

// ---------- Trigger model ----------
// Claude decides to load a skill from its description. The model scores the overlap of content words between the
// prompt and each description (with the skill name's words), and fires the best skill above a fixed threshold.
// It is lexical, so it can't judge intent; trigger tasks report it separately so it can be read with that in mind.
const STOP = new Set(
	'a an the and or of to in on for with without by is are be it its this that these those as at from into when what which who how do does did not no can could should would will may we our you your they them their i me my so if than then there here any all each every about after before up out just only also make'.split(
		' ',
	),
);
const stem = (w) => (w.length > 4 ? w.replace(/(ing|ed|s)$/, '') : w);
const words = (text) =>
	new Set(
		text
			.toLowerCase()
			.replace(/[`'".,:;()?!/]/g, ' ')
			.split(/[\s-]+/)
			.filter((w) => w.length > 2 && !STOP.has(w))
			.map(stem),
	);
export const TRIGGER_THRESHOLD = 0.34;

// An HTTP method followed by a path (`DELETE /notes/<id>/`) is an endpoint, whatever words surround it.
const normalise = (prompt) => prompt.replace(/\b(GET|POST|PUT|PATCH|DELETE)\s+`?\/\S*/g, '$& endpoint');

export function triggerScores(prompt, skills) {
	const p = words(normalise(prompt));
	return skills
		.map((s) => {
			const d = words(`${s.name.replace(/^devbook-/, '')} ${s.description}`);
			const shared = [...p].filter((w) => d.has(w));
			return { name: s.name, score: p.size ? shared.length / Math.sqrt(p.size * 4) : 0, shared };
		})
		.sort((a, b) => b.score - a.score);
}

const fired = (prompt, skills) => {
	const [best] = triggerScores(prompt, skills);
	return best && best.score >= TRIGGER_THRESHOLD ? best.name : null;
};

// ---------- Tokens ----------

let countTokens = async (text) => Math.ceil(Buffer.byteLength(text, 'utf8') / BYTES_PER_TOKEN);

async function anthropicCounter(model) {
	const key = process.env.ANTHROPIC_API_KEY;
	if (!key)
		throw new Error('--count-tokens needs ANTHROPIC_API_KEY (the token-counting endpoint is free, but needs a key)');
	const count = async (text) => {
		const res = await fetch('https://api.anthropic.com/v1/messages/count_tokens', {
			method: 'POST',
			headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
			body: JSON.stringify({ model, messages: [{ role: 'user', content: text || '.' }] }),
		});
		if (!res.ok) throw new Error(`count_tokens: HTTP ${res.status} ${await res.text()}`);
		return (await res.json()).input_tokens;
	};
	const base = await count('.');
	return async (text) => (text ? (await count(text)) - base : 0);
}

// ---------- One task × variant ----------

const DEVBOOK_REF = /\.devbook\/[\w./-]+\.md|\.devbook\/skills\/[\w-]+\/SKILL\.md/g;

export async function modelRun({ task, dir, signals }) {
	const memory = await memoryFiles(dir);
	const rules = await ruleFiles(dir);
	const skills = await skillFiles(dir);
	const touched = task.touches ?? [];
	const loaded = [...memory];
	for (const r of rules) {
		if (!r.globs.length || touched.some((t) => r.globs.some((g) => matchesGlob(t, g)))) loaded.push(r);
	}
	if (skills.length)
		loaded.push({ path: '(skill descriptions)', text: skills.map((s) => `- ${s.name}: ${s.description}`).join('\n') });

	// Files the prompt names are opened, and the skill the trigger model fires loads its body.
	const opened = new Set();
	for (const [ref] of task.prompt.matchAll(DEVBOOK_REF)) if (existsSync(join(dir, ref))) opened.add(ref);
	const firedSkill = fired(task.prompt, skills);
	const skillByPrompt = [...opened].find((p) => p.startsWith('.devbook/skills/'))?.split('/')[2];
	const skillLoaded = firedSkill ?? skillByPrompt ?? null;
	const firedEntry = skills.find((s) => s.name === firedSkill);
	if (firedEntry) loaded.push({ path: firedEntry.path, text: body(firedEntry.text) });
	for (const path of opened) {
		const text = await readMaybe(join(dir, path));
		if (text !== null && !loaded.some((f) => f.path === path)) loaded.push({ path, text });
	}

	// Reachable: `.devbook/` files the loaded text points to, one level on, plus linked skill bodies.
	const reachable = new Map();
	const loadedText = loaded.map((f) => f.text).join('\n');
	for (const [ref] of loadedText.matchAll(DEVBOOK_REF)) {
		if (loaded.some((f) => f.path === ref) || reachable.has(ref)) continue;
		const abs = join(dir, ref);
		if (!existsSync(abs) || lstatSync(abs).isDirectory()) continue;
		reachable.set(ref, await readFile(abs, 'utf8'));
	}
	for (const s of skills) if (s.name !== firedSkill && !reachable.has(s.path)) reachable.set(s.path, body(s.text));

	const ruleResults = [];
	const extra = new Map();
	for (const id of task.rules ?? []) {
		const re = new RegExp(signals[id], 'i');
		if (re.test(loadedText)) {
			ruleResults.push({ id, status: 'loaded' });
			continue;
		}
		const hits = [...reachable].filter(([, text]) => re.test(text)).sort((a, b) => a[1].length - b[1].length);
		if (hits.length) {
			ruleResults.push({ id, status: 'reachable', via: hits[0][0] });
			extra.set(hits[0][0], hits[0][1]);
		} else ruleResults.push({ id, status: 'missing' });
	}

	const checks = [];
	const missing = ruleResults.filter((r) => r.status === 'missing').map((r) => r.id);
	if (task.rules?.length)
		checks.push(
			missing.length
				? { check: 'rules-visible', pass: false, detail: `not in context or reachable: ${missing.join(', ')}` }
				: { check: 'rules-visible', pass: true, detail: ruleResults.map((r) => `${r.id} ${r.status}`).join(', ') },
		);
	if (task.skill)
		checks.push({
			check: 'skill-trigger',
			pass: skillLoaded === task.skill,
			detail:
				skillLoaded === task.skill
					? `${task.skill} loads`
					: `expected ${task.skill}, model loads ${skillLoaded ?? 'none'}`,
		});
	if (task.skillNot)
		checks.push({
			check: 'skill-trigger',
			pass: skillLoaded !== task.skillNot,
			detail:
				skillLoaded === task.skillNot ? `${task.skillNot} loads on a near miss` : `${task.skillNot} stays unloaded`,
		});

	const loadedTokens = await countTokens(loaded.map((f) => f.text).join('\n'));
	const openedTokens = await countTokens([...extra.values()].join('\n'));
	const n = ruleResults.length || 1;
	return {
		pass: checks.every((c) => c.pass),
		checks,
		rules: ruleResults,
		coverageLoaded: ruleResults.filter((r) => r.status === 'loaded').length / n,
		coverageReachable: ruleResults.filter((r) => r.status !== 'missing').length / n,
		skillLoaded,
		files: { loaded: loaded.map((f) => f.path), opened: [...extra.keys()] },
		usage: {
			inputTokens: loadedTokens + openedTokens,
			loadedTokens,
			openedTokens,
			outputTokens: 0,
			costUsd: 0,
			turns: 0,
		},
	};
}

// ---------- Main ----------

// Compare real paths: on macOS /var is a link to /private/var, so a plain URL comparison can miss.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values: opts } = parseArgs({
		options: {
			task: { type: 'string' },
			variant: { type: 'string', default: 'none,main' },
			'count-tokens': { type: 'string' },
			'no-save': { type: 'boolean', default: false },
			out: { type: 'string' },
			help: { type: 'boolean', short: 'h', default: false },
		},
	});
	if (opts.help) {
		console.log(`Usage: node evals/model.mjs [options]

  --task <ids>            comma-separated task ids (default: all)
  --variant <names>       none, main, stable, local or ref:<git-ref>, comma-separated (default: none,main)
  --count-tokens <model>  count tokens exactly with Anthropic's free token-counting endpoint (needs ANTHROPIC_API_KEY)
  --no-save               print the summary without writing evals/results/
  --out <dir>             write the results to <dir> instead of evals/results/ (the release gate uses this)

Free and deterministic: no model is called (except token counting with --count-tokens).`);
		process.exit(0);
	}
	if (opts['count-tokens']) countTokens = await anthropicCounter(opts['count-tokens']);

	const allTasks = await loadTasks();
	const { errors } = await validate(allTasks);
	if (errors.length) {
		console.error(`Invalid eval definitions:\n  ${errors.join('\n  ')}`);
		process.exit(1);
	}
	const wanted = opts.task?.split(',').map((s) => s.trim());
	const tasks = wanted ? allTasks.filter((t) => wanted.includes(t.id)) : allTasks;
	const signals = await loadSignals();
	const work = await mkdtemp(join(tmpdir(), 'devbook-model-'));
	const variantNames = opts.variant.split(',').map((s) => s.trim());
	const startedAt = new Date().toISOString();
	try {
		const prepared = new Map();
		for (const name of new Set(tasks.map((t) => t.fixture))) {
			const fixture = await loadFixture(name);
			prepared.set(name, { fixture, dir: await prepareFixture(fixture, work, { setup: false }) });
		}
		const variants = new Map();
		for (const name of variantNames) variants.set(name, await prepareVariant(name, work));
		const runs = [];
		for (const task of tasks) {
			const { fixture, dir: preparedDir } = prepared.get(task.fixture);
			for (const variantName of variantNames) {
				const dir = join(work, 'runs', `${task.id}__${variantName.replace(/[^\w.-]/g, '_')}`);
				await mkdir(dirname(dir), { recursive: true });
				await installRun({ task, fixture, variant: variants.get(variantName), prepared: preparedDir, dir });
				runs.push({ task: task.id, variant: variantName, repeat: 1, ...(await modelRun({ task, dir, signals })) });
			}
		}
		const meta = {
			method: 'modelled',
			startedAt,
			model: 'modelled',
			tokenizer: opts['count-tokens']
				? `anthropic count_tokens (${opts['count-tokens']})`
				: `bytes / ${BYTES_PER_TOKEN}`,
			triggerThreshold: TRIGGER_THRESHOLD,
			repeat: 1,
			variants: Object.fromEntries(
				variantNames.map((v) => [
					v,
					variants.get(v)
						? { label: variants.get(v).label, commit: variants.get(v).commit }
						: { label: 'no Devbook (project section only)', commit: null },
				]),
			),
		};
		const { summary, files } = await writeResults(
			{ meta, runs },
			{ save: !opts['no-save'], ...(opts.out ? { dir: opts.out } : {}) },
		);
		console.log(summary);
		for (const f of files) console.log(`Wrote ${f}`);
	} finally {
		await rm(work, { recursive: true, force: true });
	}
}
