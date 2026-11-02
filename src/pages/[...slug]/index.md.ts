import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { posix } from 'node:path';

// Serves each docs page's source as Markdown at <page>/index.md, used by the
// "Copy page as Markdown" button. MDX components are turned into plain Markdown so the
// file has the same content as the page: <Code> with a `?raw` import becomes a fenced
// block, <Tabs> become headings, <Steps> the list inside, <Aside> a blockquote and
// <CardGrid>/<LinkCard>/<Card> a link list. scripts/check-markdown.mjs fails the build
// if a component is left over.

const raw = import.meta.glob<string>(['/templates/*.md', '/LICENSE'], {
	query: '?raw',
	import: 'default',
	eager: true,
});

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({ params: { slug: entry.id === 'index' ? undefined : entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

function fence(code: string, lang: string, title: string | undefined, indent: string) {
	const longest = Math.max(2, ...[...code.matchAll(/`{3,}/g)].map((m) => m[0].length));
	const f = '`'.repeat(longest + 1);
	const lines = [`${f}${lang}${title ? ` title="${title}"` : ''}`, ...code.trimEnd().split('\n'), f];
	return lines.map((l) => (l ? indent + l : l)).join('\n');
}

function toMarkdown(body: string, filePath: string | undefined) {
	const dir = posix.dirname(`/${filePath ?? ''}`);
	const imports = new Map<string, string>();
	for (const m of body.matchAll(/^import\s+(\w+)\s+from\s+['"]([^'"]+)\?raw['"];?\s*$/gm)) {
		const src = raw[posix.join(dir, m[2]!)];
		if (src !== undefined) imports.set(m[1]!, src);
	}

	const out: string[] = [];
	let inFence: string | undefined;
	let heading = 1; // level of the last heading, so tab labels nest under it
	let aside: string[] | undefined;
	let squeeze = false; // drop the blank line after a removed wrapper tag if one already precedes it
	let listIndent: number | undefined; // content column of the open list item, if any
	for (const line of body.replace(/^import\s.+$\n?/gm, '').split('\n')) {
		const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
		if (inFence) {
			if (marker && marker[0] === inFence[0] && marker.length >= inFence.length) inFence = undefined;
			(aside ?? out).push(line);
			continue;
		}
		if (marker) {
			inFence = marker;
			(aside ?? out).push(line);
			continue;
		}
		if (squeeze && !line.trim() && !out.at(-1)?.trim()) continue;
		squeeze = false;
		const indent = line.match(/^\s*/)![0];
		const tag = line.trim();
		const h = line.match(/^(#{1,6})\s/);
		if (h) heading = h[1]!.length;
		const item = line.match(/^\s*(?:\d+\.|[-*+])\s+/);
		if (item) listIndent = item[0].length;
		else if (tag && indent.length < (listIndent ?? 0)) listIndent = undefined;

		if (/^<\/?(Tabs|Steps|CardGrid)\b[^>]*>$/.test(tag) || tag === '</TabItem>') {
			squeeze = true;
			continue;
		}
		if (tag.startsWith('<TabItem')) {
			out.push(`${'#'.repeat(Math.min(heading + 1, 6))} ${attr(tag, 'label') ?? ''}`);
			continue;
		}
		if (tag.startsWith('<Aside')) {
			const type = attr(tag, 'type') ?? 'note';
			aside = [`**${attr(tag, 'title') ?? type[0]!.toUpperCase() + type.slice(1)}**`, ''];
			continue;
		}
		if (tag === '</Aside>' && aside) {
			out.push(...aside.map((l) => (l ? `> ${l}` : '>')));
			aside = undefined;
			continue;
		}
		if (/^<(LinkCard|Card)\b.*\/>$/.test(tag)) {
			const [title, href, description] = ['title', 'href', 'description'].map((n) => attr(tag, n));
			const label = href ? `[${title}](${href})` : `**${title}**`;
			out.push(`- ${label}${description ? `: ${description}` : ''}`);
			continue;
		}
		const code = tag.match(/^<Code\s+code=\{(\w+)\}\s+lang="(\w+)"(?:\s+title="([^"]*)")?\s*\/>$/);
		const src = code ? imports.get(code[1]!) : undefined;
		if (code && src !== undefined) {
			// Indent only inside a list item; other indentation comes from HTML nesting.
			const inList = listIndent !== undefined && indent.length >= listIndent;
			(aside ?? out).push(fence(src, code[2]!, code[3], inList ? ' '.repeat(listIndent!) : ''));
			continue;
		}
		(aside ?? out).push(line);
	}
	return out.join('\n').trim();
}

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = ({ props }) => {
	const { title, description } = props.entry.data;
	const md = `# ${title}\n\n> ${description}\n\n${toMarkdown(props.entry.body ?? '', props.entry.filePath)}\n`;
	return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
