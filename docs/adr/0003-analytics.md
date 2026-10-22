# ADR-0003: Analytics with GA4 and Consent Mode v2 (optional)

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
BUILD-PROMPT §7 makes analytics optional: GA4 exactly per `stacks/ga4-consent.md`, or Cloudflare Web Analytics (cookieless) if preferred. The owner's other raturi.in sites use GA4.

## Decision
GA4, off unless configured:
- Loaded only when `import.meta.env.PROD`, `PUBLIC_GA_ID` is set, and the build is not a Pages preview. Without an ID, the build contains no GA code and the CSP contains no Google hosts (`scripts/postbuild-csp.mjs` adds them only when the GA tag is present).
- Consent Mode v2 defaults from `stacks/ga4-consent.md`: everything denied in the EEA, UK and Switzerland; analytics only (no ads signals) elsewhere. A stored choice (`localStorage` key `dvb-consent`) is applied before `config`.
- The banner appears when the browser time zone is `Europe/*` and no choice is stored. "Accept analytics" and "Decline" are equally prominent. A footer "Cookie settings" button reopens it.
- Events: `search` (Pagefind query, debounced, ≥ 3 characters, truncated to 100), `copy_code` (Expressive Code copy button), `outbound_click` (domain only). No personal data.
- The privacy notice (`/privacy/`) describes all of this.

## Alternative
Cloudflare Web Analytics needs no banner and no cookies. To switch: leave `PUBLIC_GA_ID` unset, enable Web Analytics on the Pages project, add its beacon host to the CSP, and update `/privacy/`.

## Consequences
- The owner must set GA4 data retention to 14 months, the period the privacy notice states (`docs/TODO.md`).
- The time-zone check is an approximation; it is documented in the privacy notice.
