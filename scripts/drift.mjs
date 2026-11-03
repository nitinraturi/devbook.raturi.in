#!/usr/bin/env node
// Weekly catalog drift check, run by .github/workflows/drift.yml. No model.
//   - A source pinned to a tag: is there a newer latest release?
//   - A source pinned to a commit SHA: has the default branch moved?
//   - A vendor-channel plugin: is it still listed in Anthropic's official marketplace?
// Prints a Markdown report. With --pr, opens one pull request per moved source that bumps its ref, refreshes the
// prompt and links the upstream diff for review; it never merges. Exit 1 when a vendor-channel plugin is missing.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '../..');
const CATALOG = join(root, 'catalog/sources.json');
const OFFICIAL = 'anthropics/claude-plugins-official';

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

/** The live GitHub lookups drift needs, behind one interface so tests can replace them. */
export const github = {
	latestTag: (repo) => {
		try {
			return gh('api', `repos/${repo}/releases/latest`, '--jq', '.tag_name');
		} catch {
			return null;
		}
	},
	headSha: (repo) => gh('api', `repos/${repo}/commits/HEAD`, '--jq', '.sha'),
	officialPlugins: () =>
		JSON.parse(
			Buffer.from(
				gh('api', `repos/${OFFICIAL}/contents/.claude-plugin/marketplace.json`, '--jq', '.content'),
				'base64',
			).toString('utf8'),
		).plugins.map((p) => p.name),
};

const isSha = (ref) => /^[0-9a-f]{40}$/.test(ref);
const officialNames = (u) =>
	Object.values(u.install).flatMap((cmd) => [...cmd.matchAll(/([\w<>-]+)@claude-plugins-official/g)].map((m) => m[1]));

/** One finding per checked source: { id, kind: 'moved' | 'missing' | 'current', from, to }. */
export function check(catalog, api = github) {
	const official = new Set(api.officialPlugins());
	const findings = [];
	for (const u of catalog.upstreams.filter((x) => x.status !== 'retired')) {
		for (const name of officialNames(u).filter((n) => !n.includes('<')))
			if (!official.has(name)) findings.push({ id: u.id, kind: 'missing', from: `${name}@claude-plugins-official` });
		if (u.ref === 'vendor-channel' || u.ref === 'main') continue;
		const latest = isSha(u.ref) ? api.headSha(u.repo) : (api.latestTag(u.repo) ?? u.ref);
		findings.push({
			id: u.id,
			repo: u.repo,
			kind: latest && latest !== u.ref ? 'moved' : 'current',
			from: u.ref,
			to: latest,
		});
	}
	return findings;
}

export function report(findings) {
	const moved = findings.filter((f) => f.kind === 'moved');
	const missing = findings.filter((f) => f.kind === 'missing');
	return [
		`# Catalog drift, ${new Date().toISOString().slice(0, 10)}`,
		'',
		`${moved.length} moved, ${missing.length} missing from the official marketplace, ${findings.filter((f) => f.kind === 'current').length} current.`,
		'',
		...moved.map((f) => `- ${f.id}: ${f.from} → ${f.to} (https://github.com/${f.repo}/compare/${f.from}...${f.to})`),
		...missing.map((f) => `- ${f.id}: ${f.from} is no longer in ${OFFICIAL}; retire it or find its new id`),
		'',
	].join('\n');
}

/** Opens a pull request that moves one source to its new ref. */
function openPr(f) {
	const branch = `drift/${f.id}-${f.to.slice(0, 12)}`;
	const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'inherit' });
	git('switch', '-C', branch, 'origin/main');
	const catalog = JSON.parse(readFileSync(CATALOG, 'utf8'));
	const u = catalog.upstreams.find((x) => x.id === f.id);
	Object.assign(u, { ref: f.to, lastChecked: new Date().toISOString().slice(0, 10), scan: 'not-run' });
	writeFileSync(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`);
	execFileSync('node', ['scripts/build-prompt.mjs'], { cwd: root, stdio: 'inherit' });
	git('commit', '-qam', `chore(catalog): move ${f.id} to ${f.to.slice(0, 12)}`);
	git('push', '-qf', 'origin', branch);
	const body = [
		`\`${f.repo}\` moved from \`${f.from}\` to \`${f.to}\`.`,
		'',
		`Upstream diff: https://github.com/${f.repo}/compare/${f.from}...${f.to}`,
		'',
		'Before merging: read the diff of every SKILL.md and script, reject downloads of binaries, remote instructions, obfuscated payloads or credential requests, and run `uvx mcp-scan@latest --skills` on the new ref. Record the result in `scan`.',
	].join('\n');
	try {
		gh(
			'pr',
			'create',
			'--head',
			branch,
			'--title',
			`chore(catalog): move ${f.id} to ${f.to.slice(0, 12)}`,
			'--body',
			body,
			'--label',
			'drift',
		);
	} catch {
		console.log(`A pull request for ${branch} is already open; its branch was updated.`);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const findings = check(JSON.parse(readFileSync(CATALOG, 'utf8')));
	process.stdout.write(report(findings));
	if (process.argv.includes('--pr')) for (const f of findings.filter((x) => x.kind === 'moved')) openPr(f);
	if (findings.some((f) => f.kind === 'missing')) process.exit(1);
}
