#!/usr/bin/env node
// Free structural check of every eval suite (evals/cases and optional/plugins/*/evals), run by `npm run check`:
// prompt.md keys that `claude plugin eval` accepts, at least one grader per case with the options its type needs,
// and scaffold scripts that exist and source fixtures that exist. It runs no model; `claude plugin eval` does that.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_KEYS = new Set([
	'schema_version',
	'name',
	'description',
	'tags',
	'plugins',
	'runs',
	'expected_outcome',
	'model',
	'max_turns',
	'timeout_seconds',
	'allowed_tools',
	'append_system_prompt',
	'env',
]);
const GRADERS = {
	regex: ['pattern'],
	tool_used: ['tool'],
	tool_order: ['before', 'after'],
	file_exists: ['path'],
	llm: [],
	baseline: ['baseline_file'],
};

const frontmatter = (text) => {
	const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	return m ? { data: parse(m[1]) ?? {}, body: m[2].trim() } : { data: {}, body: text.trim() };
};

export function suites() {
	const plugins = join(root, 'optional/plugins');
	return [
		join(root, 'evals/cases'),
		...readdirSync(plugins)
			.map((p) => join(plugins, p, 'evals'))
			.filter(existsSync),
	];
}

/** Problems with one case directory, as messages. */
export function checkCase(dir) {
	const at = relative(root, dir);
	const problems = [];
	const promptFile = join(dir, 'prompt.md');
	if (!existsSync(promptFile)) return [`${at}: missing prompt.md`];
	const { data, body } = frontmatter(readFileSync(promptFile, 'utf8'));
	for (const key of Object.keys(data)) if (!PROMPT_KEYS.has(key)) problems.push(`${at}/prompt.md: unknown key ${key}`);
	if (!body) problems.push(`${at}/prompt.md: the prompt is empty`);
	if (!data.description) problems.push(`${at}/prompt.md: add a description saying what the case shows`);

	const caseFile = join(dir, 'case.yaml');
	if (existsSync(caseFile)) {
		const spec = parse(readFileSync(caseFile, 'utf8')) ?? {};
		if (spec.schema_version !== '1.1') problems.push(`${at}/case.yaml: schema_version must be "1.1"`);
		const script = spec.context?.scaffold_script;
		if (script) {
			const path = join(dir, script);
			if (!existsSync(path)) problems.push(`${at}/case.yaml: scaffold ${script} is missing`);
			else
				for (const [, fixture] of readFileSync(path, 'utf8').matchAll(/fixtures\/([\w.-]+\.sh)/g))
					if (!existsSync(join(root, 'evals/fixtures', fixture)))
						problems.push(`${at}/${script}: fixture ${fixture} is missing`);
		}
	}

	const graderDir = join(dir, 'graders');
	const graders = existsSync(graderDir) ? readdirSync(graderDir).filter((f) => f.endsWith('.md')) : [];
	if (!graders.length) problems.push(`${at}: needs at least one grader in graders/`);
	for (const file of graders) {
		const { data: g, body: rubric } = frontmatter(readFileSync(join(graderDir, file), 'utf8'));
		const where = `${at}/graders/${file}`;
		if (!GRADERS[g.type]) {
			problems.push(`${where}: type must be one of ${Object.keys(GRADERS).join(', ')}`);
			continue;
		}
		for (const option of GRADERS[g.type])
			if (g[option] === undefined) problems.push(`${where}: ${g.type} needs ${option}`);
		if (g.type === 'llm' && !rubric && !g.criteria)
			problems.push(`${where}: an llm grader needs PASS and FAIL criteria`);
		if (g.type === 'regex')
			try {
				new RegExp(g.pattern, g.flags);
			} catch (e) {
				problems.push(`${where}: invalid pattern: ${e.message}`);
			}
	}
	return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	let cases = 0;
	const problems = [];
	for (const suite of suites())
		for (const entry of readdirSync(suite, { withFileTypes: true }))
			if (entry.isDirectory() && entry.name !== 'results') {
				cases++;
				problems.push(...checkCase(join(suite, entry.name)));
			}
	for (const p of problems) console.error(`ERROR ${p}`);
	console.log(`Evals: ${cases} cases checked, ${problems.length} problem(s)`);
	if (problems.length) process.exit(1);
}
