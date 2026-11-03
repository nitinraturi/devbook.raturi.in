#!/usr/bin/env node
// The release gate, run by .github/workflows/release.yml before VERSION is raised on main. The base is the last
// release: the newest commit that changed VERSION (or --base).
//   1. something shipped changed since the base; otherwise there is nothing to release;
//   2. CHANGELOG.md has an entry that the base's changelog doesn't;
//   3. the newest committed measured eval (evals/results/*.json), if there is one, has no core case where Devbook
//      did worse than no Devbook (Δ < 0).
// Writes the new changelog entries to --notes <file> for the job summary. Exit 0 to release, 1 to block, 3 when
// nothing shipped changed.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// Everything projects install or are pointed at.
export const SHIPPED = [
	'core/',
	'catalog/',
	'prompt/',
	'optional/',
	'.claude-plugin/',
	'LICENSE-CC-BY-4.0',
	'CHANGELOG.md',
];

const root = join(fileURLToPath(import.meta.url), '../..');
const git = (...args) => {
	try {
		return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return null;
	}
};

/** Changelog entries (`## YYYY-MM-DD: title` sections) in `text` that `baseText` doesn't have. */
export function newEntries(text, baseText) {
	const entries = (t) =>
		(t ?? '')
			.split(/^(?=## \d{4}-\d{2}-\d{2}: )/m)
			.filter((s) => s.startsWith('## '))
			.map((body) => ({ heading: body.split('\n')[0].slice(3), body: body.trim() }));
	const seen = new Set(entries(baseText).map((e) => e.heading));
	return entries(text).filter((e) => !seen.has(e.heading));
}

/** Core cases where the measured with-Devbook score fell below the no-Devbook score. */
export const regressions = (summary) =>
	(summary?.suites?.core?.cases ?? []).filter((c) => typeof c.delta === 'number' && c.delta < 0);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const { values } = parseArgs({ options: { notes: { type: 'string' }, base: { type: 'string' } } });
	const base = values.base ?? (git('log', '-1', '--format=%H', '--', 'VERSION') || null);
	const problems = [];

	if (base) {
		const changed = (git('diff', '--name-only', base, 'HEAD', '--', ...SHIPPED) ?? '').split('\n').filter(Boolean);
		if (!changed.length) {
			console.log(`Nothing shipped changed since ${base}; no release.`);
			process.exit(3);
		}
		console.log(`Shipped changes since ${base}: ${changed.length} file(s)`);
	} else console.log('No earlier release found: this is the first release.');

	const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
	const fresh = newEntries(changelog, base ? git('show', `${base}:CHANGELOG.md`) : null).slice(0, base ? undefined : 1);
	if (!fresh.length) problems.push(`CHANGELOG.md has no entry newer than ${base}; add a dated entry for this release`);
	else console.log(`New changelog entries: ${fresh.map((e) => e.heading).join('; ')}`);

	const results = join(root, 'evals/results');
	const newest = existsSync(results)
		? readdirSync(results)
				.filter((f) => f.endsWith('.json'))
				.sort()
				.at(-1)
		: undefined;
	if (newest) {
		for (const c of regressions(JSON.parse(readFileSync(join(results, newest), 'utf8'))))
			problems.push(`measured eval ${newest}: ${c.name} is worse with Devbook (Δ ${c.delta})`);
	} else console.log('No measured eval committed yet; skipping the eval check.');

	if (values.notes) writeFileSync(values.notes, `${fresh.map((e) => e.body).join('\n\n')}\n`);
	for (const p of problems) console.error(`BLOCKED ${p}`);
	process.exit(problems.length ? 1 : 0);
}
