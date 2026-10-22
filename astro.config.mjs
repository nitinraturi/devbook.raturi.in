// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

/** @param {string} label @param {string} directory */
const group = (label, directory) => ({ label, items: [{ autogenerate: { directory } }] });

export default defineConfig({
  site: 'https://devbook.raturi.in',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    starlight({
      title: 'Devbook',
      description:
        'A practical engineering playbook for building web apps, mobile apps and LLM features with AI coding assistants, from spec to launch.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/nitinraturi/devbook.raturi.in' }],
      editLink: { baseUrl: 'https://github.com/nitinraturi/devbook.raturi.in/edit/main/' },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      plugins: [starlightLinksValidator()],
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
