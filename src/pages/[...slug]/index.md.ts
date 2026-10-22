import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

// Serves each docs page's source as Markdown at <page>/index.md, used by the
// "Copy page as Markdown" button. Template pages (.mdx) import their template with
// `?raw` and render it with <Code>; here that is expanded into a fenced block so the
// Markdown has the same content as the page.

const templates = import.meta.glob<string>('/templates/*.md', { query: '?raw', import: 'default', eager: true });

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', (e) => e.id !== '404');
	return docs.map((entry) => ({ params: { slug: entry.id === 'index' ? undefined : entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

function fence(code: string, lang: string, title?: string) {
	const longest = Math.max(2, ...[...code.matchAll(/`{3,}/g)].map((m) => m[0].length));
	const f = '`'.repeat(longest + 1);
	return `${f}${lang}${title ? ` title="${title}"` : ''}\n${code.trimEnd()}\n${f}`;
}

function toMarkdown(body: string) {
	const imports = new Map<string, string>();
	for (const m of body.matchAll(/^import\s+(\w+)\s+from\s+['"][./]*templates\/([\w.-]+\.md)\?raw['"];?\s*$/gm)) {
		const src = templates[`/templates/${m[2]}`];
		if (m[1] && src !== undefined) imports.set(m[1], src);
	}
	return body
		.replace(/^import\s.+$\n?/gm, '')
		.replace(/<Code\s+code=\{(\w+)\}\s+lang="(\w+)"(?:\s+title="([^"]*)")?\s*\/>/g, (all, name: string, lang: string, title?: string) => {
			const src = imports.get(name);
			return src === undefined ? all : fence(src, lang, title);
		})
		.trim();
}

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = ({ props }) => {
	const { title, description } = props.entry.data;
	const md = `# ${title}\n\n> ${description}\n\n${toMarkdown(props.entry.body ?? '')}\n`;
	return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
