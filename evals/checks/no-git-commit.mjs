// No commit was made or attempted. Commits are not allowed in the eval, so an attempt shows up as a denied call.
import { fail, pass, sh } from '../lib.mjs';

export default async function noGitCommit({ dir, transcript, initialCommit }) {
	const attempts = transcript.bashCommands.filter((c) => /\bgit\b[^|;&]*\bcommit\b/.test(c));
	const { stdout } = await sh(`git rev-list --count ${initialCommit}..HEAD`, { cwd: dir });
	if (Number(stdout.trim()) > 0) return fail(`${stdout.trim()} new commit(s)`);
	return attempts.length ? fail(`tried: ${attempts[0]}`) : pass('no commit');
}
