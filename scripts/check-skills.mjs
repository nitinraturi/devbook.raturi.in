// Validates every skill in skills/ with the Agent Skills reference validator (skills-ref, from
// github.com/agentskills/agentskills, pinned to a commit), installed once into node_modules/.cache/skills-ref with
// Python 3.11 or later. Also checks what the validator doesn't: each linked file exists, and references are one
// level deep (SKILL.md may link to references/x.md; a reference file links to nothing else in the skill).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_REF =
	'git+https://github.com/agentskills/agentskills@69ef37e9424c0a7ea9dd2293b559e43ec8176379#subdirectory=skills-ref';
const venv = join(root, 'node_modules/.cache/skills-ref');
const bin = join(venv, 'bin/skills-ref');

let errors = 0;
const error = (msg) => (errors++, console.error(`ERROR ${msg}`));

if (!existsSync(bin)) {
	console.log('Installing the Agent Skills validator (skills-ref) into node_modules/.cache/skills-ref');
	try {
		execFileSync('python3', ['-m', 'venv', venv], { stdio: 'inherit' });
		execFileSync(
			join(venv, 'bin/pip'),
			['install', '--quiet', '--disable-pip-version-check', `skills-ref @ ${SKILLS_REF}`],
			{
				stdio: 'inherit',
			},
		);
	} catch {
		console.error('ERROR could not install skills-ref: it needs python3 (3.11 or later) and network access once');
		process.exit(1);
	}
}

/** Relative links and backticked paths in a Markdown file that point inside its skill folder. */
const links = (text) =>
	[...text.matchAll(/\]\(((?:references|scripts|assets)\/[^)\s]+)\)|`((?:references|scripts|assets)\/[^`\s]+)`/g)].map(
		(m) => m[1] ?? m[2],
	);

const skills = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((e) => e.isDirectory());
for (const { name } of skills) {
	const dir = join(root, 'skills', name);
	try {
		execFileSync(bin, ['validate', dir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
	} catch (e) {
		error(`skills/${name}: ${(e.stdout || e.stderr || e.message).trim()}`);
	}
	const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8');
	const declared = skill.match(/^name:\s*(\S+)/m)?.[1];
	if (declared !== name) error(`skills/${name}: name "${declared}" must match the folder`);
	for (const link of links(skill))
		if (!existsSync(join(dir, normalize(link)))) error(`skills/${name}/SKILL.md links to ${link}, which is missing`);
	const refs = existsSync(join(dir, 'references')) ? readdirSync(join(dir, 'references')) : [];
	for (const ref of refs.filter((r) => r.endsWith('.md'))) {
		const deeper = links(readFileSync(join(dir, 'references', ref), 'utf8'));
		if (deeper.length)
			error(`skills/${name}/references/${ref} links on to ${deeper[0]}; keep references one level deep`);
	}
}
console.log(`Skills: ${skills.length} validated with skills-ref, ${errors} error(s)`);
if (errors) process.exit(1);
