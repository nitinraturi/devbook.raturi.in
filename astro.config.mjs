// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';

const SITE = 'https://devbook.raturi.in';
const REPO = 'https://github.com/nitinraturi/devbook.raturi.in';

/** @param {string} label @param {string} directory */
const group = (label, directory) => ({ label, items: [{ autogenerate: { directory } }] });

export default defineConfig({
	site: SITE,
	trailingSlash: 'always',
	output: 'static',
	// Emit page scripts as cached, content-hashed files instead of inlining them into every page.
	vite: { build: { assetsInlineLimit: 0 } },
	integrations: [
		starlight({
			title: 'Devbook',
			description:
				'A few short instruction files that make Claude and Copilot build like a senior engineer: workflow, engineering, security, design, SEO and content.',
			logo: { light: './src/assets/logo.svg', dark: './src/assets/logo-dark.svg', alt: '' },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: REPO }],
			lastUpdated: true,
			credits: false,
			// The 404 page is src/pages/404.astro.
			disable404Route: true,
			// IBM Plex Mono, self-hosted, Latin only (docs/design-system.md, ADR-0006).
			customCss: ['@fontsource/ibm-plex-mono/latin-400.css', './src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
			},
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/og-default.png` } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'Devbook: senior-engineer instructions for Claude and Copilot.' },
				},
				{ tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/og-default.png` } },
			],
			plugins: [
				starlightLinksValidator(),
				starlightLlmsTxt({
					projectName: 'Devbook',
					details:
						'Devbook is a small set of instruction files for AI coding assistants. Projects add it at .devbook, as a git submodule or copied files, and import the files from AGENTS.md. Core, security and testing are mandatory; other instructions load when they apply; stack notes add tool specifics; project rules in AGENTS.md override both.',
					exclude: ['privacy'],
				}),
			],
			sidebar: [
				{
					label: 'Start',
					items: [
						{ label: 'Home', link: '/' },
						'start-here/how-it-works',
						'start-here/setup',
						'start-here/using-devbook',
						'start-here/enforcement-kit',
						'start-here/writing-instructions',
						'start-here/contact',
						'about',
						'license',
					],
				},
				group('Instructions', 'instructions'),
				group('Stack notes', 'stacks'),
			],
		}),
	],
});
