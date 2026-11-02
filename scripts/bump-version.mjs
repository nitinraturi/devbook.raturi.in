#!/usr/bin/env node
// Raises VERSION for a new commit on main: today's UTC date, or the next .N when VERSION is already today.
// Prints the new version. `--check` only validates the current VERSION.
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../VERSION', import.meta.url);
const FORMAT = /^(\d{4}\.\d{2}\.\d{2})(?:\.(\d+))?$/;

/** The version after `current` on `date` (YYYY.MM.DD). */
export const nextVersion = (current, date) => {
	const [, day, n] = current.match(FORMAT) ?? [];
	if (day && day >= date) return `${day}.${Number(n ?? 0) + 1}`;
	return date;
};

if (import.meta.url === `file://${process.argv[1]}`) {
	const current = readFileSync(file, 'utf8').trim();
	if (!FORMAT.test(current)) {
		console.error(`VERSION: "${current}" is not YYYY.MM.DD or YYYY.MM.DD.N`);
		process.exit(1);
	}
	if (process.argv.includes('--check')) {
		console.log(`Version: ${current}`);
	} else {
		const next = nextVersion(current, new Date().toISOString().slice(0, 10).replaceAll('-', '.'));
		writeFileSync(file, `${next}\n`);
		console.log(next);
	}
}
