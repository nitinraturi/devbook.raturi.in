// Writes each instruction's and stack note's `sources:` frontmatter from sources.json (the titles of the sources
// that list the file, in registry order), and adds `lastVerified` where it is missing. --check changes nothing and
// fails when a file is out of sync, a source names a missing file, or a URL isn't https. Run by npm run check.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '../..');
const check = process.argv.includes('--check');
const { sources, cadences } = JSON.parse(readFileSync(join(root, 'sources.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
let errors = 0;
const error = (msg) => (errors++, console.error(`ERROR ${msg}`));

const ids = new Set();
for (const s of sources) {
	if (ids.has(s.id)) error(`sources.json: duplicate id ${s.id}`);
	ids.add(s.id);
	if (!cadences[s.cadence]) error(`sources.json: ${s.id} has unknown cadence "${s.cadence}"`);
	if (!s.urls?.length || s.urls.some((u) => !u.startsWith('https://'))) error(`sources.json: ${s.id} needs https URLs`);
	for (const f of s.files) if (!existsSync(join(root, f))) error(`sources.json: ${s.id} lists ${f}, which is missing`);
}

/** Replace or insert a top-level frontmatter block (`key:` and its indented lines). */
function setBlock(fm, key, block) {
	const re = new RegExp(`^${key}:.*\\n(?:[ \\t]+.*\\n)*`, 'm');
	if (re.test(fm)) return fm.replace(re, block);
	// Insert before path scoping (a comment or paths:), else at the end.
	const at = fm.search(/^(# Path scoping|paths:)/m);
	return at === -1 ? `${fm}${block}` : `${fm.slice(0, at)}${block}${fm.slice(at)}`;
}

const files = ['instructions', 'stacks'].flatMap((d) =>
	readdirSync(join(root, d))
		.filter((n) => n.endsWith('.md'))
		.map((n) => `${d}/${n}`),
);
let changed = 0;
for (const file of files) {
	const text = readFileSync(join(root, file), 'utf8');
	const [, fm] = text.match(/^---\n([\s\S]*?\n)---\n/) ?? [];
	if (!fm) {
		error(`${file}: no frontmatter`);
		continue;
	}
	const titles = sources.filter((s) => s.files.includes(file)).map((s) => s.title);
	if (!titles.length) error(`${file}: no source in sources.json`);
	let next = setBlock(
		fm,
		'sources',
		`sources:\n${titles.map((t) => `  - ${JSON.stringify(t).slice(1, -1).includes(':') ? JSON.stringify(t) : t}\n`).join('')}`,
	);
	if (!/^lastVerified:/m.test(next)) next = setBlock(next, 'lastVerified', `lastVerified: ${today}\n`);
	if (next === fm) continue;
	changed++;
	if (check)
		error(`${file}: sources: or lastVerified is out of sync with sources.json; run node scripts/sync-sources.mjs`);
	else writeFileSync(join(root, file), text.replace(fm, next));
}
console.log(
	`Sources: ${sources.length} sources, ${files.length} files, ${check ? `${changed} out of sync` : `${changed} updated`}, ${errors} error(s)`,
);
if (errors) process.exit(1);
