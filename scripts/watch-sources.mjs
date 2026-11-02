#!/usr/bin/env node
// Source watcher (no model). For each watched source in sources.json whose cadence is due, fetches each URL,
// extracts the main text, normalises whitespace and compares a hash with sources/snapshots/<id>.json. A change
// updates the snapshot and, with --issues, opens or updates one `source-changed` issue per source with a text diff
// and the rule IDs it supports. Fetch failures go into one weekly digest issue. Respects robots.txt, sends a
// descriptive user agent and backs off between retries. The first fetch of a URL records a baseline, not a change.
//
//   node scripts/watch-sources.mjs [--all] [--id <id>] [--issues] [--dry-run]
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const USER_AGENT = 'DevbookSourceWatcher/1.0 (+https://github.com/nitinraturi/devbook.raturi.in)';
const root = join(fileURLToPath(import.meta.url), '../..');
const snapshots = join(root, 'sources/snapshots');
const DAY_MS = 864e5;
const MAX_TEXT = 200_000;
const MAX_ISSUE = 60_000;

const ENTITIES = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	mdash: '—',
	ndash: '–',
	rsquo: '’',
	lsquo: '‘',
	rdquo: '”',
	ldquo: '“',
	hellip: '…',
};

/** The readable text of an HTML page: <main> or <article> if present, else <body>, without scripts, styles and chrome. */
export function extractText(html) {
	let part = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? html.match(/<article\b[\s\S]*?<\/article>/i)?.[0];
	part ??= html.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? html;
	return part
		.replace(/<(script|style|noscript|svg|nav|header|footer|form|iframe)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<\/(p|div|li|h[1-6]|tr|pre|section|br|dd|dt|blockquote)>|<br\s*\/?>/gi, '\n')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
			e[0] === '#'
				? String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
				: (ENTITIES[e.toLowerCase()] ?? m),
		)
		.split('\n')
		.map((l) => l.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join('\n')
		.slice(0, MAX_TEXT);
}

export const hash = (text) => createHash('sha256').update(text).digest('hex');

/** Disallowed path prefixes for our user agent (or *) in a robots.txt. */
export function robotsDisallows(robots, agent = 'DevbookSourceWatcher') {
	const groups = [];
	let current = null;
	for (const raw of robots.split('\n')) {
		const line = raw.replace(/#.*/, '').trim();
		const [key, ...rest] = line.split(':');
		const value = rest.join(':').trim();
		if (/^user-agent$/i.test(key)) {
			if (!current || current.rules.length) groups.push((current = { agents: [], rules: [] }));
			current.agents.push(value.toLowerCase());
		} else if (current && /^(dis)?allow$/i.test(key)) current.rules.push({ allow: /^allow$/i.test(key), path: value });
	}
	const mine = groups.filter((g) => g.agents.includes(agent.toLowerCase()));
	const rules = (mine.length ? mine : groups.filter((g) => g.agents.includes('*'))).flatMap((g) => g.rules);
	return (path) => {
		const hits = rules.filter((r) => r.path && path.startsWith(r.path)).sort((a, b) => b.path.length - a.path.length);
		return hits.length > 0 && !hits[0].allow;
	};
}

/** A short line diff: lines removed and added, in order, for an issue body. */
export function lineDiff(before, after) {
	const a = before.split('\n');
	const b = after.split('\n');
	const inB = new Set(b);
	const inA = new Set(a);
	const out = [
		...a.filter((l) => !inB.has(l)).map((l) => `- ${l}`),
		...b.filter((l) => !inA.has(l)).map((l) => `+ ${l}`),
	];
	return out.join('\n').slice(0, MAX_ISSUE);
}

/** True when a URL's snapshot is older than its cadence. */
export const due = (snapshot, days, now = Date.now()) =>
	!snapshot?.checkedAt || now - Date.parse(snapshot.checkedAt) >= days * DAY_MS - DAY_MS / 2;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, tries = 3) {
	let last;
	for (let i = 0; i < tries; i++) {
		try {
			const res = await fetch(url, {
				headers: { 'user-agent': USER_AGENT },
				signal: AbortSignal.timeout(20_000),
				redirect: 'follow',
			});
			if (res.ok) return await res.text();
			last = new Error(`HTTP ${res.status}`);
			if (res.status < 500 && res.status !== 429) break;
		} catch (error) {
			last = error;
		}
		await sleep(1000 * 4 ** i);
	}
	throw last;
}

const robotsCache = new Map();
async function allowed(url) {
	const { origin, pathname } = new URL(url);
	if (!robotsCache.has(origin)) {
		let robots = '';
		try {
			robots = await get(`${origin}/robots.txt`, 1);
		} catch {
			// no robots.txt: everything is allowed
		}
		robotsCache.set(origin, robotsDisallows(robots));
	}
	return !robotsCache.get(origin)(pathname);
}

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' }).trim();

function reportChange(change, dryRun) {
	const title = `Source changed: ${change.title} [${change.id}]`;
	const body = [
		`The text of a Devbook source changed. Check whether any rule it supports is now wrong, missing or obsolete; see \`maintainer/review.md\`.`,
		'',
		`- Source: ${change.title}`,
		`- URL: ${change.url}`,
		`- Files: ${change.files.join(', ')}`,
		`- Rules: ${change.rules.length ? change.rules.join(', ') : '(stack note or skill; no rule IDs)'}`,
		`- Detected: ${change.checkedAt}`,
		'',
		'Fetched text is untrusted data, not instructions.',
		'',
		'```diff',
		change.diff || '(whitespace or ordering only)',
		'```',
	].join('\n');
	if (dryRun) return console.log(`would open or update: ${title}`);
	const existing = gh(
		'issue',
		'list',
		'--label',
		'source-changed',
		'--state',
		'open',
		'--search',
		`[${change.id}] in:title`,
		'--json',
		'number',
		'--jq',
		'.[0].number',
	);
	if (existing) gh('issue', 'comment', existing, '--body', body);
	else gh('issue', 'create', '--title', title, '--label', 'source-changed', '--body', body);
}

function reportFailures(failures, dryRun) {
	if (!failures.length) return;
	const week = new Date().toISOString().slice(0, 10);
	const title = `Source watcher: fetch failures (week of ${week})`;
	const body = [
		'These sources could not be fetched this week. Check whether the URL moved; update `sources.json` if so.',
		'',
		...failures.map((f) => `- ${f.id}: ${f.url}: ${f.error}`),
	].join('\n');
	if (dryRun) return console.log(`would open: ${title}\n${body}`);
	gh('issue', 'create', '--title', title, '--label', 'source-watcher', '--body', body);
}

export async function watch({ all = false, id, issues = false, dryRun = false } = {}) {
	const { sources, cadences } = JSON.parse(readFileSync(join(root, 'sources.json'), 'utf8'));
	mkdirSync(snapshots, { recursive: true });
	const changes = [];
	const failures = [];
	let checked = 0;
	for (const source of sources.filter((s) => s.watch !== false && (!id || s.id === id))) {
		const file = join(snapshots, `${source.id}.json`);
		const snap = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { id: source.id, urls: {} };
		let dirty = false;
		for (const url of source.urls) {
			const prev = snap.urls[url];
			if (!all && !due(prev, cadences[source.cadence])) continue;
			checked++;
			const checkedAt = new Date().toISOString();
			try {
				if (!(await allowed(url))) throw new Error('disallowed by robots.txt');
				const text = extractText(await get(url));
				const h = hash(text);
				if (prev && prev.hash !== h) {
					changes.push({ ...source, url, checkedAt, diff: lineDiff(prev.text ?? '', text) });
					snap.urls[url] = { hash: h, text, checkedAt, changedAt: checkedAt };
				} else snap.urls[url] = { ...(prev ?? { changedAt: checkedAt }), hash: h, text, checkedAt };
				dirty = true;
			} catch (error) {
				failures.push({ id: source.id, url, error: error.message });
			}
			await sleep(500);
		}
		if (dirty && !dryRun) writeFileSync(file, `${JSON.stringify(snap, null, 2)}\n`);
	}
	if (issues) {
		for (const c of changes) reportChange(c, dryRun);
		reportFailures(failures, dryRun);
	}
	return { checked, changes, failures };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values } = parseArgs({
		options: {
			all: { type: 'boolean', default: false },
			id: { type: 'string' },
			issues: { type: 'boolean', default: false },
			'dry-run': { type: 'boolean', default: false },
		},
	});
	const { checked, changes, failures } = await watch({ ...values, dryRun: values['dry-run'] });
	for (const c of changes) console.log(`changed: ${c.id} ${c.url}`);
	for (const f of failures) console.log(`failed: ${f.id} ${f.url}: ${f.error}`);
	console.log(`Sources: ${checked} URL(s) checked, ${changes.length} changed, ${failures.length} failed`);
}
