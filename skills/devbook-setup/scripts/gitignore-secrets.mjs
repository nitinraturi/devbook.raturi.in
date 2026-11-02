#!/usr/bin/env node
// SEC-29: adds the patterns for files that can hold secrets to the project's .gitignore, and lists any such file
// git already tracks (those need `git rm --cached` and the secret revoked). Node only, no dependencies.
//
//   node .devbook/skills/devbook-setup/scripts/gitignore-secrets.mjs [--dry-run] [--check] [--root <dir>]
//
// --dry-run prints what it would add; --check exits 1 when a pattern is missing or a secret file is tracked.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

/** Files that can hold secrets, with why. Order is the order they are written. */
export const PATTERNS = [
	['.env', 'environment files'],
	['.env.*', 'environment files'],
	['!.env.example', 'the committed template with names only (SEC-03)'],
	['.dev.vars*', 'Cloudflare local secrets'],
	['*.pem', 'keys and certificates'],
	['*.key', 'keys and certificates'],
	['*.p12', 'keys and certificates'],
	['*.pfx', 'keys and certificates'],
	['.netrc', 'credentials'],
	['.pypirc', 'credentials'],
	['.npmrc', 'credentials (only when it holds a token; see below)'],
	['*.local.*', 'local settings'],
	['.claude/settings.local.json', 'assistant local settings'],
	['.idea/workspace.xml', 'editor local settings'],
];

/** True when a .npmrc holds an auth token, so it must not be committed. */
export const npmrcHasToken = (text) => /(_authToken|_auth|_password)\s*=/.test(text);

/** The patterns not yet in `gitignore` (exact lines; comments and blanks ignored). */
export function missingPatterns(gitignore, { skipNpmrc = false } = {}) {
	const lines = new Set(
		gitignore
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l && !l.startsWith('#')),
	);
	return PATTERNS.filter(([p]) => !lines.has(p) && !lines.has(`/${p}`) && !(skipNpmrc && p === '.npmrc'));
}

/** The text to append for `missing`, under one heading. */
export const block = (missing) =>
	missing.length ? `\n# Files that can hold secrets (Devbook SEC-29)\n${missing.map(([p]) => p).join('\n')}\n` : '';

const git = (root, args) =>
	execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

/** Tracked files that match the secret patterns, so they are already in history. */
export function trackedSecrets(root) {
	try {
		return git(root, ['ls-files', '--cached', '--ignored', '--exclude-standard'])
			.split('\n')
			.filter(Boolean)
			.filter((f) => !/(^|\/)\.env\.example$/.test(f));
	} catch {
		return [];
	}
}

// Compare real paths: on macOS /var is a link to /private/var, so a plain URL comparison can miss.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values } = parseArgs({
		options: {
			'dry-run': { type: 'boolean', default: false },
			check: { type: 'boolean', default: false },
			root: { type: 'string', default: '.' },
		},
	});
	const root = resolve(values.root);
	try {
		git(root, ['rev-parse', '--git-dir']);
	} catch {
		console.error(`${root} is not a git repository. Run this from the project root, or pass --root <dir>.`);
		process.exit(2);
	}
	const file = join(root, '.gitignore');
	const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
	// A committed .npmrc without a token is ordinary config (registry, engine-strict), so leave it tracked.
	const npmrc = join(root, '.npmrc');
	const skipNpmrc = existsSync(npmrc) && !npmrcHasToken(readFileSync(npmrc, 'utf8'));
	const missing = missingPatterns(current, { skipNpmrc });

	if (values['dry-run'] || values.check) {
		for (const [p, why] of missing) console.log(`missing: ${p} (${why})`);
	} else if (missing.length) {
		writeFileSync(file, `${current}${current && !current.endsWith('\n') ? '\n' : ''}${block(missing)}`);
		console.log(`Added ${missing.length} pattern(s) to .gitignore: ${missing.map(([p]) => p).join(', ')}`);
	} else console.log('.gitignore already has every secret-file pattern.');
	if (skipNpmrc)
		console.log('.npmrc is tracked and holds no token, so it was left out. Keep tokens out of it (SEC-03).');

	// Check what is tracked against the patterns as they would be after this run.
	const tracked = values['dry-run'] ? [] : trackedSecrets(root);
	for (const f of tracked)
		console.log(`tracked: ${f}. Remove it from the index (git rm --cached '${f}') and revoke what it held.`);
	if (values['dry-run'])
		console.log('Dry run: nothing written; tracked files are checked after the patterns are added.');
	if (values.check && (missing.length || tracked.length)) process.exit(1);
}
