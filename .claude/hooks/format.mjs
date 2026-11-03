#!/usr/bin/env node
// PostToolUse hook (Edit|Write), written by the Devbook bootstrap prompt: formats the edited file with the
// repository's own Prettier, which skips what .prettierignore lists (all Markdown here). It never blocks: a
// formatting failure is reported to Claude on stderr and the edit stands.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const prettier = join(root, 'node_modules/.bin/prettier');
const file = JSON.parse(readFileSync(0, 'utf8')).tool_input?.file_path;
if (!file || !existsSync(prettier) || relative(root, file).startsWith('..')) process.exit(0);
try {
	execFileSync(prettier, ['--write', '--ignore-unknown', '--log-level', 'warn', file], {
		cwd: root,
		stdio: ['ignore', 'ignore', 'pipe'],
	});
} catch (e) {
	process.stderr.write(
		`prettier could not format ${relative(root, file)}: ${e.stderr?.toString().trim() || e.message}\n`,
	);
}
