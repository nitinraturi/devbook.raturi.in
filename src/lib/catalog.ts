// The catalog (catalog/sources.json), read at build time, so the catalog page shows exactly what the prompt allows,
// in the same groups.
import catalog from '../../catalog/sources.json';

export interface Upstream {
	id: string;
	title: string;
	group: string;
	use: string;
	hosts: string[];
	repo: string;
	ref: string;
	counts: boolean;
	status: 'adopted' | 'suggested' | 'retired';
	reason?: string;
	lastChecked: string;
}

export const upstreams = catalog.upstreams as Upstream[];
export const groups = catalog.groups as Record<string, { title: string; note: string }>;
export const builtins = catalog.builtins;
export const maxOptional = catalog.maxOptional;

export const adopted = upstreams.filter((u) => u.status === 'adopted');
/** Adopted sources pinned to a tag, a commit or the official marketplace; Devbook's own tracks `main`. */
export const pinned = adopted.filter((u) => u.ref !== 'main');

/** A short, readable form of a pinned ref. */
export const refLabel = (ref: string) =>
	ref === 'vendor-channel'
		? 'official'
		: ref === 'main'
			? 'main, not pinned'
			: /^[0-9a-f]{40}$/.test(ref)
				? ref.slice(0, 7)
				: ref;

export const repoUrl = (u: Upstream) => `https://github.com/${u.repo}`;

const HOSTS: Record<string, string> = { 'claude-code': 'Claude Code', other: 'others' };
export const hostLabel = (u: Upstream) => u.hosts.map((h) => HOSTS[h] ?? h).join(', ');
