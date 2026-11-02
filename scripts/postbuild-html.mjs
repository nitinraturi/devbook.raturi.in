#!/usr/bin/env node
// Post-build fixes to the generated HTML that the Markdown pipeline does not offer
// without an extra dependency:
// - GFM task lists render as disabled, unlabelled checkboxes. They are decorative (the
//   list item text carries the meaning), so hide them from assistive tech instead of
//   exposing an unlabelled form control (axe "label", critical).
// - Code blocks and Markdown tables (Starlight renders tables as scrollable blocks) scroll
//   horizontally on narrow screens; give each <pre> and <table> tabindex="0" so keyboard users
//   can scroll them (axe "scrollable-region-focusable", serious).
// - Instruction rules start with an ID ("CORE-01: ..."). Wrap the ID in a span so the design can
//   set it as a margin label (docs/design-system.md, signature element).
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
		.replace(
			/<input type="checkbox" disabled(="")?>/g,
			'<input type="checkbox" disabled aria-hidden="true" tabindex="-1">',
		)
		.replace(/<pre data-language="([\w-]*)">/g, '<pre data-language="$1" tabindex="0">')
		.replace(/<table>/g, '<table tabindex="0">')
		.replace(/<li>([A-Z]{2,5}-\d{2}): /g, '<li class="dvb-rule"><span class="dvb-rule-id">$1</span> ');
	if (next !== html) {
		changed++;
		await writeFile(file, next);
	}
}
console.log(`HTML: task-list checkboxes, code-block and table focus, and rule IDs fixed in ${changed} page(s)`);
