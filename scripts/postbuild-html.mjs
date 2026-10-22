#!/usr/bin/env node
// Post-build fixes to the generated HTML that the Markdown pipeline does not offer
// without an extra dependency:
// - GFM task lists render as disabled, unlabelled checkboxes. They are decorative (the
//   list item text carries the meaning), so hide them from assistive tech instead of
//   exposing an unlabelled form control (axe "label", critical).
// - Code blocks scroll horizontally; give each <pre> tabindex="0" so keyboard users can
//   scroll them (axe "scrollable-region-focusable", serious).
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;

async function htmlFiles(dir) {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) out.push(...(await htmlFiles(p)));
		else if (e.name.endsWith('.html')) out.push(p);
	}
	return out;
}

let changed = 0;
for (const file of await htmlFiles(dist)) {
	const html = await readFile(file, 'utf8');
	const next = html
		.replace(/<input type="checkbox" disabled(="")?>/g, '<input type="checkbox" disabled aria-hidden="true" tabindex="-1">')
		.replace(/<pre data-language="([\w-]*)">/g, '<pre data-language="$1" tabindex="0">');
	if (next !== html) {
		changed++;
		await writeFile(file, next);
	}
}
console.log(`HTML: task-list checkboxes and code-block focus fixed in ${changed} page(s)`);
