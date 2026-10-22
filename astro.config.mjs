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
				'A practical engineering playbook for building web apps, mobile apps and LLM features with AI coding assistants, from spec to launch.',
			logo: { src: './src/assets/logo.svg', alt: '' },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: REPO }],
			editLink: { baseUrl: `${REPO}/edit/main/` },
			lastUpdated: true,
			credits: false,
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
			},
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/og-default.png` } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Devbook: rules, templates and prompts for building software with AI coding assistants.' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/og-default.png` } },
			],
			plugins: [
				starlightLinksValidator(),
				starlightLlmsTxt({
					projectName: 'Devbook',
					details:
						'Each page is a short list of MUST / SHOULD / MUST NOT rules with the reason behind them. Universal rules apply to every project; stack profiles add tool specifics; projects override both. Time-sensitive pages carry a "lastVerified" date.',
					exclude: ['404', 'privacy'],
				}),
			],
			sidebar: [
				group('Start here', 'start-here'),
				group('Workflow', 'workflow'),
				group('Engineering', 'engineering'),
				group('Security', 'security'),
				group('Quality', 'quality'),
				group('Web & content', 'web'),
				group('LLM features', 'llm-features'),
				group('Platforms', 'platforms'),
				group('Stack profiles', 'stacks'),
				group('Templates', 'templates'),
				group('Prompts', 'prompts'),
				group('Checklists', 'checklists'),
			],
		}),
	],
});
