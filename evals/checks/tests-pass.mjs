// The fixture's test command exits 0 in the final state.
import { fail, pass, sh } from '../lib.mjs';

export default async function testsPass({ dir, fixture }) {
	const { code, stdout, stderr } = await sh(fixture.test, { cwd: dir });
	const tail = `${stdout}\n${stderr}`.trim().split('\n').slice(-5).join(' | ');
	return code === 0 ? pass(`\`${fixture.test}\` passed`) : fail(`\`${fixture.test}\` exited ${code}: ${tail}`);
}
