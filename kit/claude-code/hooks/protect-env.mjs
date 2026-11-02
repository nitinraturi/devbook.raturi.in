#!/usr/bin/env node
// PreToolUse hook (Edit, Write, MultiEdit, NotebookEdit and Bash): blocks changes to .env files, which hold secrets.
// Templates such as .env.example stay editable.
import { basename } from 'node:path';
import { block, commands, run } from './lib.mjs';

const isEnvFile = (path) => {
	const name = basename(path);
	return /^\.env/.test(name) && !/\.(example|sample|template|dist)$/.test(name);
};

// Programs that change or remove the files named in their arguments.
const WRITERS = new Set(['tee', 'mv', 'rm', 'truncate', 'touch', 'chmod', 'ln', 'dd', 'install']);

const MESSAGE = (path) =>
	`${path} holds secrets and stays under the user's control. Tell the user which variable to add or change and why, and put a placeholder in .env.example.`;

run((input) => {
	const tool = input.tool_input ?? {};
	if (input.tool_name !== 'Bash') {
		const path = tool.file_path ?? tool.notebook_path ?? '';
		if (path && isEnvFile(path)) block(MESSAGE(path));
		return;
	}
	for (const { words } of commands(tool.command ?? '', input.cwd ?? process.cwd())) {
		const [program, ...args] = words;
		const redirected = words.filter((_, i) => i > 0 && ['>', '>>', '>|', '&>'].includes(words[i - 1]));
		const inPlace = ['sed', 'perl'].includes(program) && args.some((a) => /^-[a-zA-Z]*i/.test(a));
		let targets = redirected;
		if (WRITERS.has(program) || inPlace) targets = targets.concat(args);
		else if (program === 'cp') targets = targets.concat(args.slice(-1));
		const hit = targets.find((t) => !t.startsWith('-') && isEnvFile(t));
		if (hit) block(MESSAGE(hit));
	}
});
