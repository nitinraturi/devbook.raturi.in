import assert from 'node:assert/strict';
import { test } from 'node:test';
import { check, report } from './drift.mjs';

const sha = (c) => c.repeat(40);
const catalog = {
	upstreams: [
		{
			id: 'tagged',
			repo: 'a/tagged',
			ref: 'v1.0.0',
			status: 'adopted',
			install: { any: 'gh skill install a/tagged x --pin <ref>' },
		},
		{
			id: 'pinned',
			repo: 'a/pinned',
			ref: sha('a'),
			status: 'adopted',
			install: { any: 'gh skill install a/pinned x --pin <ref>' },
		},
		{ id: 'still', repo: 'a/still', ref: sha('c'), status: 'adopted', install: { any: 'x' } },
		{
			id: 'vendor',
			repo: 'v/v',
			ref: 'vendor-channel',
			status: 'adopted',
			install: { 'claude-code': 'claude plugin install gone@claude-plugins-official' },
		},
		{
			id: 'old',
			repo: 'o/o',
			ref: 'v0',
			status: 'retired',
			install: { 'claude-code': 'claude plugin install old@claude-plugins-official' },
		},
	],
};
const api = {
	latestTag: (repo) => ({ 'a/tagged': 'v1.1.0' })[repo] ?? null,
	headSha: (repo) => ({ 'a/pinned': sha('b'), 'a/still': sha('c') })[repo],
	officialPlugins: () => ['present'],
};

test('finds moved tags and SHAs, and plugins missing from the official marketplace', () => {
	const byId = Object.fromEntries(check(catalog, api).map((f) => [f.id, f]));
	assert.deepEqual([byId.tagged.kind, byId.tagged.to], ['moved', 'v1.1.0']);
	assert.deepEqual([byId.pinned.kind, byId.pinned.to], ['moved', sha('b')]);
	assert.equal(byId.still.kind, 'current');
	assert.equal(byId.vendor.kind, 'missing');
	assert.equal(byId.old, undefined, 'retired sources are not checked');
});

test('the report links the upstream diff for each moved source', () => {
	const text = report(check(catalog, api));
	assert.match(text, /2 moved, 1 missing/);
	assert.match(text, /https:\/\/github\.com\/a\/tagged\/compare\/v1\.0\.0\.\.\.v1\.1\.0/);
});
