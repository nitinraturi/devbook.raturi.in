#!/usr/bin/env node
// Checks a project's Devbook setup: every `@` and "read when" path in AGENTS.md exists, CLAUDE.md imports AGENTS.md,
// every link link.mjs would make exists and resolves, generated copies match their sources, and no other Devbook
// link is broken. Exit 0 when all is well, 1 with the list of problems.
//
//   node .devbook/skills/devbook-setup/scripts/verify.mjs [--root <dir>] [--assistants claude,copilot]
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { DEFAULT_ASSISTANTS, listedPaths, plan } from './lib.mjs';
import { stale, status, symlinksWork } from './link.mjs';

export function verify(root, { assistants = DEFAULT_ASSISTANTS } = {}) {
	const problems = [];
	const agentsFile = join(root, 'AGENTS.md');
	if (!existsSync(agentsFile)) return ['AGENTS.md is missing'];
	const agents = readFileSync(agentsFile, 'utf8');
	if (!/^@\.devbook\/instructions\/core\.md$/m.test(agents))
		problems.push('AGENTS.md does not import @.devbook/instructions/core.md');
	for (const path of listedPaths(agents)) {
		if (!existsSync(join(root, '.devbook', path)))
			problems.push(`AGENTS.md lists .devbook/${path}, which does not exist`);
	}
	const claude = join(root, 'CLAUDE.md');
	if (assistants.includes('claude') && !(existsSync(claude) && /^@AGENTS\.md\s*$/m.test(readFileSync(claude, 'utf8'))))
		problems.push('CLAUDE.md is missing or has no @AGENTS.md line');
	if (assistants.includes('copilot') && !existsSync(join(root, '.github/copilot-instructions.md')))
		problems.push('.github/copilot-instructions.md is missing');

	let entries;
	try {
		entries = plan(root, { assistants });
	} catch (error) {
		return [...problems, error.message];
	}
	const mode = symlinksWork(root) ? 'link' : 'copy';
	for (const entry of entries) {
		const now = status(root, entry, mode);
		// A copy is fine where links work too, as long as it matches its source.
		const copyOk = mode === 'link' && now === 'outdated' && status(root, entry, 'copy') === 'ok';
		if (now === 'missing') problems.push(`${entry.dest} is missing (link to ${entry.source})`);
		else if (now === 'outdated' && !copyOk) problems.push(`${entry.dest} is out of date or broken; rerun link.mjs`);
		else if (now === 'foreign') problems.push(`${entry.dest} is a file not made by Devbook`);
	}
	// Extra links the user made by hand are fine; only a link that no longer resolves is a problem.
	for (const dest of stale(root, entries))
		if (!existsSync(join(root, dest))) problems.push(`${dest} is broken; delete it or run link.mjs --prune`);
	return problems;
}

// Compare real paths: on macOS /var is a link to /private/var, so a plain URL comparison can miss.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { values } = parseArgs({
		options: {
			root: { type: 'string', default: '.' },
			assistants: { type: 'string', default: DEFAULT_ASSISTANTS.join(',') },
		},
	});
	const problems = verify(resolve(values.root), { assistants: values.assistants.split(',').map((s) => s.trim()) });
	for (const p of problems) console.log(`- ${p}`);
	console.log(
		problems.length ? `${problems.length} problem(s)` : 'Devbook setup verified: all paths and links are in place.',
	);
	process.exit(problems.length ? 1 : 0);
}
