#!/usr/bin/env node
// SessionStart hook for the eval plugin. Plugin eval runs load no AGENTS.md or CLAUDE.md, so this prints what the
// bootstrap prompt writes there: the core block (core.md, a copy of core/AGENTS.core.md kept in sync by
// scripts/build-prompt.mjs) and the Commands section of the fixture's own AGENTS.md. Claude Code adds a SessionStart
// hook's stdout to the session's context.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const core = readFileSync(join(fileURLToPath(import.meta.url), '../core.md'), 'utf8').trimEnd();
const project = join(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), 'AGENTS.md');
const sections = existsSync(project) ? readFileSync(project, 'utf8').split(/^(?=## )/m) : [];
const commands = sections.find((s) => s.startsWith('## Commands')) ?? '## Commands\n- TODO\n';
process.stdout.write(`Contents of AGENTS.md (project instructions):\n\n${core}\n${commands.trimEnd()}\n`);
