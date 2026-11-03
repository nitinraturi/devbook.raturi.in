import assert from 'node:assert/strict';
import { test } from 'node:test';
import { newEntries, regressions } from './release-gate.mjs';

test('new changelog entries are the dated sections the base lacks', () => {
	const base = '# Changelog\n\n## 2026-11-01: Old\n\nold body\n';
	const next = '# Changelog\n\n## 2026-11-03: New\n\n### Changed\n- thing\n\n## 2026-11-01: Old\n\nold body\n';
	assert.deepEqual(
		newEntries(next, base).map((e) => e.heading),
		['2026-11-03: New'],
	);
	assert.match(newEntries(next, base)[0].body, /### Changed\n- thing$/);
	assert.equal(newEntries(next, null).length, 2);
});

test('an eval regression is a core case with a negative delta', () => {
	const summary = {
		suites: {
			core: {
				cases: [
					{ name: 'a', delta: -0.2 },
					{ name: 'b', delta: 0 },
					{ name: 'c', delta: null },
				],
			},
		},
	};
	assert.deepEqual(
		regressions(summary).map((c) => c.name),
		['a'],
	);
	assert.deepEqual(regressions({}), []);
});
