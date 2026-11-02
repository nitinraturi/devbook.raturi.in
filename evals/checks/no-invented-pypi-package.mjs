// Every requirement added to requirements.txt exists on PyPI.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fail, pass, sh } from '../lib.mjs';

const names = (text) =>
	text
		.split('\n')
		.map((line) => line.replace(/#.*/, '').trim())
		.filter((line) => line && !line.startsWith('-'))
		.map((line) => line.split(/[<>=!~;[\s]/)[0].toLowerCase());

export default async function noInventedPypiPackage({ dir, initialCommit }) {
	const before = names((await sh(`git show ${initialCommit}:requirements.txt`, { cwd: dir })).stdout);
	const after = names((await readFile(join(dir, 'requirements.txt'), 'utf8').catch(() => '')) || '');
	const added = after.filter((name) => !before.includes(name));
	const missing = [];
	for (const name of added) {
		const res = await fetch(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`);
		if (res.status === 404) missing.push(name);
	}
	if (missing.length) return fail(`not on PyPI: ${missing.join(', ')}`);
	return pass(added.length ? `added, all on PyPI: ${added.join(', ')}` : 'no requirements added');
}
