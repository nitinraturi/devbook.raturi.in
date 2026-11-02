#!/usr/bin/env node
// PreToolUse hook (Bash): blocks recursive `rm` outside the project, and any recursive `rm` whose target it can't check.
// Temporary directories are allowed, because agents use them for scratch files.
import { tmpdir } from 'node:os';
import { block, commands, isInside, realish, resolvePath, run } from './lib.mjs';

const isRecursive = (flags) => flags.some((f) => f === '--recursive' || (/^-[a-zA-Z]+$/.test(f) && /[rR]/.test(f)));

run((input) => {
	const project = realish(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
	const allowed = [project, tmpdir(), '/tmp', input.scratchpad_dir].filter(Boolean).map(realish);
	for (const { words, cwd } of commands(input.tool_input?.command ?? '', input.cwd ?? process.cwd())) {
		if (words[0] !== 'rm') continue;
		const args = words.slice(1);
		const end = args.indexOf('--');
		const flags = (end === -1 ? args : args.slice(0, end)).filter((a) => a.startsWith('-'));
		if (!isRecursive(flags)) continue;
		const targets = (end === -1 ? args.filter((a) => !a.startsWith('-')) : args.slice(end + 1)).filter(
			(a) => !['>', '>>', '>|', '>&', '&>'].includes(a),
		);
		for (const target of targets) {
			if (/[$`]/.test(target)) {
				block(
					`rm -r ${target}: the path uses a variable, so the hook can't check that it is inside the project. Use a literal path inside ${project}, or ask the user to run it.`,
				);
			}
			// For globs, check the fixed part before the first wildcard.
			const fixed = target.split(/[*?[]/)[0] || '.';
			const path = realish(resolvePath(fixed, cwd));
			if (!allowed.some((root) => isInside(path, root))) {
				block(
					`rm -r ${target} would delete ${path}, which is not inside the project (${project}). Only delete files inside the project; if this deletion is really needed, ask the user to run it.`,
				);
			}
		}
	}
});
