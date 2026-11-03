import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { posix } from 'node:path';
import { changelogDays, formatDay } from '../../lib/changelog';
import { adopted, builtins, groups, hostLabel, pinned, refLabel, repoUrl, upstreams } from '../../lib/catalog';
import { delta, latest, score } from '../../lib/evals';
import { agents, CORE, coreBytes, coreLines, phases, PROMPT, stats } from '../../lib/home';

// Serves each docs page's source as Markdown at <page>/index.md, used by the
// "Copy page as Markdown" button. MDX components are turned into plain Markdown so the
// file has the same content as the page: <Code> with a `?raw` import becomes a fenced
// block, <History> the changelog timeline, <Catalog> and <EvalResults> their tables, and the homepage
// sections (<HomeHero>, <Phases>, <AgentMatrix>, <CoreBlock>, <ProofCards>) headings, lists and fenced blocks.
// scripts/check-markdown.mjs fails the build if a component is left over.

const raw = import.meta.glob<string>(['/prompt/bootstrap.md', '/LICENSE', '/CHANGELOG.md'], {
	query: '?raw',
	import: 'default',
	eager: true,
});

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({ params: { slug: entry.id === 'index' ? undefined : entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

function fence(code: string, lang: string, title: string | undefined) {
	const longest = Math.max(2, ...[...code.matchAll(/`{3,}/g)].map((m) => m[0].length));
	const f = '`'.repeat(longest + 1);
	const lines = [`${f}${lang}${title ? ` title="${title}"` : ''}`, ...code.trimEnd().split('\n'), f];
	return lines.join('\n');
}

/** The <History> timeline as a list: one item per day, with the day's entries nested. */
function history(perDay: number | undefined) {
	return changelogDays(raw['/CHANGELOG.md'] ?? '')
		.map(({ date, titles }) => {
			const shown = perDay ? titles.slice(0, perDay) : titles;
			const more = titles.length - shown.length;
			const items = [...shown, ...(more > 0 ? [`and ${more} more`] : [])].map((t) => `  - ${t}`);
			return [`- ${formatDay(date)}`, ...items].join('\n');
		})
		.join('\n');
}

/** <Catalog> and <EvalResults> as Markdown tables, from the same data as the components. */
const table = (head: string[], rows: string[][]) =>
	[`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join(
		'\n',
	);

/** The catalog page body: one table per group, then the suggested and retired sources and the built-ins. */
function catalogMarkdown() {
	const sections = Object.entries(groups).flatMap(([id, g]) => {
		const rows = adopted.filter((u) => u.group === id);
		if (!rows.length) return [];
		return [
			`## ${g.title}`,
			`${g.note[0]!.toUpperCase()}${g.note.slice(1)}.`,
			table(
				['Source', 'Use', 'Agents', 'Pinned to'],
				rows.map((u) => [
					`[${u.title}](${repoUrl(u)}) (\`${u.repo}\`)`,
					u.use,
					hostLabel(u),
					`\`${refLabel(u.ref)}\`${u.counts ? '' : ' (free)'}`,
				]),
			),
		];
	});
	const side = (status: string, title: string) => [
		`## ${title}`,
		upstreams
			.filter((u) => u.status === status)
			.map((u) => `- [${u.title}](${repoUrl(u)}): ${u.reason}.`)
			.join('\n'),
	];
	return [
		`- Installable: ${adopted.length} sources`,
		...sections,
		...side('suggested', 'Suggested, never installed'),
		...side('retired', 'Retired'),
		`Claude Code already has ${builtins.map((b) => `\`${b.command}\``).join(', ')}, so the catalog has no review skills.`,
	].join('\n\n');
}

/** Generated components as Markdown, from the same data as the components. */
function generated(tag: string): string | undefined {
	if (tag === '<Catalog />') return catalogMarkdown();
	if (tag === '<HomeHero />')
		return [
			'One prompt that sets up your repo for careful agent coding. Paste it into your coding agent. It reads your repository, shows you one plan, and only then writes a small core block and your real commands into `AGENTS.md`.',
			stats.map((s) => `- ${s.label}: ${s.value}`).join('\n'),
			'## The bootstrap prompt',
			'Paste it into Claude Code, Codex, Cursor, Copilot or Gemini CLI in your repository. It shows a plan before it changes anything. Hooks are Claude Code only.',
			fence(PROMPT, 'md', 'Bootstrap prompt'),
		].join('\n\n');
	if (tag === '<Phases />')
		return [
			'## Seven phases, one approval',
			phases.map((p, i) => `${i + 1}. **${p.title}.** ${p.text}`).join('\n'),
			'Nothing is written until you answer “yes” to the plan in phase 2.',
		].join('\n\n');
	if (tag === '<AgentMatrix />')
		return [
			'## What you get in your agent',
			...agents.flatMap((a) => [
				`### ${a.name}`,
				table(
					['', 'What', 'How'],
					a.rows.map((r) => [r.support, r.what, r.how]),
				),
			]),
		].join('\n\n');
	if (tag === '<CoreBlock />')
		return [
			'## The core block',
			`The only part loaded in every session: ${coreLines.length} lines, ${coreBytes.toLocaleString('en')} bytes against a 2 KB budget, merged into \`AGENTS.md\` between markers. Precedence: your request, then your rules, then this block.`,
			fence(CORE, 'md', 'AGENTS.md (Devbook block)'),
		].join('\n\n');
	if (tag === '<ProofCards />') {
		const core = latest()?.suites.core;
		return [
			`## Measured with and without Devbook`,
			core
				? `${score(core.score)} with Devbook, ${delta(core.meanDelta)} against no Devbook. [The evals](/evals/)`
				: 'No results yet. [The evals](/evals/)',
			`## Curated, not written`,
			`${pinned.length} pinned sources and Devbook’s own. [The catalog](/catalog/)`,
		].join('\n\n');
	}
	const evals = tag.match(/^<EvalResults suite="([\w-]+)" \/>$/);
	if (evals) {
		const result = latest()?.suites[evals[1]!];
		if (!result) return 'No measured results yet.';
		return table(
			['Case', 'With Devbook', 'Without', 'Δ'],
			result.cases.map((c) => [`\`${c.name}\``, score(c.with), score(c.without), delta(c.delta)]),
		);
	}
	return undefined;
}

async function toMarkdown(body: string, filePath: string | undefined) {
	const dir = posix.dirname(`/${filePath ?? ''}`);
	const imports = new Map<string, string>();
	for (const m of body.matchAll(/^import\s+(\w+)\s+from\s+['"]([^'"]+)\?raw['"];?\s*$/gm)) {
		const src = raw[posix.join(dir, m[2]!)];
		if (src !== undefined) imports.set(m[1]!, src);
	}

	const out: string[] = [];
	let inFence: string | undefined;
	for (const line of body.replace(/^import\s.+$\n?/gm, '').split('\n')) {
		const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
		if (inFence) {
			if (marker && marker[0] === inFence[0] && marker.length >= inFence.length) inFence = undefined;
			out.push(line);
			continue;
		}
		if (marker) {
			inFence = marker;
			out.push(line);
			continue;
		}
		const tag = line.trim();
		const made = generated(tag);
		if (made !== undefined) {
			out.push(made);
			continue;
		}
		const timeline = tag.match(/^<History(?:\s+perDay=\{(\d+)\})?\s*\/>$/);
		if (timeline) {
			out.push(history(timeline[1] ? Number(timeline[1]) : undefined));
			continue;
		}
		const code = tag.match(/^<Code\s+code=\{(\w+)\}\s+lang="(\w+)"(?:\s+title="([^"]*)")?\s*\/>$/);
		const src = code ? imports.get(code[1]!) : undefined;
		if (code && src !== undefined) {
			out.push(fence(src, code[2]!, code[3]));
			continue;
		}
		out.push(line);
	}
	return out.join('\n').trim();
}

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = async ({ props }) => {
	const { title, description } = props.entry.data;
	const md = `# ${title}\n\n> ${description}\n\n${await toMarkdown(props.entry.body ?? '', props.entry.filePath)}\n`;
	return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
