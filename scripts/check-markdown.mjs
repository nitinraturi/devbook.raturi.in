// Fails if a built Markdown endpoint (dist/**/index.md) still contains an MDX component,
// that is, a capitalised tag such as <Tabs> or <Code />, outside fenced code.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const bad = [];
for (const entry of await readdir(dist, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || entry.name !== 'index.md') continue;
	const file = join(entry.parentPath, entry.name);
	let fence;
	(await readFile(file, 'utf8')).split('\n').forEach((line, i) => {
		const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
		if (fence) {
			if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = undefined;
		} else if (marker) fence = marker;
		else if (/<\/?[A-Z][\w.]*[\s/>]/.test(line.replace(/`[^`]*`/g, '')))
			bad.push(`${relative(dist, file)}:${i + 1}: ${line.trim()}`);
	});
}
if (bad.length) {
	console.error(`Markdown endpoints contain MDX components:\n  ${bad.join('\n  ')}`);
	process.exit(1);
}
console.log('Markdown endpoints: no MDX components');
