#!/usr/bin/env node
// SessionStart hook: when main has a newer Devbook VERSION than .devbook/, asks the agent to offer the upgrade.
// Prints nothing when up to date or offline. Checks the network at most once a day.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compareVersions, VERSION } from './lib.mjs';

const DEFAULT_SOURCE = 'https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in/main/VERSION';
const DAY_MS = 24 * 60 * 60 * 1000;

/** The version in .devbook/VERSION, or undefined when the file is missing or isn't a version number. */
const currentVersion = (devbook) => {
	const file = join(devbook, 'VERSION');
	const version = existsSync(file) ? readFileSync(file, 'utf8').trim() : '';
	return VERSION.test(version) ? version : undefined;
};

/** The version on main. DEVBOOK_VERSION_SOURCE may be a URL or, for tests, a local file. */
const newestVersion = async (source) => {
	const text = /^https?:/.test(source)
		? await (await fetch(source, { signal: AbortSignal.timeout(5000) })).text()
		: readFileSync(source, 'utf8');
	const version = text.trim();
	return VERSION.test(version) ? version : undefined;
};

const main = async () => {
	const project = process.env.CLAUDE_PROJECT_DIR || process.cwd();
	const devbook = join(project, '.devbook');
	// No installed files (no Devbook, or an uninitialised submodule): nothing to compare.
	if (!existsSync(join(devbook, 'instructions'))) return;
	const current = currentVersion(devbook);

	const source = process.env.DEVBOOK_VERSION_SOURCE || DEFAULT_SOURCE;
	const cacheDir = process.env.DEVBOOK_CACHE_DIR || join(tmpdir(), 'devbook');
	const cacheFile = join(
		cacheDir,
		`${createHash('sha256').update(`${project}\n${source}`).digest('hex').slice(0, 16)}.json`,
	);
	let newest;
	try {
		const cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
		if (Date.now() - cache.checkedAt < DAY_MS) newest = cache.newest;
	} catch {
		// no cache yet
	}
	if (!newest) {
		newest = await newestVersion(source);
		if (!newest) return;
		mkdirSync(cacheDir, { recursive: true });
		writeFileSync(cacheFile, JSON.stringify({ checkedAt: Date.now(), newest }));
	}
	if (current && compareVersions(newest, current) <= 0) return;

	process.stdout.write(
		`Devbook update available: this project uses ${current ?? 'a version from before version numbers'}, and ${newest} is the newest. ` +
			'Before starting on the first request, tell the user in one sentence and ask whether to upgrade now. ' +
			'If they agree, follow the devbook-upgrade skill (.devbook/skills/devbook-upgrade/SKILL.md). ' +
			"Don't upgrade without a yes, and don't ask again in this session.\n",
	);
};

try {
	await main();
} catch {
	// Offline or the file is unreachable: stay silent rather than interrupt the session.
}
