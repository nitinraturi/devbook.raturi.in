#!/usr/bin/env node
// Compares the project's Devbook version with the newest on a channel and prints, as Markdown, the changelog entries
// in between and their Upgrade notes. Changes nothing. Node only, no dependencies.
//
//   node .devbook/skills/devbook-upgrade/scripts/compare.mjs [--channel stable|main] [--root <dir>] [--source <url-or-dir>]
//
// The first line is machine-readable: `status: up-to-date`, `status: behind` or `status: unknown`.
// --source is for tests and mirrors: a base URL or a local folder holding VERSION and CHANGELOG.md.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

export const REPO_RAW = 'https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in';
export const VERSION = /^v?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$/;

/** Compare two version numbers; negative when a is older than b. */
export function compareVersions(a, b) {
	const [pa, pb] = [a, b].map((v) =>
		v
			.match(VERSION)
			.slice(1)
			.map((n) => Number(n ?? 0)),
	);
	for (let i = 0; i < pa.length; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
	return 0;
}

/** Split a changelog into entries: { heading, date, body }, newest first as written. */
export function entries(changelog) {
	return changelog
		.split(/^(?=## )/m)
		.filter((part) => part.startsWith('## '))
		.map((part) => {
			const heading = part.split('\n')[0].slice(3).trim();
			return { heading, date: heading.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null, body: part.trim() };
		});
}

/** Entries in `remote` that `local` doesn't have; with no local changelog, those dated after `since`. */
export function newEntries(remote, local, since) {
	const all = entries(remote);
	if (local !== null) {
		const have = new Set(entries(local).map((e) => e.heading));
		return all.filter((e) => !have.has(e.heading));
	}
	return since ? all.filter((e) => e.date && e.date > since) : all;
}

/** The **Upgrade:** notes of the given entries. */
export const upgradeNotes = (list) =>
	list
		.map((e) => ({ heading: e.heading, note: e.body.match(/\*\*Upgrade:\*\*[\s\S]*?(?=\n## |\n### |$)/)?.[0]?.trim() }))
		.filter((n) => n.note);

async function fetchText(source, channel, file) {
	if (!/^https?:/.test(source)) {
		const path = join(source, file);
		return existsSync(path) ? readFileSync(path, 'utf8') : null;
	}
	const res = await fetch(`${source}/${channel}/${file}`, { signal: AbortSignal.timeout(10_000) });
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`${source}/${channel}/${file}: HTTP ${res.status}`);
	return res.text();
}

export async function compare({ root, channel = 'stable', source = REPO_RAW }) {
	const devbook = join(root, '.devbook');
	const read = (f) => (existsSync(join(devbook, f)) ? readFileSync(join(devbook, f), 'utf8') : null);
	const current = read('VERSION')?.trim() || null;
	let used = channel;
	let newest = (await fetchText(source, channel, 'VERSION'))?.trim();
	// Until the first release creates the stable branch, main is the only channel.
	if (!newest && channel === 'stable') {
		used = 'main';
		newest = (await fetchText(source, 'main', 'VERSION'))?.trim();
	}
	if (!newest || !VERSION.test(newest)) return { status: 'unknown', current, newest: null, channel: used, entries: [] };
	const behind = !current || !VERSION.test(current) || compareVersions(newest, current) > 0;
	if (!behind) return { status: 'up-to-date', current, newest, channel: used, entries: [] };
	let since = null;
	try {
		since =
			execFileSync('git', ['log', '-1', '--format=%cs', '--', '.devbook'], { cwd: root, encoding: 'utf8' }).trim() ||
			null;
	} catch {
		// not a git repository
	}
	const remote = (await fetchText(source, used, 'CHANGELOG.md')) ?? '';
	return { status: 'behind', current, newest, channel: used, entries: newEntries(remote, read('CHANGELOG.md'), since) };
}

export function markdown(result, requested) {
	const lines = [`status: ${result.status}`, ''];
	const fellBack = requested === 'stable' && result.channel === 'main' ? ' (no stable channel yet, so main)' : '';
	lines.push(`- Current: ${result.current ?? 'none (a copy from before version numbers)'}`);
	lines.push(`- Newest on ${result.channel}${fellBack}: ${result.newest ?? 'unknown (offline or unreachable)'}`);
	if (result.status !== 'behind') return `${lines.join('\n')}\n`;
	lines.push('', `## Changes (${result.entries.length})`, '');
	for (const e of result.entries) lines.push(`- ${e.heading}`);
	const notes = upgradeNotes(result.entries);
	lines.push('', `## Upgrade notes (${notes.length})`, '');
	for (const n of notes) lines.push(`### ${n.heading}`, '', n.note, '');
	return `${lines.join('\n').trim()}\n`;
}

// Compare real paths: on macOS /var is a link to /private/var, so a plain URL comparison can miss.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values } = parseArgs({
		options: {
			channel: { type: 'string', default: 'stable' },
			root: { type: 'string', default: '.' },
			source: { type: 'string', default: REPO_RAW },
		},
	});
	if (!['stable', 'main'].includes(values.channel)) {
		console.error('--channel must be stable or main');
		process.exit(2);
	}
	try {
		const result = await compare({ root: resolve(values.root), channel: values.channel, source: values.source });
		process.stdout.write(markdown(result, values.channel));
	} catch (error) {
		console.log('status: unknown');
		console.error(`Could not reach the Devbook source: ${error.message}`);
		process.exit(2);
	}
}
