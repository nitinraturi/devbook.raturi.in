// The agent loaded skill params.skill (the Skill tool, or a Read of its SKILL.md); with params.negate, it did not.
// Trigger tests use this: prompts that should load a skill, and near misses that shouldn't.
import { fail, pass } from '../lib.mjs';

export default async function skillLoaded({ transcript, params }) {
	const loaded = transcript.toolUses.some(
		(t) =>
			(t.name === 'Skill' && String(t.input.skill ?? t.input.command ?? t.input.name ?? '').includes(params.skill)) ||
			(t.name === 'Read' && String(t.input.file_path ?? '').includes(`${params.skill}/SKILL.md`)),
	);
	if (params.negate)
		return loaded ? fail(`${params.skill} loaded on a near-miss prompt`) : pass(`${params.skill} not loaded`);
	return loaded ? pass(`${params.skill} loaded`) : fail(`${params.skill} was not loaded`);
}
