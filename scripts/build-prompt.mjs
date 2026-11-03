#!/usr/bin/env node
// Renders prompt/bootstrap.md from prompt/bootstrap.template.md, core/AGENTS.core.md, catalog/sources.json and
// VERSION, after validating the catalog and the core budget, and copies the core block to evals/hooks/core.md for
// the eval plugin and into this repository's own AGENTS.md block (Devbook is set up with its own prompt). `--check`
// fails when a generated file is out of date instead of writing it. The homepage
// shows the rendered prompt.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '../..');
export const CORE_BUDGET_BYTES = 2000;
const STATUSES = ['adopted', 'suggested', 'retired'];
const TYPES = ['plugin', 'skill', 'mcp', 'hook'];
const HOSTS = { 'claude-code': 'Claude Code', other: 'other hosts', any: 'any host (Claude Code too)' };
const REF = /^(vendor-channel|main|[0-9a-f]{40}|v?\d[\w.-]*)$/;

/** Problems with the catalog, as messages; empty when it is valid. */
export function validateCatalog(catalog) {
	const problems = [];
	const ids = new Set();
	for (const [id, g] of Object.entries(catalog.groups ?? {}))
		if (!g.title || !g.note) problems.push(`group ${id}: needs a title and a note`);
	if (!Number.isInteger(catalog.maxOptional) || catalog.maxOptional < 1) problems.push('maxOptional must be >= 1');
	for (const u of catalog.upstreams ?? []) {
		const at = `upstream ${u.id ?? '?'}`;
		if (!u.id || ids.has(u.id)) problems.push(`${at}: missing or duplicate id`);
		ids.add(u.id);
		for (const key of ['title', 'group', 'use', 'repo', 'ref', 'license', 'lastChecked'])
			if (typeof u[key] !== 'string' || !u[key]) problems.push(`${at}: ${key} is required`);
		if (!catalog.groups?.[u.group]) problems.push(`${at}: unknown group ${u.group}`);
		if (!TYPES.includes(u.type)) problems.push(`${at}: type must be one of ${TYPES.join(', ')}`);
		if (!STATUSES.includes(u.status)) problems.push(`${at}: status must be one of ${STATUSES.join(', ')}`);
		if (u.status !== 'adopted' && !u.reason) problems.push(`${at}: a ${u.status} source needs a reason`);
		if (!REF.test(u.ref ?? '')) problems.push(`${at}: ref must be a tag, a full commit SHA, main or vendor-channel`);
		if (!/^[\w.-]+\/[\w.-]+$/.test(u.repo ?? '')) problems.push(`${at}: repo must be owner/name`);
		if (typeof u.counts !== 'boolean') problems.push(`${at}: counts must be true or false`);
		const installs = Object.entries(u.install ?? {});
		if (!installs.length) problems.push(`${at}: needs at least one install command`);
		for (const [host, cmd] of installs) {
			if (!HOSTS[host]) problems.push(`${at}: unknown install host ${host}`);
			if (/\s(-y|--yes|--consent)\b/.test(cmd)) problems.push(`${at}: install must not pass an auto-consent flag`);
			if (/<ref>/.test(cmd) && ['vendor-channel', 'main'].includes(u.ref))
				problems.push(`${at}: install uses <ref> but the source has no pinned ref`);
		}
	}
	return problems;
}

const command = (u, cmd) => `\`${cmd.replaceAll('<ref>', u.ref)}\``;

function entry(u) {
	// The pinned ref is in the command itself, so the label names only where it comes from.
	const ref = u.ref === 'vendor-channel' ? 'official marketplace' : u.repo;
	const when = u.detect ? `; when ${u.detect}` : '';
	const free = u.counts ? '' : "; doesn't count";
	const installs = Object.entries(u.install)
		.map(([host, cmd]) => `${HOSTS[host]}: ${command(u, cmd)}`)
		.join('; ');
	return `- ${u.title} (${ref}${when}${free}): ${u.use}. ${installs}`;
}

/** The ALLOWLIST section: adopted sources by group. */
export function renderAllowlist(catalog) {
	const adopted = catalog.upstreams.filter((u) => u.status === 'adopted');
	// The site's catalog page uses the same groups, titles and notes (src/lib/catalog.ts).
	return Object.entries(catalog.groups)
		.map(([group, { title, note }]) => {
			const items = adopted.filter((u) => u.group === group);
			return items.length ? [`${title} (${note}):`, ...items.map(entry)].join('\n') : '';
		})
		.filter(Boolean)
		.join('\n');
}

export function renderSuggested(catalog) {
	const items = catalog.upstreams.filter((u) => u.status === 'suggested');
	return items.length
		? items.map((u) => `- ${u.title} (${u.repo}): ${u.use}. Not installed: ${u.reason}.`).join('\n')
		: '- None.';
}

/** `agents` with the core part of its Devbook block (from the BEGIN marker to its Commands) replaced. */
export function syncBlock(agents, core, version) {
	const block = /<!-- BEGIN:devbook-core [^>]*-->\n[\s\S]*?(?=^## Commands$)/m;
	if (!block.test(agents)) throw new Error('AGENTS.md has no Devbook block with a Commands section');
	return agents.replace(block, () => `<!-- BEGIN:devbook-core ${version} -->\n${core.trimEnd()}\n`);
}

export function render({ template, core, catalog, version }) {
	return template
		.replaceAll('{{VERSION}}', version)
		.replace('{{CORE}}', core.trimEnd())
		.replace('{{MAX}}', String(catalog.maxOptional))
		.replace('{{BUILTINS}}', catalog.builtins.map((b) => `${b.command} (${b.use})`).join(', '))
		.replace('{{ALLOWLIST}}', renderAllowlist(catalog))
		.replace('{{SUGGESTED}}', renderSuggested(catalog));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const read = (p) => readFileSync(join(root, p), 'utf8');
	const catalog = JSON.parse(read('catalog/sources.json'));
	const core = read('core/AGENTS.core.md');
	const problems = validateCatalog(catalog);
	const coreBytes = Buffer.byteLength(core);
	if (coreBytes > CORE_BUDGET_BYTES)
		problems.push(`core/AGENTS.core.md is ${coreBytes} bytes; the budget is ${CORE_BUDGET_BYTES}`);
	if (/[{}]{2}/.test(core)) problems.push('core/AGENTS.core.md must not contain template placeholders');
	const out = render({
		template: read('prompt/bootstrap.template.md'),
		core,
		catalog,
		version: read('VERSION').trim(),
	});
	if (/\{\{\w+\}\}/.test(out)) problems.push('prompt/bootstrap.template.md has an unknown placeholder');
	for (const p of problems) console.error(`ERROR ${p}`);
	if (problems.length) process.exit(1);
	const outputs = {
		'AGENTS.md': syncBlock(read('AGENTS.md'), core, read('VERSION').trim()),
		'prompt/bootstrap.md': out,
		'evals/hooks/core.md': core,
	};
	const summary = `core ${coreBytes} of ${CORE_BUDGET_BYTES} bytes, prompt ${Buffer.byteLength(out)} bytes`;
	if (process.argv.includes('--check')) {
		const stale = Object.entries(outputs).filter(([path, text]) => {
			try {
				return readFileSync(join(root, path), 'utf8') !== text;
			} catch {
				return true;
			}
		});
		for (const [path] of stale) console.error(`ERROR ${path} is out of date; run \`node scripts/build-prompt.mjs\``);
		if (stale.length) process.exit(1);
		console.log(`Prompt: up to date (${summary})`);
	} else {
		for (const [path, text] of Object.entries(outputs)) writeFileSync(join(root, path), text);
		console.log(`Wrote ${Object.keys(outputs).join(' and ')} (${summary})`);
	}
}
