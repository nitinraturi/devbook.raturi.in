// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
	{ ignores: ['dist/', '.astro/', '.wrangler/', '.lighthouseci/', 'playwright-report/', 'test-results/'] },
	js.configs.recommended,
	tseslint.configs.recommended,
	astro.configs.recommended,
	{
		languageOptions: { globals: { ...globals.node, ...globals.browser } },
		// Storage access can throw (private mode, blocked cookies); ignoring that is deliberate.
		rules: { 'no-empty': ['error', { allowEmptyCatch: true }] },
	},
	// Google's gtag snippet must push the Arguments object, not a rest array.
	{ files: ['src/components/Head.astro/*.{js,ts}'], rules: { 'prefer-rest-params': 'off' } },
	// Last, so formatting is Prettier's job only.
	prettier,
);
