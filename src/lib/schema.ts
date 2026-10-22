import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { OG_IMAGE, PERSON, SITE_NAME, SITE_URL } from './site';

type Node = Record<string, unknown>;
type SidebarEntry = StarlightRouteData['sidebar'][number];
type SidebarLink = Extract<SidebarEntry, { type: 'link' }>;

const WEBSITE_ID = `${SITE_URL}#website`;

function links(entries: SidebarEntry[]): SidebarLink[] {
	return entries.flatMap((e) => (e.type === 'link' ? [e] : links(e.entries)));
}

/** The top-level sidebar group that contains the current page, with its first link. */
function currentGroup(sidebar: SidebarEntry[]) {
	for (const entry of sidebar) {
		if (entry.type !== 'group') continue;
		const all = links(entry.entries);
		if (all.some((l) => l.isCurrent)) return { label: entry.label, href: all[0]?.href };
	}
	return undefined;
}

/** One JSON-LD @graph per page: WebSite + Person everywhere; TechArticle + BreadcrumbList on docs pages. */
export function buildGraph(route: StarlightRouteData, pageUrl: string, isHome: boolean) {
	const website: Node = {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SITE_URL,
		name: SITE_NAME,
		inLanguage: 'en',
		publisher: { '@id': PERSON.id },
	};
	const person: Node = { '@type': 'Person', '@id': PERSON.id, name: PERSON.name, url: PERSON.url };
	if (PERSON.sameAs.length) person.sameAs = PERSON.sameAs;

	const graph: Node[] = [website, person];
	if (!isHome) {
		const { title, description, lastVerified } = route.entry.data as typeof route.entry.data & {
			lastVerified?: Date;
		};
		const modified = route.lastUpdated ?? lastVerified;
		const article: Node = {
			'@type': 'TechArticle',
			'@id': `${pageUrl}#article`,
			url: pageUrl,
			headline: title,
			description,
			inLanguage: 'en',
			author: { '@id': PERSON.id },
			publisher: { '@id': PERSON.id },
			isPartOf: { '@id': WEBSITE_ID },
			image: new URL(OG_IMAGE.path, SITE_URL).href,
		};
		if (modified) article.dateModified = modified.toISOString();
		graph.push(article);

		const group = currentGroup(route.sidebar);
		if (group) {
			const items: Node[] = [
				{ '@type': 'ListItem', position: 1, name: group.label, item: group.href && new URL(group.href, SITE_URL).href },
				{ '@type': 'ListItem', position: 2, name: title },
			];
			graph.push({ '@type': 'BreadcrumbList', itemListElement: items });
		}
	}
	return { '@context': 'https://schema.org', '@graph': graph };
}
