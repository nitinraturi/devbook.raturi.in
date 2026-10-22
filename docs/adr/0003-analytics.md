# ADR-0003: Analytics with GA4 and Consent Mode v2 (optional)

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
BUILD-PROMPT §7 makes analytics optional: GA4 exactly per `stacks/ga4-consent.md`, or Cloudflare Web Analytics (cookieless) if preferred. The owner's other raturi.in sites use GA4.

## Decision
GA4, off unless configured:
- Measurement ID `G-4343Y0SFZ5`, the same GA4 property and stream as raturi.in. Reports are split by the hostname dimension. A separate stream can be created later; if so, set `PUBLIC_GA_ID` or change `DEFAULT_GA_ID` in `src/lib/site.ts`.
- Loaded only in deploy builds: `npm run build:prod` (`DEVBOOK_ENV=production`, the build command in `wrangler.jsonc`), or a Pages build of `main` if hosting ever moves back. Local, CI and Lighthouse builds contain no GA code. Branch/preview builds (`WORKERS_CI_BRANCH` or `CF_PAGES_BRANCH` other than `main`) are `noindex` and have no GA. `PUBLIC_GA_ID` overrides the default. When GA is absent, the CSP contains no Google hosts (`scripts/postbuild-csp.mjs` adds them only when the GA tag is present).
- Consent Mode v2 defaults from `stacks/ga4-consent.md`: everything denied in the EEA, UK and Switzerland; analytics only (no ads signals) elsewhere. A stored choice (`localStorage` key `dvb-consent`) is applied before `config`.
- The banner appears when the browser time zone is `Europe/*` and no choice is stored. "Accept analytics" and "Decline" are equally prominent. A footer "Cookie settings" button reopens it.
- Events: `search` (Pagefind query, debounced, ≥ 3 characters, truncated to 100), `copy_code` (Expressive Code copy button), `outbound_click` (domain only). No personal data.
- The privacy notice (`/privacy/`) describes all of this.

## Alternative
Cloudflare Web Analytics needs no banner and no cookies. To switch: remove `DEFAULT_GA_ID`, enable Web Analytics for the site in the Cloudflare dashboard, add its beacon host to the CSP, and update `/privacy/`.

## Consequences
- The owner must set GA4 data retention to 14 months, the period the privacy notice states (`docs/TODO.md`).
- The time-zone check is an approximation; it is documented in the privacy notice.
