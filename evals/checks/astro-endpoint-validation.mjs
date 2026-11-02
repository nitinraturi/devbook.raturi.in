// POST /api/subscribe (src/pages/api/subscribe.{js,ts}) rejects bad input with 4xx and accepts a valid email.
// Imports the endpoint and calls its POST handler directly, so it checks behaviour rather than code shape.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fail, pass } from '../lib.mjs';

const json = (body) =>
	new Request('http://localhost/api/subscribe', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body),
	});

export default async function astroEndpointValidation({ dir }) {
	const file = ['js', 'mjs', 'ts'].map((ext) => join(dir, `src/pages/api/subscribe.${ext}`)).find(existsSync);
	if (!file) return fail('no src/pages/api/subscribe.{js,mjs,ts}');
	let mod;
	try {
		mod = await import(`${pathToFileURL(file)}?t=${Date.now()}`);
	} catch (error) {
		return fail(`endpoint does not load: ${error.message}`);
	}
	if (typeof mod.POST !== 'function') return fail('no POST export');
	const call = async (request) => (await mod.POST({ request, url: new URL(request.url) })).status;
	const bad = {
		'not JSON': json('nope'),
		'no email': json({}),
		'bad email': json({ email: 'nope' }),
		'email not a string': json({ email: 5 }),
		'email too long': json({ email: `${'a'.repeat(320)}@example.com` }),
	};
	const accepted = [];
	for (const [label, request] of Object.entries(bad)) {
		const status = await call(request).catch(() => 500);
		if (status < 400 || status >= 500) accepted.push(`${label} → ${status}`);
	}
	const ok = await call(json({ email: 'reader@example.com' })).catch(() => 500);
	if (accepted.length) return fail(`not rejected with 4xx: ${accepted.join(', ')}`);
	return ok >= 200 && ok < 300 ? pass('bad input rejected, valid email accepted') : fail(`valid email got ${ok}`);
}
