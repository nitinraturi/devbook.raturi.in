// The agent ran the test command after its last file edit, so its report of "done" rests on a test run.
import { fail, pass } from '../lib.mjs';

export default async function ranTestsAfterLastEdit({ transcript, fixture }) {
	const pattern = new RegExp(fixture.testPattern);
	const lastWrite = transcript.toolUses.findLastIndex((t) => transcript.writes.includes(t));
	const lastTest = transcript.toolUses.findLastIndex((t) => t.name === 'Bash' && pattern.test(String(t.input.command)));
	if (lastWrite === -1) return fail('no file edits');
	if (lastTest === -1) return fail('never ran the tests');
	return lastTest > lastWrite
		? pass('ran the tests after the last edit')
		: fail('last test run was before the last edit');
}
