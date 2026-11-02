#!/usr/bin/env node
// Helpers for the scheduled maintenance workflows. No model.
//
//   node scripts/maintenance.mjs stale            files whose lastVerified is older than their fastest source's cadence
//   node scripts/maintenance.mjs rotation [date]  the quarter of instruction and stack files due for review this quarter
//   node scripts/maintenance.mjs digest           the monthly owner digest as Markdown (needs gh and GH_TOKEN)
//
// `stale` exits 1 when a file is stale, so the quarterly job fails visibly.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '../..');
const registry = JSON.parse(readFileSync(join(root, 'sources.json'), 'utf8'));
const DAY_MS = 864e5;

export const reviewedFiles = () =>
	['instructions', 'stacks']
		.flatMap((d) =>
			readdirSync(join(root, d))
				.filter((n) => n.endsWith('.md'))
				.map((n) => `${d}/${n}`),
		)
		.sort();

const lastVerified = (file) => readFileSync(join(root, file), 'utf8').match(/^lastVerified:\s*(\S+)/m)?.[1] ?? null;

/** Files whose lastVerified is older than the shortest cadence among their sources. */
export function stale(now = Date.now()) {
	const out = [];
	for (const file of reviewedFiles()) {
		const days = Math.min(
			...registry.sources.filter((s) => s.files.includes(file)).map((s) => registry.cadences[s.cadence]),
			registry.cadences.quarterly,
		);
		const verified = lastVerified(file);
		if (!verified || now - Date.parse(verified) > days * DAY_MS)
			out.push({ file, lastVerified: verified, cadenceDays: days });
	}
	return out;
}

/** Every file is reviewed once a year: file i belongs to quarter i mod 4. */
export function rotation(date = new Date()) {
	const quarter = Math.floor(date.getUTCMonth() / 3);
	return reviewedFiles().filter((_, i) => i % 4 === quarter);
}

const gh = (...args) => {
	try {
		return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return '';
	}
};

/** The monthly owner digest: what automation did, what waits for review, eval trend and whether schedules are alive. */
export function digest(now = new Date()) {
	const since = new Date(now.getTime() - 31 * DAY_MS).toISOString().slice(0, 10);
	const list = (...args) => JSON.parse(gh(...args, '--json', 'number,title,url') || '[]');
	const waiting = list('pr', 'list', '--state', 'open');
	const closedSources = list(
		'issue',
		'list',
		'--label',
		'source-changed',
		'--state',
		'closed',
		'--search',
		`closed:>=${since}`,
	);
	const openSources = list('issue', 'list', '--label', 'source-changed', '--state', 'open');
	const releases = gh(
		'release',
		'list',
		'--limit',
		'10',
		'--json',
		'tagName,publishedAt',
		'--jq',
		`[.[] | select(.publishedAt >= "${since}")] | map(.tagName) | join(", ")`,
	);
	const workflows = JSON.parse(gh('api', 'repos/{owner}/{repo}/actions/workflows', '--jq', '.workflows') || '[]');
	const disabled = workflows.filter((w) => w.state !== 'active').map((w) => `${w.name} (${w.state})`);
	const runs = JSON.parse(
		gh('run', 'list', '--workflow', 'review.yml', '--limit', '50', '--json', 'conclusion,createdAt,url') || '[]',
	).filter((r) => r.createdAt >= since);
	const results = readdirSync(join(root, 'evals/results'))
		.filter((n) => n.endsWith('.json') && /-(main|local)-/.test(n))
		.map((n) => JSON.parse(readFileSync(join(root, 'evals/results', n), 'utf8')))
		.sort((a, b) => a.startedAt.localeCompare(b.startedAt))
		.slice(-4);
	const pct = (x) => `${Math.round(x * 100)}%`;
	const items = (xs) => (xs.length ? xs.map((x) => `- [#${x.number}](${x.url}) ${x.title}`) : ['- None.']);
	return [
		`# Devbook owner digest, ${now.toISOString().slice(0, 10)}`,
		'',
		'## Waiting for your review',
		'',
		...items(waiting),
		'',
		'## What automation did since ' + since,
		'',
		`- Releases: ${releases || 'none'}`,
		`- Source changes handled: ${closedSources.length}; still open: ${openSources.length}`,
		`- Review workflow runs: ${runs.length} (${runs.filter((r) => r.conclusion === 'success').length} succeeded). Each run's summary shows the model usage it spent.`,
		'',
		'## Eval trend (latest committed results)',
		'',
		'| Date | Variant | Method | Pass rate | Mean Devbook tokens |',
		'|---|---|---|---|---|',
		...results.map(
			(r) =>
				`| ${r.date} | ${r.variant} | ${r.method} | ${pct(r.overall.passRate)} | ${Math.round(r.overall.meanInputTokens)} |`,
		),
		'',
		'## Schedules',
		'',
		disabled.length
			? `- Disabled workflows: ${disabled.join(', ')}. Re-enable them (Actions → workflow → Enable), because GitHub disables schedules after 60 days without activity.`
			: '- Every workflow is enabled.',
		`- Stale files (lastVerified older than their cadence): ${
			stale()
				.map((s) => s.file)
				.join(', ') || 'none'
		}`,
		'',
	].join('\n');
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const [command, arg] = process.argv.slice(2);
	if (command === 'stale') {
		const found = stale();
		for (const s of found)
			console.log(`${s.file}: lastVerified ${s.lastVerified ?? 'missing'}, cadence ${s.cadenceDays} days`);
		console.log(`${found.length} stale file(s)`);
		process.exit(found.length ? 1 : 0);
	} else if (command === 'rotation') console.log(rotation(arg ? new Date(arg) : new Date()).join('\n'));
	else if (command === 'digest') process.stdout.write(digest());
	else {
		console.error('Usage: node scripts/maintenance.mjs stale | rotation [date] | digest');
		process.exit(2);
	}
}
