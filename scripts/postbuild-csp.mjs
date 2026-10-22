#!/usr/bin/env node
// Completes the CSP in dist/_headers: hashes every inline <script> in the built HTML
// (JSON-LD data blocks excluded) and adds Google Analytics hosts only when the build
// contains the GA tag. Hosts follow Google's CSP guide for GA without ads features:
// https://developers.google.com/tag-platform/security/guides/csp
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;

async function htmlFiles(dir) {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) out.push(...(await htmlFiles(p)));
		else if (e.name.endsWith('.html')) out.push(p);
	}
	return out;
}

const hash = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;
const scripts = new Set();
let usesGa = false;

for (const file of await htmlFiles(dist)) {
	const html = await readFile(file, 'utf8');
	if (/<script[^>]*\ssrc="https:\/\/www\.googletagmanager\.com\/gtag\/js/.test(html)) usesGa = true;
	for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
		const attrs = m[1] ?? '';
		if (/\bsrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
		scripts.add(hash(m[2]));
	}
}

const path = join(dist, '_headers');
let headers = await readFile(path, 'utf8');
if (!headers.includes('__SCRIPT_HASHES__')) throw new Error('dist/_headers has no __SCRIPT_HASHES__ placeholder');
const ga = (hosts) => (usesGa ? hosts : '');
headers = headers
	.replaceAll('__SCRIPT_HASHES__', [...scripts].sort().join(' '))
	.replaceAll('__GA_SCRIPT__', ga('https://www.googletagmanager.com'))
	.replaceAll('__GA_IMG__', ga('https://www.googletagmanager.com https://*.google-analytics.com'))
	.replaceAll('__GA_CONNECT__', ga('https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com'))
	.replace(/ +;/g, ';')
	.replace(/  +/g, ' ');
await writeFile(path, headers);
console.log(`CSP: ${scripts.size} inline script hash(es); GA hosts ${usesGa ? 'added' : 'not needed'}`);
