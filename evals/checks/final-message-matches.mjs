// The agent's final report matches params.pattern, for example saying what it could not do. Heuristic.
import { fail, pass } from '../lib.mjs';

export default async function finalMessageMatches({ transcript, params }) {
	const ok = new RegExp(params.pattern, params.flags ?? 'i').test(transcript.finalText);
	const excerpt = transcript.finalText.replace(/\s+/g, ' ').slice(0, 160);
	return ok ? pass(`report matches: "${excerpt}"`) : fail(`report does not match /${params.pattern}/: "${excerpt}"`);
}
