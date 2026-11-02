// Shared by run.mjs (measured runs) and model.mjs (modelled runs): load tasks and fixtures, materialise a
// Devbook variant, and install fixture + variant into a run directory exactly as a project would have them.
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, symlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { sh } from './lib.mjs';

export const here = dirname(fileURLToPath(import.meta.url));
export const repo = join(here, '..');
export const DEVBOOK_PATHS = [
	'instructions',
	'stacks',
	'templates',
	'skills',
	'kit',
	'LICENSE-CC-BY-4.0',
	'VERSION',
	'CHANGELOG.md',
	'devbook.manifest.json',
];
// Skills the setup skill links, by the instruction file that brings them (null: every project).
export const SKILLS = {
	'devbook-security-review': null,
	'devbook-release-check': null,
	'devbook-upgrade': null,
	'devbook-feature-doc': 'instructions/feature-docs.md',
	'devbook-api-endpoint': 'instructions/api-data.md',
	'devbook-db-migration': 'instructions/database.md',
	'devbook-seo-audit': 'instructions/seo.md',
};

// Tasks write {{FAKE_SECRET}} instead of a literal key, so no key-shaped string is committed for secret scanners to flag.
export const fakeSecret = `bd_live_${randomBytes(8).toString('hex')}`;

export async function loadTasks() {
	const tasks = [];
	for (const name of (await readdir(join(here, 'tasks'))).filter((n) => n.endsWith('.yaml')).sort()) {
		try {
			tasks.push({
				file: name,
				...parseYaml((await readFile(join(here, 'tasks', name), 'utf8')).replaceAll('{{FAKE_SECRET}}', fakeSecret)),
			});
		} catch (error) {
			throw new Error(`tasks/${name}: ${error.message}`, { cause: error });
		}
	}
	return tasks;
}

export async function loadFixture(name) {
	const dir = join(here, 'fixtures', name);
	return {
		name,
		dir,
		...JSON.parse(await readFile(join(dir, 'fixture.json'), 'utf8')),
		project: await readFile(join(dir, 'AGENTS.project.md'), 'utf8'),
	};
}

/** Copy a fixture without its harness files; with `setup`, run its setup commands once so runs can copy the prepared tree. */
export async function prepareFixture(fixture, root, { setup = true } = {}) {
	const dir = join(root, 'prepared', fixture.name);
	await cp(fixture.dir, dir, {
		recursive: true,
		filter: (src) => !/\/(fixture\.json|AGENTS\.project\.md)$/.test(src),
	});
	for (const command of setup ? (fixture.setup ?? []) : []) {
		console.log(`  setup ${fixture.name}: ${command}`);
		const { code, stderr } = await sh(command, { cwd: dir });
		if (code !== 0) throw new Error(`setup failed for ${fixture.name}: ${command}\n${stderr}`);
	}
	return dir;
}

/** The git ref a variant name stands for: `main`, `stable` (local branch, else origin's), or `ref:<git-ref>`. */
async function variantRef(name) {
	if (name.startsWith('ref:')) return name.slice(4);
	if (name !== 'stable') return name;
	for (const ref of ['stable', 'origin/stable']) {
		if ((await sh(`git rev-parse -q --verify '${ref}^{commit}'`, { cwd: repo })).code === 0) return ref;
	}
	throw new Error('variant "stable": no stable branch yet (it is created by the first release)');
}

/** Materialise a Devbook variant's files into `root/variants/<name>`. Returns { dir, label, commit } or null for `none`. */
export async function prepareVariant(name, root) {
	if (name === 'none') return null;
	const dir = join(root, 'variants', name.replace(/[^\w.-]/g, '_'));
	await mkdir(dir, { recursive: true });
	if (name === 'local') {
		for (const p of DEVBOOK_PATHS.filter((p) => existsSync(join(repo, p))))
			await cp(join(repo, p), join(dir, p), { recursive: true });
		const { stdout } = await sh('git rev-parse --short HEAD', { cwd: repo });
		return { dir, label: `working tree (HEAD ${stdout.trim()})`, commit: `${stdout.trim()}+local` };
	}
	const ref = await variantRef(name);
	const { code, stdout, stderr } = await sh(`git rev-parse --short '${ref}^{commit}'`, { cwd: repo });
	if (code !== 0) throw new Error(`unknown git ref "${ref}": ${stderr}`);
	// Older versions lack some folders (skills/ arrived with the loading tiers), so archive only what exists.
	const present = new Set((await sh(`git ls-tree --name-only '${ref}'`, { cwd: repo })).stdout.split('\n'));
	const paths = DEVBOOK_PATHS.filter((p) => present.has(p)).join(' ');
	const archive = await sh(`git archive '${ref}' ${paths} | tar -x -C '${dir}'`, { cwd: repo });
	if (archive.code !== 0) throw new Error(`git archive failed for ${ref}: ${archive.stderr}`);
	return { dir, label: `${ref} (${stdout.trim()})`, commit: stdout.trim() };
}

/**
 * Build the project's AGENTS.md from the variant's own template: the fixture's Project section, then the
 * template's Devbook section with only the `@.devbook/...` lines this fixture uses. Lines that are not
 * imports (headings, notes, "read when" lists) are kept as the template has them.
 */
export async function agentsMd(fixture, variant) {
	if (!variant) return `# AGENTS.md\n\n${fixture.project.trim()}\n`;
	const template = await readFile(join(variant.dir, 'templates/AGENTS.md'), 'utf8');
	const devbook = template.slice(template.indexOf('## Devbook'));
	const wanted = [...fixture.devbook, ...fixture.stacks];
	// Templates before the loading tiers list every file as an `@` line; later ones keep `@` lines for
	// the always tier and a "- `.devbook/<path>`: when" list for the rest.
	const listed = (line) => line.match(/^(?:@|- `)\.devbook\/([^\s`]+)/)?.[1];
	const keep = (path) => wanted.includes(path) || path.startsWith('skills/');
	const lines = devbook
		.split('\n')
		.filter((line) => !/^<!--.*-->$/.test(line.trim()))
		.filter((line) => !listed(line) || keep(listed(line)))
		.filter((line) => existsSync(join(variant.dir, listed(line) ?? '')) || !listed(line));
	while (lines.at(-1)?.trim() === '') lines.pop();
	const readList = /^- `\.devbook\//m.test(devbook);
	for (const path of wanted.filter(
		(p) => existsSync(join(variant.dir, p)) && !lines.some((line) => listed(line) === p),
	)) {
		const topic = path.split('/').pop().replace(/\.md$/, '');
		lines.push(readList ? `- \`.devbook/${path}\`: work that touches ${topic}` : `@.devbook/${path}`);
	}
	return `# AGENTS.md\n\n${fixture.project.trim()}\n\n${lines.join('\n').trim()}\n`;
}

/**
 * Create the links the setup skill creates: path-scoped instructions into .claude/rules, skills into .claude/skills.
 * Versions that ship link.mjs use it, so the evals test the real script; older ones get the same links by hand.
 */
export async function linkVariant(fixture, dir) {
	const script = join(dir, '.devbook/skills/devbook-setup/scripts/link.mjs');
	if (existsSync(script) && existsSync(join(dir, '.devbook/devbook.manifest.json'))) {
		const { code, stderr } = await sh(`node '${script}' --root '${dir}'`, { cwd: dir });
		if (code !== 0) throw new Error(`link.mjs failed: ${stderr}`);
		return;
	}
	for (const path of fixture.devbook) {
		if (!existsSync(join(dir, '.devbook', path))) continue;
		const text = await readFile(join(dir, '.devbook', path), 'utf8');
		if (!/^---\n[\s\S]*?^paths:/m.test(text)) continue;
		await mkdir(join(dir, '.claude/rules'), { recursive: true });
		const name = path.split('/').pop();
		await symlink(`../../.devbook/${path}`, join(dir, '.claude/rules', `devbook-${name}`));
	}
	for (const [skill, needs] of Object.entries(SKILLS)) {
		if (!existsSync(join(dir, '.devbook/skills', skill)) || (needs && !fixture.devbook.includes(needs))) continue;
		await mkdir(join(dir, '.claude/skills'), { recursive: true });
		await symlink(`../../.devbook/skills/${skill}`, join(dir, '.claude/skills', skill));
	}
}

/**
 * Install a run: the prepared fixture, the task's files, and the variant. A task with `install: bare` gets
 * `.devbook/` but only the Project section in AGENTS.md and no links, as a project looks before setup.
 * Commits that state and returns the commit, so checks can diff against it.
 */
export async function installRun({ task, fixture, variant, prepared, dir }) {
	await cp(prepared, dir, { recursive: true });
	for (const [path, content] of Object.entries(task.files ?? {})) {
		await mkdir(dirname(join(dir, path)), { recursive: true });
		await writeFile(join(dir, path), content);
	}
	const bare = task.install === 'bare';
	if (variant) {
		for (const p of DEVBOOK_PATHS.filter((p) => existsSync(join(variant.dir, p))))
			await cp(join(variant.dir, p), join(dir, '.devbook', p), { recursive: true });
	}
	await writeFile(join(dir, 'AGENTS.md'), await agentsMd(fixture, bare ? null : variant));
	const claudeMd = variant && !bare ? await readFile(join(variant.dir, 'templates/CLAUDE.md'), 'utf8') : '@AGENTS.md\n';
	await writeFile(join(dir, 'CLAUDE.md'), claudeMd);
	// After AGENTS.md, because link.mjs reads the files it lists.
	if (variant && !bare) await linkVariant(fixture, dir);
	const git = 'git -c user.name=eval -c user.email=eval@example.invalid';
	await sh(`git init -q -b main && git add -A && ${git} commit -qm "fixture" --no-verify`, { cwd: dir });
	return (await sh('git rev-parse HEAD', { cwd: dir })).stdout.trim();
}
