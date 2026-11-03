#!/usr/bin/env node
// Runs the measured evals with `claude plugin eval`: the core suite (evals/, the core block against no Devbook) and
// each optional skill's suite, each case 3 times per arm, then writes evals/results/<date>.json. It spends model
// usage, so by default it only prints the commands; pass --yes to run them.
//
//   node evals/run.mjs [--yes] [--model claude-sonnet-5-5] [--judge claude-haiku-5-5] [--runs 3] [--max-cost-usd 40]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = join(fileURLToPath(import.meta.url), '../..');
const { values } = parseArgs({
	options: {
		yes: { type: 'boolean', default: false },
		model: { type: 'string', default: 'claude-sonnet-5-5' },
		judge: { type: 'string', default: 'claude-haiku-5-5' },
		runs: { type: 'string', default: '3' },
		'max-cost-usd': { type: 'string', default: '40' },
	},
});

// Tools the fixtures need. Bash runs inside Claude Code's sandbox, confined to the run's workspace, with no network.
const TOOLS = [
	'Edit',
	'Write',
	'Bash(npm *)',
	'Bash(node *)',
	'Bash(python3 *)',
	'Bash(git *)',
	'Bash(ls *)',
	'Bash(cat *)',
];
const suites = [
	{ name: 'core', target: 'evals', scaffold: true },
	...readdirSync(join(root, 'optional/plugins')).map((p) => ({ name: p, target: `optional/plugins/${p}` })),
];

const out = mkdtempSync(join(tmpdir(), 'devbook-evals-'));
const commands = suites.map((s) => [
	'plugin',
	'eval',
	s.target,
	'--allow-tools',
	...TOOLS,
	'--trust-plugin',
	'--no-publish',
	'--ablation',
	'with-without',
	'--runs',
	values.runs,
	'--model',
	values.model,
	'--judge-model',
	values.judge,
	'--max-cost-usd',
	values['max-cost-usd'],
	...(s.scaffold ? ['--scaffold'] : []),
	'--json',
	join(out, `${s.name}.json`),
]);

if (!values.yes) {
	console.log('Dry run. These commands spend model usage; rerun with --yes to run them:\n');
	for (const c of commands) console.log(`claude ${c.map((a) => (/[\s*()]/.test(a) ? `'${a}'` : a)).join(' ')}`);
	process.exit(0);
}

let failed = false;
for (const c of commands)
	try {
		execFileSync('claude', c, { cwd: root, stdio: 'inherit' });
	} catch (e) {
		// Exit 1 means a case scored below the threshold; the result is still written and still worth recording.
		if (e.status !== 1) throw e;
		failed = true;
	}
const date = new Date().toISOString().slice(0, 10);
execFileSync(
	'node',
	[
		'evals/summarize.mjs',
		'--out',
		`evals/results/${date}.json`,
		'--model',
		values.model,
		'--judge',
		values.judge,
		...suites.map((s) => `${s.name}=${join(out, `${s.name}.json`)}`),
	],
	{ cwd: root, stdio: 'inherit' },
);
console.log(`Wrote evals/results/${date}.json${failed ? ' (some cases scored below the threshold)' : ''}`);
