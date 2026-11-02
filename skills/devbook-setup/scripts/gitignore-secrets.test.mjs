import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { PATTERNS, block, missingPatterns, npmrcHasToken } from './gitignore-secrets.mjs';

const script = new URL('gitignore-secrets.mjs', import.meta.url).pathname;
const dirs = [];
after(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));
const repo = (files = {}) => {
	const dir = mkdtempSync(join(tmpdir(), 'devbook-gitignore-'));
	dirs.push(dir);
	execFileSync('git', ['init', '-q'], { cwd: dir });
	for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
	return dir;
};
const run = (dir, ...args) => spawnSync('node', [script, '--root', dir, ...args], { encoding: 'utf8' });

test('missingPatterns ignores comments and finds only absent patterns', () => {
	const missing = missingPatterns('# secrets\n.env\n/.env.*\n*.pem\n').map(([p]) => p);
	assert.ok(!missing.includes('.env') && !missing.includes('.env.*') && !missing.includes('*.pem'));
	assert.ok(missing.includes('!.env.example') && missing.includes('.dev.vars*'));
	assert.equal(block([]), '');
});

test('npmrcHasToken spots auth tokens only', () => {
	assert.ok(npmrcHasToken('//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n'));
	assert.ok(!npmrcHasToken('engine-strict=true\n'));
});

test('adds every pattern once, and is idempotent', () => {
	const dir = repo({ '.gitignore': 'node_modules/\n' });
	assert.equal(run(dir).status, 0);
	const once = readFileSync(join(dir, '.gitignore'), 'utf8');
	for (const [p] of PATTERNS) assert.ok(once.split('\n').includes(p), p);
	assert.match(run(dir).stdout, /already has every/);
	assert.equal(readFileSync(join(dir, '.gitignore'), 'utf8'), once);
});

test('--dry-run writes nothing and --check fails while patterns are missing', () => {
	const dir = repo();
	assert.match(run(dir, '--dry-run').stdout, /missing: \.env /);
	assert.throws(() => readFileSync(join(dir, '.gitignore')));
	assert.equal(run(dir, '--check').status, 1);
	run(dir);
	assert.equal(run(dir, '--check').status, 0);
});

test('reports tracked secret files and keeps a token-free .npmrc tracked', () => {
	const dir = repo({ '.env': 'API_KEY=x\n', '.npmrc': 'engine-strict=true\n' });
	execFileSync('git', ['add', '.env', '.npmrc'], { cwd: dir });
	const out = run(dir).stdout;
	assert.match(out, /tracked: \.env\./);
	assert.match(out, /\.npmrc is tracked and holds no token/);
	assert.ok(!readFileSync(join(dir, '.gitignore'), 'utf8').split('\n').includes('.npmrc'));
});

test('explains a missing repository', () => {
	const dir = mkdtempSync(join(tmpdir(), 'devbook-nogit-'));
	dirs.push(dir);
	const result = run(dir);
	assert.equal(result.status, 2);
	assert.match(result.stderr, /not a git repository/);
});
