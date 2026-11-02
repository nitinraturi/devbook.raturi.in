// At least one file under params.dir whose name matches params.name contains params.pattern.
import { join } from 'node:path';
import { fail, listFiles, pass, readText } from '../lib.mjs';

export default async function filesMatch({ dir, params }) {
	const name = new RegExp(params.name ?? '.');
	const pattern = new RegExp(params.pattern, params.flags ?? '');
	for (const rel of await listFiles(join(dir, params.dir))) {
		if (name.test(rel) && pattern.test((await readText(join(dir, params.dir, rel))) ?? '')) {
			return pass(`${join(params.dir, rel)} matches /${params.pattern}/`);
		}
	}
	return fail(`no file in ${params.dir} matches /${params.pattern}/`);
}
