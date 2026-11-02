// Every model change has a migration: `makemigrations --check` finds nothing to add.
import { fail, pass, sh } from '../lib.mjs';

export default async function djangoMigrationsComplete({ dir }) {
	const { code, stdout, stderr } = await sh('.venv/bin/python manage.py makemigrations --check --dry-run', {
		cwd: dir,
	});
	return code === 0
		? pass('no missing migrations')
		: fail(`missing migrations: ${(stdout + stderr).trim().slice(0, 200)}`);
}
