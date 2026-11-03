#!/usr/bin/env node
// Helpers for the scheduled maintenance workflows. No model.
//
//   node scripts/maintenance.mjs stale     catalog sources not checked within STALE_DAYS
//   node scripts/maintenance.mjs digest    the monthly owner digest as Markdown (needs gh and GH_TOKEN)
//
// `stale` exits 1 when a source is stale, so the quarterly job fails visibly.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '../..');
const DAY_MS = 864e5;
export const STALE_DAYS = 95;

const catalog = () => JSON.parse(readFileSync(join(root, 'catalog/sources.json'), 'utf8'));

/** Non-retired sources whose lastChecked is older than STALE_DAYS. */
export const stale = (now = Date.now(), upstreams = catalog().upstreams) =>
	upstreams.filter((u) => u.status !== 'retired' && now - Date.parse(u.lastChecked) > STALE_DAYS * DAY_MS);

const gh = (...args) => {
	try {
		return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return '';
	}
};

/** The monthly owner digest: what waits for review, the eval trend, stale sources and whether schedules are alive. */
export function digest(now = new Date()) {
	const list = (...args) => JSON.parse(gh(...args, '--json', 'number,title,url') || '[]');
	const drift = list('pr', 'list', '--state', 'open', '--label', 'drift');
	const waiting = list('pr', 'list', '--state', 'open').filter((p) => !drift.some((d) => d.number === p.number));
	const workflows = JSON.parse(gh('api', 'repos/{owner}/{repo}/actions/workflows', '--jq', '.workflows') || '[]');
	const disabled = workflows.filter((w) => w.state !== 'active').map((w) => `${w.name} (${w.state})`);
	const dir = join(root, 'evals/results');
	const results = (existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.json')) : [])
		.sort()
		.slice(-4)
		.map((n) => JSON.parse(readFileSync(join(dir, n), 'utf8')));
	const items = (xs) => (xs.length ? xs.map((x) => `- [#${x.number}](${x.url}) ${x.title}`) : ['- None.']);
	return [
		`# Devbook owner digest, ${now.toISOString().slice(0, 10)}`,
		'',
		'## Catalog pull requests (merge or close)',
		'',
		...items(drift),
		'',
		'## Other pull requests waiting for review',
		'',
		...items(waiting),
		'',
		'## Measured evals (latest committed)',
		'',
		...(results.length
			? [
					'| Date | Model | Core score | Core mean Δ |',
					'|---|---|---|---|',
					...results.map(
						(r) => `| ${r.date} | ${r.model} | ${r.suites.core?.score ?? '–'} | ${r.suites.core?.meanDelta ?? '–'} |`,
					),
				]
			: ['- None yet. Set MEASURED_EVALS to true to run them monthly.']),
		'',
		'## Schedules and staleness',
		'',
		disabled.length
			? `- Disabled workflows: ${disabled.join(', ')}. Re-enable them (Actions → workflow → Enable), because GitHub disables schedules after 60 days without activity.`
			: '- Every workflow is enabled.',
		`- Sources not checked in ${STALE_DAYS} days: ${
			stale(now.getTime())
				.map((u) => u.id)
				.join(', ') || 'none'
		}`,
		'',
	].join('\n');
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const [command] = process.argv.slice(2);
	if (command === 'stale') {
		const found = stale();
		for (const u of found) console.log(`${u.id}: last checked ${u.lastChecked}`);
		console.log(`${found.length} stale source(s)`);
		process.exit(found.length ? 1 : 0);
	} else if (command === 'digest') process.stdout.write(digest());
	else {
		console.error('Usage: node scripts/maintenance.mjs stale | digest');
		process.exit(2);
	}
}
