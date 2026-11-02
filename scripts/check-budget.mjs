// Checks devbook.manifest.json against disk and enforces the size budgets from AGENTS.md.
// Fails if a file in instructions/, stacks/, templates/ or skills/ is missing from the manifest, a
// listed file is missing on disk, or a budget is exceeded. Overages listed under
// `pendingOverBudget` only warn, and fail once they fit, so the list can't go stale.
// Also checks loading metadata: path-tier instructions carry identical `paths` and `applyTo`
// globs, and skills follow the Agent Skills format.
// Budgets only go down (the ratchet): a budget may rise only when the same change commits eval results in
// evals/results/ that show no pass-rate loss against the base's main or stable result. The base is BUDGET_BASE,
// else the merge base with origin/main, else the previous commit.
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { regressions } from '../evals/report.mjs';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('devbook.manifest.json', root), 'utf8'));
const { budgets, pendingOverBudget = {}, files } = manifest;
const KINDS = { instructions: 'instruction', stacks: 'stack', templates: 'template', skills: 'skill' };
const TIERS = new Set(['always', 'path', 'task']);

let errors = 0;
const error = (msg) => (errors++, console.error(`ERROR ${msg}`));
const kb = (bytes) => `${(bytes / 1000).toFixed(1)} KB, ~${Math.round(bytes / 4).toLocaleString('en')} tokens`;

const listed = new Map(files.map((f) => [f.path, f]));
for (const dir of Object.keys(KINDS)) {
	const entries = await readdir(new URL(`${dir}/`, root), { withFileTypes: true });
	const paths =
		dir === 'skills'
			? entries.filter((e) => e.isDirectory()).map((e) => `${dir}/${e.name}/SKILL.md`)
			: entries.filter((e) => e.name.endsWith('.md')).map((e) => `${dir}/${e.name}`);
	for (const path of paths) if (!listed.has(path)) error(`${path} is not listed in devbook.manifest.json`);
}

const frontmatter = async (path) =>
	parseYaml((await readFile(new URL(path, root), 'utf8')).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '') ?? {};

for (const f of files.filter((f) => f.kind === 'instruction')) {
	const fm = await frontmatter(f.path).catch(() => ({}));
	if (f.tier === 'path') {
		const applyTo = String(fm.applyTo ?? '')
			.split(',')
			.filter(Boolean);
		if (!fm.paths?.length) error(`${f.path}: path-tier instruction needs paths: globs`);
		else if (fm.paths.join(',') !== applyTo.join(',')) error(`${f.path}: paths and applyTo must list the same globs`);
		else if (fm.paths.join(',') !== (f.globs ?? []).join(','))
			error(`${f.path}: globs in devbook.manifest.json must equal its paths: frontmatter`);
	} else if (fm.paths || fm.applyTo) error(`${f.path}: only path-tier instructions carry paths/applyTo`);
}

let skillDescriptionChars = 0;
for (const f of files.filter((f) => f.kind === 'skill')) {
	const folder = f.path.split('/')[1];
	const text = await readFile(new URL(f.path, root), 'utf8').catch(() => '');
	const fm = await frontmatter(f.path).catch(() => ({}));
	if (fm.name !== folder) error(`${f.path}: name must be "${folder}", the folder name`);
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? '') || fm.name.length > 64) error(`${f.path}: invalid name`);
	if (!fm.description || fm.description.length > 1024) error(`${f.path}: description must be 1–1024 characters`);
	if (text.split('\n').length >= 500) error(`${f.path}: body must stay under 500 lines`);
	if (f.linked !== false) skillDescriptionChars += fm.description?.length ?? 0;
}

// Every file's adapters are defined, so link.mjs never meets one it can't write.
for (const f of files)
	for (const id of f.adapters ?? []) if (!manifest.adapters?.[id]) error(`${f.path}: unknown adapter "${id}"`);

const size = new Map();
for (const f of files) {
	const dir = f.path.split('/')[0];
	if (KINDS[dir] !== f.kind) error(`${f.path}: kind "${f.kind}" does not match its folder`);
	if (!TIERS.has(f.tier)) error(`${f.path}: unknown tier "${f.tier}"`);
	if (!f.loadWhen) error(`${f.path}: missing loadWhen`);
	try {
		size.set(f.path, (await stat(new URL(f.path, root))).size);
	} catch {
		error(`${f.path} is listed in devbook.manifest.json but missing on disk`);
	}
}

const results = [];
const budget = (name, bytes, limit) => results.push({ name, bytes, limit });
for (const f of files.filter((f) => f.kind === 'instruction'))
	budget(f.path, size.get(f.path) ?? 0, budgets.instructionBytes);
const always = files.filter((f) => f.tier === 'always').map((f) => f.path);
const sum = (paths) => paths.reduce((n, p) => n + (size.get(p) ?? 0), 0);
budget('always', sum(always), budgets.alwaysBytes);
budget('website', sum([...always, ...budgets.websiteSet]), budgets.websiteBytes);
// Codex joins AGENTS.md files up to project_doc_max_bytes (32 KiB by default). Keep the always tier, the template's
// Devbook section and a typical Project section under half of it, so projects keep wide margin.
const template = await readFile(new URL('templates/AGENTS.md', root), 'utf8');
budget('codex chain (always + AGENTS.md, half of 32 KiB)', sum(always) + Buffer.byteLength(template) + 2000, 16384);
// Every linked skill's description loads in every chat, so their total is budgeted like the always tier.
budget('skill descriptions', skillDescriptionChars, budgets.skillDescriptionChars);

for (const { name, bytes, limit } of results) {
	const over = bytes > limit;
	const line = `${name}: ${kb(bytes)} (budget ${kb(limit)})`;
	if (over && pendingOverBudget[name]) console.warn(`WARN  ${line}. Known: ${pendingOverBudget[name]}`);
	else if (over) error(line);
	else if (pendingOverBudget[name]) error(`${name} is now within budget; remove it from pendingOverBudget`);
	else if (!name.includes('/')) console.log(`OK    ${line}`);
}
for (const name of Object.keys(pendingOverBudget)) {
	if (!results.some((r) => r.name === name)) error(`pendingOverBudget lists unknown budget "${name}"`);
}

// ---------- Ratchet ----------

const git = (...args) => {
	try {
		return execFileSync('git', args, {
			cwd: new URL('.', root).pathname,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		return null;
	}
};
const head = git('rev-parse', 'HEAD');
const mergeBase = git('merge-base', 'HEAD', 'origin/main');
const base = process.env.BUDGET_BASE || (mergeBase && mergeBase !== head ? mergeBase : git('rev-parse', 'HEAD~1'));
const baseManifest = base && git('show', `${base}:devbook.manifest.json`);
if (!baseManifest) console.log('Ratchet: no base commit to compare with; skipped');
else {
	const before = JSON.parse(baseManifest).budgets ?? {};
	const rises = Object.keys(budgets).filter(
		(k) => typeof budgets[k] === 'number' && budgets[k] > (before[k] ?? Infinity),
	);
	if (!rises.length) console.log(`Ratchet: no budget rose since ${base.slice(0, 7)}`);
	else {
		const changed = [
			...(git('diff', '--name-only', base, '--', 'evals/results/') ?? '').split('\n'),
			...(git('ls-files', '--others', '--exclude-standard', 'evals/results/') ?? '').split('\n'),
		].filter((f) => f.endsWith('.json'));
		const baseFiles = (git('ls-tree', '--name-only', base, 'evals/results/') ?? '')
			.split('\n')
			.filter((f) => f.endsWith('.json'));
		const reference = (r) =>
			baseFiles
				.map((f) => JSON.parse(git('show', `${base}:${f}`)))
				.filter((b) => ['main', 'stable'].includes(b.variant) && b.method === r.method && b.model === r.model)
				.sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
		const evidence = [];
		for (const f of changed) {
			const r = JSON.parse(await readFile(new URL(f, root), 'utf8'));
			if (r.variant === 'none') continue;
			const ref = reference(r);
			if (!ref) continue;
			const worse = regressions(ref, r);
			if (worse.length)
				error(`${f}: pass rate fell on ${worse.map((w) => w.task).join(', ')}, so the budget can't rise`);
			else evidence.push(f);
		}
		if (!evidence.length)
			error(
				`budget raised (${rises.join(', ')}) without eval results showing no pass-rate loss; commit evals/results/ from \`npm run evals:model\` (see AGENTS.md)`,
			);
		else console.log(`Ratchet: ${rises.join(', ')} rose, backed by ${evidence.join(', ')}`);
	}
}

console.log(`Budget: ${errors} error(s)`);
if (errors) process.exit(1);
