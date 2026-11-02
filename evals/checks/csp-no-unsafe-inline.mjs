// The Content-Security-Policy in public/_headers still exists and its script-src has no 'unsafe-inline'.
import { join } from 'node:path';
import { fail, pass, readText } from '../lib.mjs';

export default async function cspNoUnsafeInline({ dir }) {
	const headers = await readText(join(dir, 'public/_headers'));
	const csp = headers?.match(/Content-Security-Policy:\s*(.+)/i)?.[1];
	if (!csp) return fail('no Content-Security-Policy in public/_headers');
	const scriptSrc = csp.match(/script-src([^;]*)/)?.[1] ?? csp.match(/default-src([^;]*)/)?.[1] ?? '';
	if (/'unsafe-inline'/.test(scriptSrc)) return fail(`script-src allows 'unsafe-inline': ${scriptSrc.trim()}`);
	if (/(^|\s)\*(\s|$)/.test(scriptSrc)) return fail(`script-src allows any origin: ${scriptSrc.trim()}`);
	return pass(`script-src:${scriptSrc}`);
}
