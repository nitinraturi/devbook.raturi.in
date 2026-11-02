#!/usr/bin/env node
// SessionStart hook: when a newer Devbook release exists, asks the agent to offer the upgrade.
// Prints nothing when up to date, offline, or following main. Checks the network at most once a day.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compareTags, TAG } from './lib.mjs';

const DEFAULT_REPO = 'https://github.com/nitinraturi/devbook.raturi.in';
const DAY_MS = 24 * 60 * 60 * 1000;
const git = (args) =>
	execFileSync('git', args, { encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/** The tag this project pins, or undefined when it follows main or the version is unknown. */
const currentVersion = (devbook) => {
	if (existsSync(join(devbook, '.git'))) {
		try {
			return git(['-C', devbook, 'describe', '--tags', '--exact-match']);
		} catch {
			return undefined; // not on a tag: following main
		}
	}
	const file = join(devbook, 'VERSION');
	return existsSync(file) ? readFileSync(file, 'utf8').trim() : undefined;
};

const newestTag = (repo) =>
	git(['ls-remote', '--tags', '--refs', repo, 'v*'])
		.split('\n')
		.map((line) => line.split('refs/tags/')[1])
		.filter((tag) => tag && TAG.test(tag))
		.sort(compareTags)
		.at(-1);

const main = () => {
	const project = process.env.CLAUDE_PROJECT_DIR || process.cwd();
	const devbook = join(project, '.devbook');
	const current = currentVersion(devbook);
	if (!current || !TAG.test(current)) return;

	const repo = process.env.DEVBOOK_REPO || DEFAULT_REPO;
	const cacheDir = process.env.DEVBOOK_CACHE_DIR || join(tmpdir(), 'devbook');
	const cacheFile = join(
		cacheDir,
		`${createHash('sha256').update(`${project}\n${repo}`).digest('hex').slice(0, 16)}.json`,
	);
	let newest;
	try {
		const cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
		if (Date.now() - cache.checkedAt < DAY_MS) newest = cache.newest;
	} catch {
		// no cache yet
	}
	if (!newest) {
		newest = newestTag(repo);
		if (!newest) return;
		mkdirSync(cacheDir, { recursive: true });
		writeFileSync(cacheFile, JSON.stringify({ checkedAt: Date.now(), newest }));
	}
	if (compareTags(newest, current) <= 0) return;

	process.stdout.write(
		`Devbook update available: this project uses ${current}, and ${newest} is the newest release. ` +
			'Before starting on the first request, tell the user in one sentence and ask whether to upgrade now. ' +
			'If they agree, follow the devbook-upgrade skill (.devbook/skills/devbook-upgrade/SKILL.md). ' +
			"Don't upgrade without a yes, and don't ask again in this session.\n",
	);
};

try {
	main();
} catch {
	// Offline or git missing: stay silent rather than interrupt the session.
}
