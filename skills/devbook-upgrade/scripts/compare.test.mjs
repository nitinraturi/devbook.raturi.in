import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { compare, compareVersions, entries, markdown, newEntries, upgradeNotes } from './compare.mjs';

const dirs = [];
after(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));
const tmp = () => {
	const d = mkdtempSync(join(tmpdir(), 'devbook-compare-'));
	dirs.push(d);
	return d;
};

const CHANGELOG = `# Changelog

## 2026-11-03: Newer

### Changed
- Something.

**Upgrade:** add the new line to AGENTS.md.

## 2026-11-02: Older

- Old thing.
`;
const OLD = `# Changelog\n\n## 2026-11-02: Older\n\n- Old thing.\n`;

function setup({ current = '2026.11.02.1', local = OLD, newest = '2026.11.03' } = {}) {
	const root = tmp();
	mkdirSync(join(root, '.devbook'));
	if (current) writeFileSync(join(root, '.devbook/VERSION'), `${current}\n`);
	if (local) writeFileSync(join(root, '.devbook/CHANGELOG.md'), local);
	const source = tmp();
	writeFileSync(join(source, 'VERSION'), `${newest}\n`);
	writeFileSync(join(source, 'CHANGELOG.md'), CHANGELOG);
	return { root, source };
}

test('compareVersions orders dated versions and suffixes', () => {
	assert.ok(compareVersions('2026.11.03', '2026.11.02.9') > 0);
	assert.ok(compareVersions('v2026.11.02', '2026.11.02.1') < 0);
	assert.equal(compareVersions('2026.11.02', '2026.11.02'), 0);
});

test('entries, newEntries and upgradeNotes', () => {
	assert.deepEqual(
		entries(CHANGELOG).map((e) => e.date),
		['2026-11-03', '2026-11-02'],
	);
	assert.deepEqual(
		newEntries(CHANGELOG, OLD).map((e) => e.heading),
		['2026-11-03: Newer'],
	);
	assert.deepEqual(
		newEntries(CHANGELOG, null, '2026-11-02').map((e) => e.heading),
		['2026-11-03: Newer'],
	);
	assert.match(upgradeNotes(entries(CHANGELOG))[0].note, /add the new line/);
});

test('reports behind with the new entries and their upgrade notes', async () => {
	const { root, source } = setup();
	const result = await compare({ root, source });
	assert.equal(result.status, 'behind');
	const md = markdown(result);
	assert.match(md, /^status: behind/);
	assert.match(md, /- 2026-11-03: Newer/);
	assert.doesNotMatch(md, /- 2026-11-02: Older/);
	assert.match(md, /\*\*Upgrade:\*\* add the new line/);
});

test('reports up to date, and treats a missing VERSION as behind', async () => {
	const same = setup({ current: '2026.11.03' });
	assert.equal((await compare(same)).status, 'up-to-date');
	const none = setup({ current: null, local: null });
	const result = await compare(none);
	assert.equal(result.status, 'behind');
	assert.match(markdown(result), /from before version numbers/);
});

test('the CLI prints status first and exits 0', () => {
	const { root, source } = setup();
	const out = spawnSync(
		'node',
		[new URL('compare.mjs', import.meta.url).pathname, '--root', root, '--source', source],
		{
			encoding: 'utf8',
		},
	);
	assert.equal(out.status, 0);
	assert.match(out.stdout, /^status: behind\n/);
});
