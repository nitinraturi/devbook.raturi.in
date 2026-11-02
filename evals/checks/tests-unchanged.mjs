// Existing test files are neither edited nor deleted (params.paths). New test files are allowed.
import { fail, pass, sh } from '../lib.mjs';

export default async function testsUnchanged({ dir, params, initialCommit }) {
	const paths = params.paths.map((p) => `'${p}'`).join(' ');
	const { stdout } = await sh(`git diff --name-status ${initialCommit} -- ${paths}`, { cwd: dir });
	const changed = stdout
		.trim()
		.split('\n')
		.filter((line) => /^[MD]/.test(line));
	return changed.length ? fail(`existing tests changed: ${changed.join(', ')}`) : pass('existing tests untouched');
}
