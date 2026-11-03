// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';

const SITE = 'https://devbook.raturi.in';
const REPO = 'https://github.com/nitinraturi/devbook.raturi.in';

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
				'One bootstrap prompt that sets up a repository for careful agent coding: a small core block in AGENTS.md, pinned vendor skills and hooks.',
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
				Header: './src/components/Header.astro',
				Banner: './src/components/Banner.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
			},
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/og-default.png` } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'Devbook: one bootstrap prompt for careful agent coding.' },
				},
				{ tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/og-default.png` } },
			],
			plugins: [
				starlightLinksValidator(),
				starlightLlmsTxt({
					projectName: 'Devbook',
					details:
						'Devbook is one bootstrap prompt for AI coding agents. Pasted into Claude Code, Codex, Cursor, Copilot or Gemini CLI, it detects the stack, shows a plan, writes a small core block and the real commands into AGENTS.md, installs at most three pinned vendor skills from an allowlist, adds hooks where the agent supports them, and never touches CI or deploys. Project rules in AGENTS.md override the block.',
					exclude: ['privacy'],
				}),
			],
			sidebar: [
				{
					label: 'Get started',
					items: [
						'start-here/how-it-works',
						{ label: 'Setup and updates', slug: 'start-here/setup' },
						{ label: 'Use it day to day', slug: 'start-here/using-devbook' },
					],
				},
				{ label: 'Reference', items: ['catalog', 'optional-skills', 'evals', 'changelog'] },
				{ label: 'Guides', items: ['start-here/writing-instructions'] },
				{ label: 'About', items: ['about', 'start-here/contact', 'license'] },
			],
		}),
	],
});
