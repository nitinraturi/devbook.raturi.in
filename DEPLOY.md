# Deploying devbook.raturi.in

The site is static (`dist/`) and hosted on **Cloudflare Workers with static assets** (ADR-0002). Worker: `devbook-raturi-in`.

## Deploy

```bash
npm run deploy        # = wrangler deploy; wrangler runs `npm run build:prod` first
```

- `build:prod` sets `DEVBOOK_ENV=production`, which turns on GA4 (`G-4343Y0SFZ5`, shared with raturi.in). A plain `npm run build` has no analytics.
- Never deploy with plain `astro build`: `npm run build` also applies the HTML fixes and writes the CSP hashes into `dist/_headers`.
- First login: `npx wrangler login`.

## Custom domain

The Worker is live at `https://devbook-raturi-in.raturi002.workers.dev`. To serve `devbook.raturi.in`:

1. If `devbook.raturi.in` is attached to a Pages project, remove it there first.
2. In `wrangler.jsonc`, uncomment `"routes": [{ "pattern": "devbook.raturi.in", "custom_domain": true }]`, and set `"workers_dev": false` if the workers.dev URL should stop serving.
3. Run `npm run deploy`. The raturi.in zone is on Cloudflare, so the DNS record is created automatically.

## After deploying

- `curl -sI https://devbook.raturi.in/ | grep -i content-security-policy` shows the hashed policy.
- `/sitemap-index.xml`, `/robots.txt`, `/llms.txt` and a missing URL (custom 404) all respond as expected.
- Search Console: the raturi.in Domain property (DNS TXT) already covers the subdomain. Submit `https://devbook.raturi.in/sitemap-index.xml`, and do the same in Bing Webmaster Tools.

## Optional: deploy on push (Workers Builds)

In the Worker's settings → Builds, connect `nitinraturi/devbook.raturi.in`, with production branch `main` and deploy command `npx wrangler deploy`. Non-production branches upload preview versions; they build as previews (`noindex`, no analytics) because `WORKERS_CI_BRANCH` is not `main`.

## Releases

The devbook is a versioned standard (README → Versioning).

1. Add a `CHANGELOG.md` entry and bump `version` in `package.json`.
2. Merge to `main` with CI green.
3. Tag the release: `git tag v1.0.0 && git push --tags`.

Projects pin a tag and upgrade by deliberate PR.

## Local checks

```bash
npm ci
npm run check        # typecheck, descriptions, contrast, build, Playwright + axe
npm run lhci         # Lighthouse budgets (needs Chrome; set CHROME_PATH if not found)
npm run preview      # serve dist/ with the real _headers on http://127.0.0.1:4324
```
