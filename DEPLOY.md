# Deploying devbook.raturi.in

The site is static (`dist/`) and hosted on **Cloudflare Pages** (ADR-0002).

## Cloudflare Pages (current)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → choose `nitinraturi/devbook.raturi.in`.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build` (not `astro build`; the npm script also writes the CSP hashes)
   - Build output directory: `dist`
   - Production branch: `main`
   - Node version comes from `.nvmrc` (24).
3. Environment variables, **Production only**:
   - `PUBLIC_GA_ID` = your GA4 measurement ID (`G-…`). Optional. Leave it unset for no analytics. Never set it on Preview.
4. Save and deploy. Every pull request and branch gets a preview URL. Previews are `noindex` and never load analytics.
5. **Custom domain:** project → **Custom domains** → **Set up a custom domain** → `devbook.raturi.in`. The raturi.in zone is already on Cloudflare, so Cloudflare creates the DNS record.
6. After the first deploy, check:
   - `curl -sI https://devbook.raturi.in/ | grep -i content-security-policy` shows the hashed policy.
   - `/sitemap-index.xml`, `/robots.txt`, `/llms.txt` and a missing URL (custom 404) all respond as expected.
   - "Last updated" dates differ between pages. If every page shows the same date, the build clone is shallow; see `docs/TODO.md`.
7. **Search Console:** the raturi.in Domain property (DNS TXT) already covers the subdomain. Submit `https://devbook.raturi.in/sitemap-index.xml`, and do the same in Bing Webmaster Tools.

## Alternative: Workers static assets

This is the Cloudflare-recommended default for new projects, and what raturi.in and webtools.raturi.in use. Add `wrangler.jsonc`:

```jsonc
{
  "name": "devbook-raturi-in",
  "compatibility_date": "<deploy day, YYYY-MM-DD>",
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

Deploy with `npm run build && npx wrangler deploy`. `_headers` works the same way. Move the custom domain from the Pages project to the Worker, and record the change in a new ADR.

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
