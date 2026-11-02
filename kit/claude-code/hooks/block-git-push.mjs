#!/usr/bin/env node
// PreToolUse hook (Bash): blocks `git push`, because pushing is the user's decision (CORE rules on commits and pushes).
import { block, commands, run } from './lib.mjs';

// Git options that take a separate value, so the value is not mistaken for the subcommand.
const VALUE_OPTIONS = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--config-env', '--exec-path']);

const subcommand = (args) => {
	for (let i = 0; i < args.length; i++) {
		if (VALUE_OPTIONS.has(args[i])) i++;
		else if (!args[i].startsWith('-')) return args[i];
	}
	return undefined;
};

run((input) => {
	const command = input.tool_input?.command ?? '';
	for (const { words } of commands(command, input.cwd ?? process.cwd())) {
		if (words[0] === 'git' && subcommand(words.slice(1)) === 'push') {
			block(
				'git push is for the user to run. Finish the work, commit locally only if the user asked for commits, and tell them the branch is ready to push.',
			);
		}
	}
});
