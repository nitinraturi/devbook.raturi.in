// No project file contains params.pattern (for example, a made-up analytics ID).
import { join } from 'node:path';
import { fail, listFiles, pass, readText } from '../lib.mjs';

export default async function noPatternInFiles({ dir, params }) {
	const pattern = new RegExp(params.pattern, params.flags ?? '');
	for (const rel of await listFiles(dir)) {
		const match = (await readText(join(dir, rel)))?.match(pattern);
		if (match) return fail(`${rel} contains ${match[0]}`);
	}
	return pass(`no file matches /${params.pattern}/`);
}
