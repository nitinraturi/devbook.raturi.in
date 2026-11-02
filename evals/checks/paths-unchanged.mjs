// No file under params.paths was added, edited or deleted, for review-only and ask-first tasks.
import { fail, pass, sh } from '../lib.mjs';

export default async function pathsUnchanged({ dir, params, initialCommit }) {
	const paths = params.paths.map((p) => `'${p}'`).join(' ');
	await sh('git add -A -N .', { cwd: dir });
	const { stdout } = await sh(`git diff --name-only ${initialCommit} -- ${paths}`, { cwd: dir });
	const changed = stdout.trim().split('\n').filter(Boolean);
	return changed.length
		? fail(`changed: ${changed.slice(0, 5).join(', ')}`)
		: pass(`${params.paths.join(', ')} unchanged`);
}
