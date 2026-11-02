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
			const tier = manifest.files.find((file) => file.path === path)?.tier;
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
			};
		});
}

/** Stack note titles, in sidebar order, for the index's last row. */
export async function stackTitles(): Promise<string[]> {
	const stacks = await getCollection('docs', (entry) => entry.id.startsWith('stacks/'));
	return stacks.map((entry) => entry.data.title).sort((a, b) => a.localeCompare(b));
}
