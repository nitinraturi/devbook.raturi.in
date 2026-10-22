---
title: Cloudflare hosting
description: Hosting sites on Cloudflare - Workers static assets versus Pages, wrangler config, headers and CSP, redirects, caching, environments and subdomains.
lastVerified: 2026-10-22
sidebar:
  order: 5
---

## Workers or Pages?

At the verification date, Cloudflare and the Astro docs **recommend Workers (with static assets) for new projects**. Pages remains supported and is still a simple git-push option for purely static sites.

| Situation | Choose |
|---|---|
| New project, static now, may need server routes later | **Workers static assets** |
| Pure static site, want dashboard git integration with zero config | Pages is fine |
| Existing Pages project working well | Stay; migrate only when you need a Workers-only feature |

Record the choice in an ADR. Check Cloudflare's current [static assets docs](https://developers.cloudflare.com/workers/static-assets/) and the Pages-to-Workers migration guide before starting.

## Rules

### Workers static assets (static site)
```jsonc
// wrangler.jsonc
{
  "name": "<project>",
  "compatibility_date": "YYYY-MM-DD",          // the day you first deploy
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```
- Deploy from CI: `npm run build && npx wrangler deploy`.
- Server routes (if any) come through the framework's Cloudflare adapter; keep them in an opt-in module.

### Pages (alternative)
- Build command `npm run build`, output directory `dist`, Node version set to current LTS.
- Production branch `main`; every PR gets a preview URL.

### Headers (`public/_headers`)
Confirm `_headers` / `_redirects` support for your chosen product in current docs.
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' <hashes>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```
- Add third-party hosts (for example analytics) to `script-src`/`connect-src`/`img-src` only when used.
- Hash inline scripts instead of allowing `'unsafe-inline'` for scripts.
- Long immutable caching **only** for content-hashed files. HTML stays revalidated.
- Add the `preload` HSTS directive only once every subdomain of the zone serves HTTPS.

### Redirects (`public/_redirects`)
- One canonical host (no `www` duplicate) and one trailing-slash style, with 301s.
- Old URLs redirect permanently when content moves.

### Environments
- Production variables (for example `PUBLIC_GA_ID`) set only on production; previews stay untracked and `noindex`.
- Secrets in Cloudflare's secret store, never in `wrangler.jsonc` or the repo.

### Domains
- Subdomains of a zone already on Cloudflare: add the custom domain to the Worker or Pages project; Cloudflare creates the DNS record.
- Search Console: a Domain property verified by DNS TXT covers all subdomains.

### Extras
- Crawler Hints (IndexNow) can speed up discovery on supporting search engines.
- Cloudflare Web Analytics is a cookieless option if you do not need GA4.

## Checklist
- [ ] Workers vs Pages decided in an ADR
- [ ] Deploy from CI only
- [ ] `_headers` with CSP and security headers; immutable cache on hashed assets only
- [ ] Canonical host and slash redirects
- [ ] Production-only analytics; previews noindex
