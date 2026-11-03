import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarizeSuite } from './summarize.mjs';

const result = {
	schemaVersion: 1,
	partial: false,
	costUsd: 1.23456,
	claudeVersion: '2.1.300',
	aggregates: { overallScore: 0.8, meanDelta: 0.25, casesPassed: 1, casesTotal: 2 },
	cases: [
		{
			name: 'a',
			aggregates: { score: 1, delta: 0.5 },
			arms: { with: [{ error: null }, { error: 'timed out after 300s' }] },
		},
		{ name: 'b', aggregates: { score: 0.6 }, arms: { with: [] } },
	],
};

test('records with, without and delta per case', () => {
	const s = summarizeSuite(result);
	assert.deepEqual(s.cases[0], { name: 'a', with: 1, without: 0.5, delta: 0.5, errors: 1 });
	assert.deepEqual(s.cases[1], { name: 'b', with: 0.6, without: null, delta: null, errors: 0 });
	assert.equal(s.costUsd, 1.235);
});

test('refuses partial runs and unknown schema versions', () => {
	assert.throws(() => summarizeSuite({ ...result, partial: true, partialReason: 'cost_ceiling' }), /partial run/);
	assert.throws(() => summarizeSuite({ ...result, schemaVersion: 2 }), /schemaVersion/);
});
