// Rows for the homepage index of instruction files, built from each file's frontmatter, its first
// rule ID and its loading tier in devbook.manifest.json, so the homepage never restates them.
import { getCollection } from 'astro:content';
import manifest from '../../devbook.manifest.json';

export interface InstructionRow {
	href: string;
	title: string;
	description: string;
	/** Rule ID prefix, such as CORE. */
	prefix: string;
	/** When the file loads, in words. */
	loads: string;
	/** When to set it up, from the manifest. */
	loadWhen: string;
	/** Loading tier: always, path or task. */
	tier: string;
	/** Path-tier globs, from the manifest. */
	globs: string[];
}

const LOADS: Record<string, string> = {
	always: 'Every chat',
	path: 'By file path',
	task: 'By task',
};

export async function instructionRows(): Promise<InstructionRow[]> {
	const docs = await getCollection('docs', (entry) => entry.id.startsWith('instructions/'));
	return docs
		.sort((a, b) => (a.data.sidebar.order ?? 0) - (b.data.sidebar.order ?? 0))
		.map((entry) => {
			const path = `${entry.id}.md`;
			const file = manifest.files.find((f) => f.path === path);
			const tier = file?.tier;
			const prefix = entry.body?.match(/^- ([A-Z]+)-\d{2}:/m)?.[1];
			const { title, description } = entry.data;
			if (!tier || !prefix || !description) {
				throw new Error(`${path}: needs a manifest tier, a description and numbered rules for the homepage index`);
			}
			return {
				href: `/${entry.id}/`,
				title,
				description,
				prefix,
				loads: LOADS[tier] ?? tier,
				loadWhen: file?.loadWhen ?? '',
				tier,
				globs: (file as { globs?: string[] } | undefined)?.globs ?? [],
			};
		});
}

/** Stack note titles, in sidebar order, for the index's last row. */
export async function stackTitles(): Promise<string[]> {
	const stacks = await getCollection('docs', (entry) => entry.id.startsWith('stacks/'));
	return stacks.map((entry) => entry.data.title).sort((a, b) => a.localeCompare(b));
}

export interface SkillRow {
	name: string;
	description: string;
	/** Which projects get it linked, in words. */
	linked: string;
}

const skillFiles = import.meta.glob<string>('../../skills/*/SKILL.md', {
	query: '?raw',
	import: 'default',
	eager: true,
});

/** Every skill's name and description from its frontmatter, and when setup links it, from the manifest. */
export function skillRows(): SkillRow[] {
	return Object.values(skillFiles)
		.map((text) => {
			const field = (key: string) =>
				text
					.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
					?.trim()
					.replace(/^(['"])(.*)\1$/, '$2') ?? '';
			const name = field('name');
			const entry = manifest.files.find((f) => f.path === `skills/${name}/SKILL.md`) as
				{ linkWith?: string; linked?: boolean } | undefined;
			const linked =
				entry?.linked === false
					? 'Never linked; the setup prompt reads it'
					: entry?.linkWith === 'always'
						? 'Every project'
						: `With ${entry?.linkWith?.replace(/^instructions\/|\.md$/g, '') ?? '?'}`;
			return { name, description: field('description'), linked };
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}
