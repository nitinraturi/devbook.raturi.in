#!/usr/bin/env node
// Checks every page under src/content/docs for a title and a meta description.
// Fails on a missing title or description; warns when a description is outside
// 70–170 characters or a title is over 60. Page text is never changed here.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../src/content/docs/', import.meta.url).pathname;

async function files(dir) {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) out.push(...(await files(p)));
		else if (/\.mdx?$/.test(e.name)) out.push(p);
	}
	return out;
}

const field = (fm, key) => {
	const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	return m?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2');
};

let errors = 0;
let warnings = 0;
for (const file of (await files(root)).sort()) {
	const rel = relative(root, file);
	const fm = (await readFile(file, 'utf8')).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	const title = field(fm, 'title');
	const description = field(fm, 'description');
	if (!title) {
		errors++;
		console.error(`ERROR ${rel}: missing title`);
	} else if (title.length > 60) {
		warnings++;
		console.warn(`WARN  ${rel}: title is ${title.length} chars (> 60)`);
	}
	if (!description) {
		errors++;
		console.error(`ERROR ${rel}: missing description`);
	} else if (description.length < 70 || description.length > 170) {
		warnings++;
		console.warn(`WARN  ${rel}: description is ${description.length} chars (want 70–170)`);
	}
}
console.log(`Descriptions: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
