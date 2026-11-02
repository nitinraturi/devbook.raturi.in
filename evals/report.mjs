#!/usr/bin/env node
// Turns runs (from run.mjs or model.mjs) into committed results: one evals/results/<date>-<variant>-<model>.json per
// variant, and evals/results/<date>-<model>-summary.md comparing the variants. The site's /evals/ page and the
// release gate read these files.
//
//   node evals/report.mjs --from evals/runs/<timestamp>/report.json    convert a measured run
//   node evals/report.mjs --compare <a.json> <b.json>                   per-task delta between two result files
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { here } from './install.mjs';

export const resultsDir = join(here, 'results');
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const pct = (x) => `${Math.round(x * 100)}%`;
const int = (x) => Math.round(x).toLocaleString('en');
export const slug = (variant) => variant.replace(/^ref:/, 'ref-').replace(/[^\w.-]/g, '_');

function stats(rs) {
	const tokens = rs.map((r) => r.usage.inputTokens);
	const out = {
		runs: rs.length,
		passes: rs.filter((r) => r.pass).length,
		passRate: mean(rs.map((r) => (r.pass ? 1 : 0))),
		meanInputTokens: mean(tokens),
		minInputTokens: Math.min(...tokens),
		maxInputTokens: Math.max(...tokens),
		meanOutputTokens: mean(rs.map((r) => r.usage.outputTokens ?? 0)),
		meanCostUsd: mean(rs.map((r) => r.usage.costUsd ?? 0)),
	};
	if (rs.some((r) => 'coverageReachable' in r)) {
		out.coverageLoaded = mean(rs.map((r) => r.coverageLoaded));
		out.coverageReachable = mean(rs.map((r) => r.coverageReachable));
	}
	return out;
}

/** Aggregate runs into one result object per variant. */
export function aggregate({ meta, runs }) {
	const date = meta.startedAt.slice(0, 10);
	const models = [...new Set(runs.map((r) => r.model ?? meta.model))];
	const out = [];
	for (const variant of Object.keys(meta.variants)) {
		for (const model of models) {
			const rs = runs.filter((r) => r.variant === variant && (r.model ?? meta.model) === model);
			if (!rs.length) continue;
			const tasks = {};
			for (const id of [...new Set(rs.map((r) => r.task))]) {
				const tr = rs.filter((r) => r.task === id);
				tasks[id] = {
					...stats(tr),
					failed: tr.flatMap((r) => r.checks.filter((c) => !c.pass).map((c) => `${c.check}: ${c.detail}`)).slice(0, 3),
				};
			}
			out.push({
				date,
				startedAt: meta.startedAt,
				method: meta.method,
				model,
				variant,
				label: meta.variants[variant].label ?? meta.variants[variant],
				commit: meta.variants[variant].commit ?? null,
				repeat: meta.repeat,
				...(meta.tokenizer ? { tokenizer: meta.tokenizer } : {}),
				...(meta.credential ? { credential: meta.credential } : {}),
				overall: stats(rs),
				tasks,
			});
		}
	}
	return out;
}

/** Markdown comparing the variants of one run, task by task. The first variant is the reference for deltas. */
export function summaryMarkdown(results) {
	const [first] = results;
	const modelled = first.method === 'modelled';
	const lines = [
		`# Devbook eval results: ${first.date} (${modelled ? 'modelled' : first.method === 'dry-run' ? 'DRY RUN: no model was called' : `measured, ${[...new Set(results.map((r) => r.model))].join(', ')}`})`,
		'',
		modelled
			? 'Modelled: no model was called. "Pass" means every rule the task tests is in the assistant\'s context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as ' +
				(first.tokenizer ?? 'bytes / 4') +
				'). It does not show whether the assistant follows the rules.'
			: `Measured: ${first.repeat} run(s) per task and variant. Pass means every check passed.`,
		'',
		'## Overall',
		'',
		`| Variant | Model | Runs | Pass rate | ${modelled ? 'Rules loaded | Rules reachable | ' : ''}Mean input tokens | Mean cost |`,
		`|---|---|---|---|${modelled ? '---|---|' : ''}---|---|`,
		...results.map(
			(r) =>
				`| ${r.variant}${r.commit ? ` @ ${r.commit}` : ''} | ${r.model} | ${r.overall.runs} | ${pct(r.overall.passRate)} | ${modelled ? `${pct(r.overall.coverageLoaded)} | ${pct(r.overall.coverageReachable)} | ` : ''}${int(r.overall.meanInputTokens)} | $${r.overall.meanCostUsd.toFixed(3)} |`,
		),
		'',
		'## Per task',
		'',
		`Pass rate (passes/runs) and mean input tokens. Δ is against ${first.variant}.`,
		'',
		`| Task | ${results.map((r) => `${r.variant}${results.length > 1 && r !== first ? ' (Δ tokens)' : ''}`).join(' | ')} |`,
		`|---|${results.map(() => '---').join('|')}|`,
		...Object.keys(first.tasks).map(
			(id) =>
				`| ${id} | ${results
					.map((r) => {
						const t = r.tasks[id];
						if (!t) return '–';
						const delta =
							r === first
								? ''
								: ` (${t.meanInputTokens - first.tasks[id].meanInputTokens >= 0 ? '+' : ''}${int(t.meanInputTokens - first.tasks[id].meanInputTokens)})`;
						return `${pct(t.passRate)} ${t.passes}/${t.runs}, ${int(t.meanInputTokens)}${delta}`;
					})
					.join(' | ')} |`,
		),
		'',
		'## Worse than another variant',
		'',
		...worseTasks(results).map((w) => `- ${w.task}: ${w.variant} ${pct(w.passRate)} vs ${w.other} ${pct(w.otherRate)}`),
		...(worseTasks(results).length ? [] : ['None.']),
		'',
		'## Failures',
		'',
		...results.flatMap((r) =>
			Object.entries(r.tasks)
				.filter(([, t]) => t.failed.length)
				.map(([id, t]) => `- ${id} · ${r.variant}: ${t.failed.join('; ')}`),
		),
	];
	return `${lines.join('\n')}\n`;
}

/** Tasks where a Devbook variant other than `none` passes less often than another variant of the same run. */
export function worseTasks(results) {
	const out = [];
	for (const r of results.filter((r) => r.variant !== 'none')) {
		for (const [id, t] of Object.entries(r.tasks)) {
			for (const o of results.filter((o) => o !== r && o.model === r.model && o.tasks[id])) {
				if (t.passRate < o.tasks[id].passRate)
					out.push({
						task: id,
						variant: r.variant,
						passRate: t.passRate,
						other: o.variant,
						otherRate: o.tasks[id].passRate,
					});
			}
		}
	}
	return out;
}

/** Write the per-variant JSON files and the summary. Returns { summary, files }. */
export async function writeResults(report, { save = true, dir = resultsDir } = {}) {
	const results = aggregate(report);
	const summary = summaryMarkdown(results);
	const files = [];
	if (save) {
		await mkdir(dir, { recursive: true });
		for (const r of results) {
			const file = join(dir, `${r.date}-${slug(r.variant)}-${r.model}.json`);
			await writeFile(file, `${JSON.stringify(r, null, 2)}\n`);
			files.push(file);
		}
		const kind = results[0].method === 'modelled' ? 'modelled' : results[0].model.replace(/,/g, '+');
		const variants = [...new Set(results.map((r) => slug(r.variant)))].join('-vs-');
		const file = join(dir, `${results[0].date}-${kind}-${variants}.md`);
		await writeFile(file, summary);
		files.push(file);
	}
	return { summary, files };
}

/** Every committed result, newest first. */
export async function loadResults() {
	const names = (await readdir(resultsDir).catch(() => [])).filter((n) => n.endsWith('.json'));
	const out = [];
	for (const n of names) out.push({ file: n, ...JSON.parse(await readFile(join(resultsDir, n), 'utf8')) });
	return out.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

/** Per-task comparison of two results: tasks whose pass rate fell by more than `tolerance`. */
export function regressions(base, next, tolerance = 0) {
	return Object.entries(base.tasks)
		.filter(([id, t]) => next.tasks[id] && next.tasks[id].passRate < t.passRate - tolerance)
		.map(([id, t]) => ({ task: id, before: t.passRate, after: next.tasks[id].passRate }));
}

// Compare real paths: on macOS /var is a link to /private/var, so a plain URL comparison can miss.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values, positionals } = parseArgs({
		options: { from: { type: 'string' }, compare: { type: 'boolean', default: false } },
		allowPositionals: true,
	});
	if (values.from) {
		const { summary, files } = await writeResults(JSON.parse(await readFile(values.from, 'utf8')));
		console.log(summary);
		for (const f of files) console.log(`Wrote ${f}`);
	} else if (values.compare && positionals.length === 2) {
		const [a, b] = await Promise.all(positionals.map(async (p) => JSON.parse(await readFile(p, 'utf8'))));
		const worse = regressions(a, b);
		for (const w of worse) console.log(`${w.task}: ${pct(w.before)} → ${pct(w.after)}`);
		console.log(
			`${worse.length} task(s) regressed; mean input tokens ${int(a.overall.meanInputTokens)} → ${int(b.overall.meanInputTokens)}`,
		);
		process.exit(worse.length ? 1 : 0);
	} else {
		console.error('Usage: node evals/report.mjs --from <report.json> | --compare <base.json> <next.json>');
		process.exit(2);
	}
}
