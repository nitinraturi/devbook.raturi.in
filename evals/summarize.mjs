#!/usr/bin/env node
// Turns `claude plugin eval --json` result files into one small summary that is committed to evals/results/ and
// shown on the site: per case, the with-Devbook score, the no-Devbook score and Δ. Partial runs are refused, because
// they aren't comparable.
//
//   node evals/summarize.mjs --out evals/results/<date>.json <suite>=<result.json> [...]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const round = (x) => (typeof x === 'number' ? Math.round(x * 1000) / 1000 : null);

/** One suite's summary from a plugin eval result document (schemaVersion 1). */
export function summarizeSuite(result) {
	if (result.schemaVersion !== 1) throw new Error(`unsupported result schemaVersion ${result.schemaVersion}`);
	if (result.partial) throw new Error(`partial run (${result.partialReason}); rerun it before committing`);
	const cases = (result.cases ?? []).map((c) => {
		const withScore = c.aggregates?.score;
		const delta = c.aggregates?.delta;
		return {
			name: c.name,
			with: round(withScore),
			without: typeof delta === 'number' ? round(withScore - delta) : null,
			delta: round(delta),
			errors: (c.arms?.with ?? []).filter((r) => r.error).length,
		};
	});
	return {
		score: round(result.aggregates?.overallScore),
		meanDelta: round(result.aggregates?.meanDelta),
		casesPassed: result.aggregates?.casesPassed ?? null,
		casesTotal: result.aggregates?.casesTotal ?? cases.length,
		costUsd: round(result.costUsd),
		claudeVersion: result.claudeVersion ?? null,
		cases,
	};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: { out: { type: 'string' }, model: { type: 'string' }, judge: { type: 'string' } },
	});
	if (!values.out || !positionals.length) {
		console.error('Usage: node evals/summarize.mjs --out <file> [--model m] [--judge m] <suite>=<result.json> ...');
		process.exit(2);
	}
	const suites = {};
	for (const arg of positionals) {
		const [name, file] = arg.split('=');
		suites[name] = summarizeSuite(JSON.parse(readFileSync(file, 'utf8')));
	}
	const summary = {
		date: new Date().toISOString().slice(0, 10),
		method: 'measured',
		model: values.model ?? null,
		judge: values.judge ?? null,
		suites,
	};
	writeFileSync(values.out, `${JSON.stringify(summary, null, 2)}\n`);
	for (const [name, s] of Object.entries(suites))
		console.log(`${name}: score ${s.score}, mean Δ ${s.meanDelta}, ${s.casesPassed}/${s.casesTotal} passed`);
}
