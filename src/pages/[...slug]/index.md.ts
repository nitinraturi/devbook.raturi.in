import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { posix } from 'node:path';
import { changelogDays, formatDay } from '../../lib/changelog';
import { hostLabel, refLabel, repoUrl, upstreams } from '../../lib/catalog';
import { delta, latest, score } from '../../lib/evals';

// Serves each docs page's source as Markdown at <page>/index.md, used by the
// "Copy page as Markdown" button. MDX components are turned into plain Markdown so the
// file has the same content as the page: <Code> with a `?raw` import becomes a fenced
// block, <History> the changelog timeline, and <Catalog> and <EvalResults> their tables.
// scripts/check-markdown.mjs fails the build if a component is left over.

const raw = import.meta.glob<string>(['/prompt/bootstrap.md', '/core/AGENTS.core.md', '/LICENSE', '/CHANGELOG.md'], {
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
function generated(tag: string): string | undefined {
	const catalog = tag.match(/^<Catalog status="(\w+)" \/>$/);
	if (catalog) {
		const adopted = catalog[1] === 'adopted';
		const rows = upstreams
			.filter((u) => u.status === catalog[1])
			.map(
				(u) =>
					`| [${u.title}](${repoUrl(u)})${u.counts ? '' : ' (doesn’t count toward the cap)'} | ${adopted ? u.use : u.reason} | ${hostLabel(u)} | \`${refLabel(u.ref)}\` |`,
			);
		return [
			`| Source | ${adopted ? 'Use' : 'Why not installed'} | Hosts | Pinned to |`,
			'|---|---|---|---|',
			...rows,
		].join('\n');
	}
	const evals = tag.match(/^<EvalResults suite="([\w-]+)" \/>$/);
	if (evals) {
		const result = latest()?.suites[evals[1]!];
		if (!result) return 'No measured results yet.';
		const rows = result.cases.map(
			(c) => `| \`${c.name}\` | ${score(c.with)} | ${score(c.without)} | ${delta(c.delta)} |`,
		);
		return ['| Case | With Devbook | Without | Δ |', '|---|---|---|---|', ...rows].join('\n');
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
