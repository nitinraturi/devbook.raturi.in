// The project passes the setup skill's own verify script: every AGENTS.md path exists and every link resolves.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fail, pass, sh } from '../lib.mjs';

export default async function verifySetup({ dir }) {
	const script = join(dir, '.devbook/skills/devbook-setup/scripts/verify.mjs');
	if (!existsSync(script)) return fail('this Devbook version has no verify script');
	const { code, stdout } = await sh(`node '${script}' --root '${dir}'`, { cwd: dir });
	return code === 0
		? pass('verify.mjs: all paths and links in place')
		: fail(stdout.trim().split('\n').slice(0, 3).join('; '));
}
