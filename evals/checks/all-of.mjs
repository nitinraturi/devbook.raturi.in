// Passes only when every one of params.checks passes; use inside any-of for a right answer with several parts.
import { join } from 'node:path';
import { fail, pass } from '../lib.mjs';

export default async function allOf(ctx) {
	const details = [];
	for (const { check, ...params } of ctx.params.checks) {
		const fn = (await import(join(import.meta.dirname, `${check}.mjs`))).default;
		const result = await fn({ ...ctx, params });
		if (!result.pass) return fail(`${check}: ${result.detail}`);
		details.push(check);
	}
	return pass(details.join(', '));
}
