import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate, slugify } from '../src/lib/format.js';

test('slugify makes lower-case hyphenated slugs', () => {
	assert.equal(slugify('Why we built Lumen'), 'why-we-built-lumen');
	assert.equal(slugify('  Plain text, forever!  '), 'plain-text-forever');
});

test('slugify removes accents', () => {
	assert.equal(slugify('Crème Brûlée'), 'creme-brulee');
});

test('formatDate writes a UTC date in British style', () => {
	assert.equal(formatDate('2026-09-14'), '14 September 2026');
});
