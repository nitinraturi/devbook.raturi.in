// Checks devbook.manifest.json against disk and enforces the size budgets from AGENTS.md.
// Fails if a file in instructions/, stacks/ or templates/ is missing from the manifest, a
// listed file is missing on disk, or a budget is exceeded. Overages listed under
// `pendingOverBudget` only warn, and fail once they fit, so the list can't go stale.
import { readFile, readdir, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('devbook.manifest.json', root), 'utf8'));
const { budgets, pendingOverBudget = {}, files } = manifest;
const KINDS = { instructions: 'instruction', stacks: 'stack', templates: 'template' };
const TIERS = new Set(['always', 'path', 'task']);

let errors = 0;
const error = (msg) => (errors++, console.error(`ERROR ${msg}`));
const kb = (bytes) => `${(bytes / 1000).toFixed(1)} KB, ~${Math.round(bytes / 4).toLocaleString('en')} tokens`;

const listed = new Map(files.map((f) => [f.path, f]));
for (const dir of Object.keys(KINDS)) {
	for (const name of (await readdir(new URL(`${dir}/`, root))).filter((n) => n.endsWith('.md'))) {
		if (!listed.has(`${dir}/${name}`)) error(`${dir}/${name} is not listed in devbook.manifest.json`);
	}
}

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

for (const { name, bytes, limit } of results) {
	const over = bytes > limit;
	const line = `${name}: ${kb(bytes)} (budget ${kb(limit)})`;
	if (over && pendingOverBudget[name]) console.warn(`WARN  ${line}. Known: ${pendingOverBudget[name]}`);
	else if (over) error(line);
	else if (pendingOverBudget[name]) error(`${name} is now within budget; remove it from pendingOverBudget`);
	else if (name === 'always' || name === 'website') console.log(`OK    ${line}`);
}
for (const name of Object.keys(pendingOverBudget)) {
	if (!results.some((r) => r.name === name)) error(`pendingOverBudget lists unknown budget "${name}"`);
}

console.log(`Budget: ${errors} error(s)`);
if (errors) process.exit(1);
