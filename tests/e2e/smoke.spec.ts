import AxeBuilder from '@axe-core/playwright';
import { readFile, readdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

// Home, the start-here guides, every instruction file, one stack note, plus privacy.
const PAGES = [
	'/',
	'/start-here/how-it-works/',
	'/start-here/setup/',
	'/start-here/using-devbook/',
	'/start-here/writing-instructions/',
	'/instructions/core/',
	'/instructions/security/',
	'/instructions/testing/',
	'/instructions/performance/',
	'/instructions/api-data/',
	'/instructions/database/',
	'/instructions/design/',
	'/instructions/seo/',
	'/instructions/content/',
	'/instructions/mobile/',
	'/instructions/licensing/',
	'/instructions/feature-docs/',
	'/stacks/astro/',
	'/license/',
	'/privacy/',
];

const codeText = async (page: Page, title: string) => {
	// Match the block's title exactly: a substring match also hits code that merely mentions it.
	const code = page
		.locator('.expressive-code')
		.filter({ has: page.locator('figcaption .title').getByText(title, { exact: true }) })
		.first();
	await expect(code).toBeAttached();
	const lines = await code.locator('.ec-line .code').allTextContents();
	return lines.map((line) => line.replace(/\n/g, '')).join('\n').trim();
};

test('homepage shows the complete setup prompt and AGENTS.md template', async ({ page, request }) => {
	const prompt = (await readFile(new URL('../../templates/setup-prompt.md', import.meta.url), 'utf8')).trim();
	const agents = (await readFile(new URL('../../templates/AGENTS.md', import.meta.url), 'utf8')).trim();
	await page.goto('/');
	await expect(page.locator('.expressive-code').filter({ hasText: 'Paste into Claude or Copilot' }).getByRole('button', { name: 'Copy to clipboard' })).toBeAttached();
	expect(await codeText(page, 'Paste into Claude or Copilot')).toBe(prompt);
	expect(await codeText(page, 'AGENTS.md (template)')).toBe(agents);
	expect(await page.locator('html').evaluate((element) => element.scrollWidth <= window.innerWidth)).toBe(true);
	expect(await (await request.get('/index.md')).text()).toContain(prompt);
});

test('every @ path in the AGENTS.md template exists in the repo', async () => {
	const agents = await readFile(new URL('../../templates/AGENTS.md', import.meta.url), 'utf8');
	const paths = [...agents.matchAll(/^@\.devbook\/(\S+)$/gm)].map((m) => m[1]!).filter((p) => !p.includes('<'));
	expect(paths.length).toBeGreaterThanOrEqual(9);
	for (const p of paths) await expect(readFile(new URL(`../../${p}`, import.meta.url), 'utf8')).resolves.toBeTruthy();
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
	await page.goto('/instructions/security/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	expect(await axe(page)).toEqual([]);
});

test('stack pages show the last-verified date', async ({ page }) => {
	await page.goto('/stacks/astro/');
	await expect(page.locator('.dvb-verified time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
});

test('search returns results under the production CSP', async ({ page, isMobile }) => {
	const errors = watchErrors(page);
	await page.goto('/start-here/setup/');
	if (isMobile) await page.getByRole('button', { name: 'Search' }).click();
	else await page.locator('site-search button').first().click();
	const dialog = page.locator('dialog[open]');
	await dialog.locator('input.pagefind-ui__search-input').fill('submodule');
	await expect(dialog.locator('.pagefind-ui__result').first()).toBeVisible({ timeout: 10_000 });
	expect(errors).toEqual([]);
});

test('theme toggle switches to light and persists', async ({ page, isMobile }) => {
	test.skip(isMobile, 'Theme select lives in the mobile menu; covered on desktop.');
	await page.goto('/instructions/core/');
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
	await expect(page.getByRole('link', { name: 'Set up Devbook' }).first()).toBeVisible();
	expect(await axe(page)).toEqual([]);
});

test('every instruction file is listed in the AGENTS.md template and on the homepage', async ({ page }) => {
	const agents = await readFile(new URL('../../templates/AGENTS.md', import.meta.url), 'utf8');
	const files = (await readdir(new URL('../../instructions/', import.meta.url))).filter((f) => f.endsWith('.md'));
	await page.goto('/');
	for (const f of files) {
		expect(agents).toContain(`@.devbook/instructions/${f}`);
		await expect(page.locator(`a[href="/instructions/${f.replace(/\.md$/, '')}/"]`).first()).toBeAttached();
	}
});

test('the setup prompt names every instruction file', async () => {
	const prompt = await readFile(new URL('../../templates/setup-prompt.md', import.meta.url), 'utf8');
	const files = (await readdir(new URL('../../instructions/', import.meta.url))).filter((f) => f.endsWith('.md'));
	for (const f of files) expect(prompt).toMatch(new RegExp(`\\b${f.replace(/\.md$/, '')}\\b`));
});

test('license page shows the full LICENSE text', async ({ page }) => {
	const license = (await readFile(new URL('../../LICENSE', import.meta.url), 'utf8')).trim();
	await page.goto('/license/');
	expect(await codeText(page, 'LICENSE')).toBe(license);
	await expect(page.locator('a[href="https://creativecommons.org/licenses/by/4.0/"]').first()).toBeAttached();
	await expect(page.locator('footer a[href="/license/"], .dvb-site-footer a[href="/license/"]').first()).toBeAttached();
});

test('setup page method tabs switch between submodule and copy', async ({ page }) => {
	await page.goto('/start-here/setup/');
	const copyTab = page.getByRole('tab', { name: 'Copy (plain files)' }).first();
	await expect(copyTab).toBeVisible();
	await copyTab.click();
	await expect(page.getByText('codeload.github.com').first()).toBeVisible();
	await expect(page.getByRole('tab', { name: 'Copy (plain files)' }).last()).toHaveAttribute('aria-selected', 'true');
	expect(await axe(page)).toEqual([]);
});

test('page Markdown is served and setup includes the templates', async ({ request }) => {
	const res = await request.get('/start-here/setup/index.md');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('text/markdown');
	const md = await res.text();
	expect(md).toMatch(/^# Setup\n/);
	expect(md).toContain('@.devbook/instructions/core.md');
	const prompt = await readFile(new URL('../../templates/setup-prompt.md', import.meta.url), 'utf8');
	const copyCommand = prompt.match(/^\s*(rm -rf \.devbook .+)$/m)?.[1];
	expect(copyCommand).toBeTruthy();
	expect(md).toContain(copyCommand!);
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
