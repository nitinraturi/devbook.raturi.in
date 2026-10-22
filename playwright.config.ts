import { defineConfig, devices } from '@playwright/test';

const PORT = 4323;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure' },
	// Serves the built site with the real _headers (CSP) applied. Run `npm run build` first.
	webServer: {
		command: 'node scripts/serve-dist.mjs',
		url: `http://127.0.0.1:${PORT}/`,
		env: { PORT: String(PORT) },
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['Pixel 7'] } },
	],
});
