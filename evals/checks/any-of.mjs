// Passes when at least one of params.checks passes, for tasks with more than one right answer
// (for example, "made the change correctly" or "stopped and asked for approval").
import { join } from 'node:path';
import { fail, pass } from '../lib.mjs';

export default async function anyOf(ctx) {
	const details = [];
	for (const { check, ...params } of ctx.params.checks) {
		const fn = (await import(join(import.meta.dirname, `${check}.mjs`))).default;
		const result = await fn({ ...ctx, params });
		if (result.pass) return pass(`${check}: ${result.detail}`);
		details.push(`${check}: ${result.detail}`);
	}
	return fail(details.join('; '));
}
