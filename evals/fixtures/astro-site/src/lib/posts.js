import { slugify } from './format.js';

const raw = [
	{
		title: 'Why we built Lumen',
		date: '2026-09-14',
		summary:
			'Folders made us file notes instead of thinking with them, so we built an app that links notes as you write.',
		body: 'We kept losing ideas in folders.\n\nLumen links related notes as you write, so an idea from March shows up when you need it in October.\n\nThis post explains the three choices behind that: local-first storage, plain-text notes and links you can see.',
	},
	{
		title: 'Plain text, forever',
		date: '2026-10-02',
		summary:
			'Every Lumen note is a Markdown file on your disk, so your notes outlive the app and work with the tools you already use.',
		body: 'Your notes are Markdown files in a folder you choose.\n\nYou can open them in any editor, sync them with any service and keep them after you stop using Lumen.',
	},
];

export const posts = raw.map((post) => ({ ...post, slug: slugify(post.title) }));
