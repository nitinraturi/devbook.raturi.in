// params.path matches params.pattern (or, with params.negate, does not). A missing file never matches.
import { join } from 'node:path';
import { fail, pass, readText } from '../lib.mjs';

export default async function fileMatches({ dir, params }) {
	const text = await readText(join(dir, params.path));
	const found = text !== null && new RegExp(params.pattern, params.flags ?? '').test(text);
	const want = !params.negate;
	const what = `${params.path} ${found ? 'matches' : 'does not match'} /${params.pattern}/`;
	return found === want ? pass(what) : fail(what);
}
