#!/usr/bin/env node
// The release gate, run by .github/workflows/release.yml before VERSION is raised on main. The base is the last
// release: the newest commit that changed VERSION (or --base).
//   1. something shipped changed since the base (instructions, stacks, skills, templates, kit, the licence, the
//      changelog or the manifest); otherwise there is nothing to release;
//   2. CHANGELOG.md has an entry that the base's changelog doesn't;
//   3. the modelled evaluation of the working tree shows no task whose pass rate fell against the base. Modelled
//      runs are deterministic, so the tolerance is 0.
// Writes the new changelog entries to --notes <file> for the job summary. Exit 0 to release, 1 to block, 3 when
// nothing shipped changed.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { loadResults, regressions, slug } from '../evals/report.mjs';
import { newEntries } from '../skills/devbook-upgrade/scripts/compare.mjs';

export const SHIPPED = [
	'instructions/',
	'stacks/',
	'skills/',
	'templates/',
	'kit/',
	'LICENSE-CC-BY-4.0',
	'CHANGELOG.md',
	'devbook.manifest.json',
];
export const TOLERANCE = 0;

const root = new URL('..', import.meta.url).pathname;
const git = (...args) => {
	try {
		return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return null;
	}
};

/** Shipped files that differ between `base` and HEAD. */
export const shippedChanges = (base) =>
	(git('diff', '--name-only', base, 'HEAD', '--', ...SHIPPED) ?? '').split('\n').filter(Boolean);

const { values } = parseArgs({ options: { notes: { type: 'string' }, base: { type: 'string' } } });
const base = values.base ?? (git('log', '-1', '--format=%H', '--', 'VERSION') || null);
const problems = [];

// 1. Anything to release?
if (base) {
	const changed = shippedChanges(base);
	if (!changed.length) {
		console.log(`Nothing shipped changed since ${base}; no release.`);
		process.exit(3);
	}
	console.log(`Shipped changes since ${base}: ${changed.length} file(s)`);
} else console.log('No earlier release found: this is the first release.');

// 2. A new changelog entry.
const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
const baseChangelog = base ? (git('show', `${base}:CHANGELOG.md`) ?? '') : '';
const fresh = base ? newEntries(changelog, baseChangelog) : newEntries(changelog, null).slice(0, 1);
if (!fresh.length) problems.push(`CHANGELOG.md has no entry newer than ${base}; add a dated entry for this release`);
else console.log(`New changelog entries: ${fresh.map((e) => e.heading).join('; ')}`);

// 3. Modelled evaluation against the base.
const out = mkdtempSync(join(tmpdir(), 'devbook-gate-'));
try {
	const baseVariant = base ? `ref:${base}` : null;
	const variants = base ? `${baseVariant},local` : 'local';
	execFileSync('node', ['evals/model.mjs', '--variant', variants, '--out', out], {
		cwd: root,
		stdio: ['ignore', 'ignore', 'inherit'],
	});
	const read = (variant) =>
		JSON.parse(
			readFileSync(
				join(
					out,
					readdirSync(out).find((f) => f.includes(`-${variant}-modelled.json`)),
				),
				'utf8',
			),
		);
	const next = read('local');
	const reference = base
		? read(slug(baseVariant))
		: (await loadResults()).find((r) => r.method === 'modelled' && ['main', 'local'].includes(r.variant));
	if (!reference) problems.push('no reference result to compare with; commit a modelled main result first');
	else {
		const worse = regressions(reference, next, TOLERANCE);
		for (const w of worse) problems.push(`eval regression: ${w.task} ${w.before * 100}% → ${w.after * 100}%`);
		console.log(
			`Modelled: pass rate ${Math.round(reference.overall.passRate * 100)}% → ${Math.round(next.overall.passRate * 100)}%, ` +
				`mean Devbook tokens ${Math.round(reference.overall.meanInputTokens)} → ${Math.round(next.overall.meanInputTokens)}`,
		);
	}
} finally {
	rmSync(out, { recursive: true, force: true });
}

if (values.notes) writeFileSync(values.notes, `${fresh.map((e) => e.body).join('\n\n')}\n`);
for (const p of problems) console.error(`BLOCKED ${p}`);
process.exit(problems.length ? 1 : 0);
