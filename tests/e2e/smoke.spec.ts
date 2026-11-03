import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

// Home, every guide, the catalog and evals, plus privacy.
const PAGES = [
	'/',
	'/start-here/how-it-works/',
	'/start-here/setup/',
	'/start-here/using-devbook/',
	'/catalog/',
	'/optional-skills/',
	'/evals/',
	'/about/',
	'/start-here/writing-instructions/',
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
	return lines
		.map((line) => line.replace(/\n/g, ''))
		.join('\n')
		.trim();
};

test('homepage shows the complete bootstrap prompt and core block', async ({ page, request }) => {
	const prompt = (await readFile(new URL('../../prompt/bootstrap.md', import.meta.url), 'utf8')).trim();
	const core = (await readFile(new URL('../../core/AGENTS.core.md', import.meta.url), 'utf8')).trim();
	await page.goto('/');
	await expect(
		page
			.locator('.expressive-code')
			.filter({ hasText: 'Paste into your coding agent' })
			.getByRole('button', { name: 'Copy to clipboard' }),
	).toBeAttached();
	expect(await codeText(page, 'Paste into your coding agent')).toBe(prompt);
	expect(await codeText(page, 'AGENTS.md (Devbook block)')).toBe(core);
	expect(await page.locator('html').evaluate((element) => element.scrollWidth <= window.innerWidth)).toBe(true);
	expect(await (await request.get('/index.md')).text()).toContain(prompt);
});

test('the catalog page links every adopted, suggested and retired source', async ({ page, request }) => {
	const catalog = JSON.parse(await readFile(new URL('../../catalog/sources.json', import.meta.url), 'utf8'));
	await page.goto('/catalog/');
	const md = await (await request.get('/catalog/index.md')).text();
	for (const u of catalog.upstreams) {
		await expect(page.locator(`a[href="https://github.com/${u.repo}"]`).first()).toBeAttached();
		expect(md).toContain(`[${u.title}](https://github.com/${u.repo})`);
	}
});

test('every optional skill in the marketplace is on the optional skills page', async ({ page }) => {
	const market = JSON.parse(await readFile(new URL('../../.claude-plugin/marketplace.json', import.meta.url), 'utf8'));
	await page.goto('/optional-skills/');
	for (const p of market.plugins) await expect(page.getByRole('link', { name: p.name, exact: true })).toBeAttached();
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
	const a = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.disableRules(['label-content-name-mismatch'])
		.analyze();
	const b = await new AxeBuilder({ page })
		.withRules(['label-content-name-mismatch'])
		.exclude('site-search > button[data-open-modal]')
		.analyze();
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
		expect(types).toEqual(
			path === '/'
				? ['WebSite', 'Person']
				: ['WebSite', 'Person', 'TechArticle', 'BreadcrumbList'].slice(0, path === '/privacy/' ? 3 : 4),
		);
		expect(await axe(page)).toEqual([]);
		expect(errors).toEqual([]);
	});
}

test('dark theme passes axe', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/catalog/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	expect(await axe(page)).toEqual([]);
});

test('the catalog shows its last-verified date', async ({ page }) => {
	await page.goto('/catalog/');
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
	await page.goto('/catalog/');
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

test('license page shows the full LICENSE text', async ({ page }) => {
	const license = (await readFile(new URL('../../LICENSE', import.meta.url), 'utf8')).trim();
	await page.goto('/license/');
	expect(await codeText(page, 'LICENSE')).toBe(license);
	await expect(page.locator('a[href="https://creativecommons.org/licenses/by/4.0/"]').first()).toBeAttached();
	await expect(page.locator('footer a[href="/license/"], .dvb-site-footer a[href="/license/"]').first()).toBeAttached();
});

test('page Markdown is served and setup includes the prompt', async ({ request }) => {
	const res = await request.get('/start-here/setup/index.md');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('text/markdown');
	const md = await res.text();
	expect(md).toMatch(/^# Setup\n/);
	const prompt = await readFile(new URL('../../prompt/bootstrap.md', import.meta.url), 'utf8');
	expect(md).toContain(prompt.trim().split('\n').at(-1)!);
	expect(md).toContain('<!-- BEGIN:devbook-core');
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

test('staleness notice is decided when the page is viewed, not when it was built', async ({ page }) => {
	await page.goto('/catalog/');
	const notice = page.locator('[data-stale-notice]');
	const verified = Date.parse((await notice.getAttribute('data-verified'))!);
	const days = Number(await notice.getAttribute('data-stale-days'));

	await page.clock.setFixedTime(verified + 864e5);
	await page.reload();
	await expect(notice).toBeHidden();

	await page.clock.setFixedTime(verified + (days + 1) * 864e5);
	await page.reload();
	await expect(notice).toBeVisible();
	await expect(notice).toContainText('may be out of date');
});

test('local server answers a malformed URL with 400 and keeps serving', async ({ request }) => {
	expect((await request.get('/%E0%A4%A')).status()).toBe(400);
	expect((await request.get('/')).status()).toBe(200);
});

test('the history timeline is built from the changelog', async ({ page }) => {
	const changelog = await readFile(new URL('../../CHANGELOG.md', import.meta.url), 'utf8');
	const newest = changelog.match(/^## \d{4}-\d{2}-\d{2}: (.+)$/m)?.[1];
	expect(newest).toBeTruthy();
	await page.goto('/about/');
	await expect(page.locator('.dvb-timeline').getByText(newest!, { exact: true })).toBeVisible();
	await page.goto('/');
	await expect(page.locator('.dvb-home-history .dvb-timeline > li').first()).toBeVisible();
});
