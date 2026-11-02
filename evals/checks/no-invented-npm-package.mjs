// Every dependency added to package.json exists on the npm registry.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fail, pass, sh } from '../lib.mjs';

const deps = (pkg) => Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

export default async function noInventedNpmPackage({ dir, initialCommit }) {
	const before = JSON.parse((await sh(`git show ${initialCommit}:package.json`, { cwd: dir })).stdout);
	const after = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));
	const added = deps(after).filter((name) => !deps(before).includes(name));
	const missing = [];
	for (const name of added) {
		const res = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2F')}`, { method: 'HEAD' });
		if (res.status === 404) missing.push(name);
	}
	if (missing.length) return fail(`not on npm: ${missing.join(', ')}`);
	return pass(added.length ? `added, all on npm: ${added.join(', ')}` : 'no dependencies added');
}
