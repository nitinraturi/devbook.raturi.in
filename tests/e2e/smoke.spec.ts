import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

// Home, one page per sidebar group, plus privacy.
const PAGES = [
	'/',
	'/start-here/introduction/',
	'/start-here/adopt-in-a-project/',
	'/start-here/baseline-rules/',
	'/workflow/llm-assisted-workflow/',
	'/engineering/design-principles/',
	'/security/security-baseline/',
	'/quality/accessibility/',
	'/web/technical-seo/',
	'/llm-features/llm-evals/',
	'/platforms/mobile/',
	'/stacks/astro/',
	'/templates/adr/',
	'/prompts/overview/',
	'/checklists/pre-commit/',
	'/privacy/',
];

test('homepage and adoption guide share the complete onboarding prompt', async ({ page, request }) => {
	const prompt = (await readFile(new URL('../../templates/adopt-devbook.md', import.meta.url), 'utf8')).trim();
	for (const path of ['/', '/start-here/adopt-in-a-project/']) {
		await page.goto(path);
		const code = page.locator('.expressive-code').filter({ hasText: 'Paste into Claude or Copilot' });
		await expect(code).toHaveCount(1);
		await expect(code.getByRole('button', { name: 'Copy to clipboard' })).toBeAttached();
		const lines = await code.locator('.ec-line .code').allTextContents();
		expect(lines.map((line) => line.replace(/\n/g, '')).join('\n').trim()).toBe(prompt);
		expect(await page.locator('html').evaluate((element) => element.scrollWidth <= window.innerWidth)).toBe(true);
	}
	const response = await request.get('/start-here/adopt-in-a-project/index.md');
	expect(response.status()).toBe(200);
	expect(await response.text()).toContain(prompt);
});

test('baseline rules page shows every rule pack and the CI workflow', async ({ page }) => {
	await page.goto('/start-here/baseline-rules/');
	for (const profile of ['core', 'web', 'mobile', 'llm-features']) {
		const pack = (await readFile(new URL(`../../rules/${profile}.md`, import.meta.url), 'utf8')).trim();
		await page.getByRole('tab', { name: profile, exact: true }).click();
		const code = page.locator('.expressive-code').filter({ hasText: `rules/${profile}.md` });
		await expect(code).toBeVisible();
		const lines = await code.locator('.ec-line .code').allTextContents();
		expect(lines.map((line) => line.replace(/\n/g, '')).join('\n').trim()).toBe(pack);
	}
	await expect(page.locator('.expressive-code').filter({ hasText: 'devbook-sync.mjs --check' }).first()).toBeVisible();
	expect(await page.locator('html').evaluate((element) => element.scrollWidth <= window.innerWidth)).toBe(true);
});

/** Collects CSP violations and uncaught errors so a strict CSP cannot silently break the page. */
function watchErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => {
		if (m.type() === 'error') errors.push(m.text());
	});
	return errors;
}

async function axe(page: Page) {
	// Starlight's search button is named "Search" while also showing a ⌘K hint; that one
	// element is excluded from label-content-name-mismatch only (upstream, see docs/TODO.md).
	const a = await
		new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).disableRules(['label-content-name-mismatch']).analyze();
	const b = await new AxeBuilder({ page }).withRules(['label-content-name-mismatch']).exclude('site-search > button[data-open-modal]').analyze();
	const violations = [...a.violations, ...b.violations];
	return violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.help}`);
}

for (const path of PAGES) {
	test(`renders ${path} with no serious a11y issues or console errors`, async ({ page }) => {
		const errors = watchErrors(page);
		const res = await page.goto(path);
		expect(res?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveCount(1);
		expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://devbook.raturi.in${path}`);
		const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
		const types = ld['@graph'].map((n: { '@type': string }) => n['@type']);
		expect(types).toEqual(path === '/' ? ['WebSite', 'Person'] : ['WebSite', 'Person', 'TechArticle', 'BreadcrumbList'].slice(0, path === '/privacy/' ? 3 : 4));
		expect(await axe(page)).toEqual([]);
		expect(errors).toEqual([]);
	});
}

test('dark theme passes axe', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/security/security-baseline/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	expect(await axe(page)).toEqual([]);
});

test('stack pages show the last-verified date', async ({ page }) => {
	await page.goto('/stacks/astro/');
	await expect(page.locator('.dvb-verified time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
});

test('search returns results under the production CSP', async ({ page, isMobile }) => {
	const errors = watchErrors(page);
	await page.goto('/start-here/introduction/');
	if (isMobile) await page.getByRole('button', { name: 'Search' }).click();
	else await page.locator('site-search button').first().click();
	const dialog = page.locator('dialog[open]');
	await dialog.locator('input.pagefind-ui__search-input').fill('lockfile');
	await expect(dialog.locator('.pagefind-ui__result').first()).toBeVisible({ timeout: 10_000 });
	expect(errors).toEqual([]);
});

test('theme toggle switches to light and persists', async ({ page, isMobile }) => {
	test.skip(isMobile, 'Theme select lives in the mobile menu; covered on desktop.');
	await page.goto('/workflow/llm-assisted-workflow/');
	await page.locator('starlight-theme-select select').first().selectOption('light');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	expect(await axe(page)).toEqual([]);
});

test('unknown URL serves the custom 404', async ({ page }) => {
	const res = await page.goto('/no-such-page/');
	expect(res?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('Page not found');
	await expect(page.getByRole('link', { name: 'Start here' }).first()).toBeVisible();
	expect(await axe(page)).toEqual([]);
});

test('page Markdown is served and template pages include the template', async ({ request }) => {
	const res = await request.get('/templates/adr/index.md');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('text/markdown');
	const md = await res.text();
	expect(md).toMatch(/^# ADR\n/);
	expect(md).toContain('# ADR-NNNN');
	expect(md).not.toContain('import ');
});

test('crawl files exist', async ({ request }) => {
	for (const path of [
		'/robots.txt',
		'/sitemap.xml',
		'/sitemap-index.xml',
		'/llms.txt',
		'/llms-full.txt',
		'/llms-small.txt',
	]) {
		expect((await request.get(path)).status(), path).toBe(200);
	}
});

test('security headers are applied', async ({ request }) => {
	const h = (await request.get('/')).headers();
	expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
	expect(h['content-security-policy']).not.toMatch(/script-src[^;]*'unsafe-inline'/);
	expect(h['content-security-policy']).not.toContain('googletagmanager');
	expect(h['x-content-type-options']).toBe('nosniff');
	expect(h['strict-transport-security']).toContain('max-age=');
});
