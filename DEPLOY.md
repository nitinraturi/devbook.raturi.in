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

The Worker serves only `https://devbook.raturi.in`, configured in `wrangler.jsonc` under `routes`. The raturi.in zone is on Cloudflare, so `npm run deploy` creates the DNS record. `"workers_dev": false` turns off the `*.workers.dev` URL, so search engines never see a second copy of the site.

## After deploying

- `curl -sI https://devbook.raturi.in/ | grep -i content-security-policy` shows the hashed policy.
- `/sitemap.xml`, `/sitemap-index.xml`, `/robots.txt`, `/llms.txt` and a missing URL (custom 404) all respond as expected.
- Search Console: the raturi.in Domain property (DNS TXT) already covers the subdomain. Submit `https://devbook.raturi.in/sitemap.xml`, and do the same in Bing Webmaster Tools.

## Optional: deploy on push (Workers Builds)

In the Worker's settings → Builds, connect `nitinraturi/devbook.raturi.in`, with production branch `main` and deploy command `npx wrangler deploy`. Use `npx wrangler preview` for non-production branches; they build as previews (`noindex`, no analytics) because `WORKERS_CI_BRANCH` is not `main`.

The empty `previews` block in `wrangler.jsonc` enables [Workers Previews](https://developers.cloudflare.com/workers/previews/configuration/#wrangler-configuration-file). Static assets and compatibility settings stay at the top level; production routes do not target Previews. Preview URLs are public unless access controls are configured.

## Releases

Projects pin a dated tag, `vYYYY.MM.DD` (UTC date), with `.1`, `.2` and so on for later releases the same day. The setup prompt and setup page find the newest tag with `git ls-remote --sort=-version:refname`, so a pushed tag reaches new projects at once and existing ones when they upgrade. Some projects follow `main` instead, so merge only reviewed changes, and merge before deploying the site when the setup commands change.

To release:

1. On an up-to-date `main`, run `npm run check`.
2. List what changed since the last release: `git log --oneline $(git describe --tags --abbrev=0)..main -- instructions stacks skills templates`. Make sure `CHANGELOG.md` has a dated entry for each change, with an **Upgrade** note where projects must change something, and commit any fix to `main`.
3. Tag and push: `git tag -a v2026.11.02 -m "Devbook v2026.11.02" && git push origin v2026.11.02`. Never move or delete a pushed tag; release a `.1` instead.
4. Deploy the site if it changed (`npm run deploy`).

The setup commands need at least one tag. Until the first one is pushed, `git ls-remote` prints nothing and the setup prompt falls back to `main`.

## Local checks

```bash
npm ci
npm run check        # format, lint, typecheck, descriptions, size budgets, contrast, build, Playwright + axe
npm run lhci         # Lighthouse budgets (needs Chrome; set CHROME_PATH if not found)
npm run preview      # serve dist/ with the real _headers on http://127.0.0.1:4324
```
