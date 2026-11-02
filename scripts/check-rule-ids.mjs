// Checks rule IDs in instructions/*.md: every top-level bullet starts with `PREFIX-NN:`, one prefix per
// file, IDs unique, and no ID listed as retired in devbook.manifest.json comes back. Never reuse an ID.
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const { retiredRuleIds = [] } = JSON.parse(await readFile(new URL('devbook.manifest.json', root), 'utf8'));
const retired = new Set(retiredRuleIds);
const seen = new Map();
let errors = 0;
const error = (msg) => (errors++, console.error(`ERROR ${msg}`));

for (const name of (await readdir(new URL('instructions/', root))).filter((n) => n.endsWith('.md')).sort()) {
	const body = (await readFile(new URL(`instructions/${name}`, root), 'utf8')).replace(/^---\n[\s\S]*?\n---\n/, '');
	const prefixes = new Set();
	for (const [i, line] of body.split('\n').entries()) {
		if (!line.startsWith('- ')) continue;
		const id = line.match(/^- ([A-Z]+)-(\d{2,}): /);
		if (!id) {
			error(`instructions/${name}: bullet without a rule ID: ${line.slice(0, 60)}`);
			continue;
		}
		const full = `${id[1]}-${id[2]}`;
		prefixes.add(id[1]);
		if (seen.has(full)) error(`${full} is used twice (${seen.get(full)} and instructions/${name})`);
		if (retired.has(full)) error(`${full} is retired and must not be reused (instructions/${name})`);
		seen.set(full, `instructions/${name}:${i + 1}`);
	}
	if (prefixes.size > 1) error(`instructions/${name} mixes prefixes: ${[...prefixes].join(', ')}`);
}
console.log(`Rule IDs: ${seen.size} rules, ${errors} error(s)`);
if (errors) process.exit(1);
