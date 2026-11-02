// Model-graded check, only for what no deterministic check can judge. A pinned grader model reads a fixed rubric
// (evals/rubrics/<params.rubric>.md), the files named in params.files and the agent's final report, and answers
// PASS or FAIL on its first line. The grader is the most accurate model available, pinned so grades stay comparable.
// It runs only in measured runs; modelled runs and dry runs skip it.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fail, pass, readText, sh } from '../lib.mjs';

export const GRADER_MODEL = 'claude-opus-5-5';

export default async function modelGraded({ dir, transcript, params, dryRun }) {
	if (dryRun || !transcript.result || transcript.result.subtype === 'dry_run') return fail('not graded (dry run)');
	const rubric = await readFile(join(import.meta.dirname, '..', 'rubrics', `${params.rubric}.md`), 'utf8');
	const files = [];
	for (const path of params.files ?? [])
		files.push(`<file path="${path}">\n${(await readText(join(dir, path))) ?? '(missing)'}\n</file>`);
	const prompt = `${rubric}\n\n<report>\n${transcript.finalText}\n</report>\n\n${files.join('\n')}\n\nAnswer PASS or FAIL on the first line, then one sentence why.`;
	const { code, stdout, stderr } = await sh(`claude -p --model ${GRADER_MODEL} --max-turns 1 --output-format text`, {
		cwd: dir,
		input: prompt,
	});
	if (code !== 0) return fail(`grader failed: ${stderr.slice(0, 160)}`);
	const [verdict, ...why] = stdout.trim().split('\n');
	return /^PASS\b/.test(verdict)
		? pass(why.join(' ').slice(0, 160))
		: fail(`${verdict} ${why.join(' ')}`.slice(0, 200));
}
