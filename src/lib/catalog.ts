// The catalog (catalog/sources.json), read at build time, so the catalog page shows exactly what the prompt allows.
import catalog from '../../catalog/sources.json';

export interface Upstream {
	id: string;
	title: string;
	use: string;
	hosts: string[];
	repo: string;
	ref: string;
	counts: boolean;
	status: 'adopted' | 'suggested' | 'retired';
	reason?: string;
}

export const upstreams = catalog.upstreams as Upstream[];

/** A short, readable form of a pinned ref. */
export const refLabel = (ref: string) =>
	ref === 'vendor-channel' ? 'official marketplace' : /^[0-9a-f]{40}$/.test(ref) ? ref.slice(0, 7) : ref;

export const repoUrl = (u: Upstream) => `https://github.com/${u.repo}`;

const HOSTS: Record<string, string> = { 'claude-code': 'Claude Code', other: 'others' };
export const hostLabel = (u: Upstream) => u.hosts.map((h) => HOSTS[h] ?? h).join(', ');
