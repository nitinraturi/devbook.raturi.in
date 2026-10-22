# Owner TODOs and known gaps

## Owner
- [ ] **Cloudflare Pages project:** create it and add the custom domain (`DEPLOY.md`).
- [ ] **GA4 (optional):** set `PUBLIC_GA_ID` on Production only. In GA4, set data retention to **14 months**, the period `/privacy/` states. Or choose Cloudflare Web Analytics instead (ADR-0003) and update `/privacy/`.
- [ ] **Person `sameAs`:** add profile URLs (GitHub, LinkedIn, …) in `src/lib/site.ts` → `PERSON.sameAs`.
- [ ] **OG image:** review `public/og-default.png` (regenerate with `npm run og:image` after editing `scripts/generate-og.mjs`).
- [ ] **Privacy notice:** review `/privacy/` (`src/content/docs/privacy.md`) against your own legal advice, including India's DPDP.
- [ ] **HSTS preload:** add `preload` to `Strict-Transport-Security` in `public/_headers` only once every raturi.in subdomain serves HTTPS.
- [ ] **Search Console / Bing:** submit the sitemap.
- [ ] **Structured data:** validate a home page and a doc page in Google's Rich Results Test and the Schema.org validator after the first deploy.

## Verify after the first deploy
- [ ] "Last updated" dates differ per page on Pages. If they don't, the build clone is shallow. Options: accept it, or deploy from GitHub Actions (`fetch-depth: 0`) with `wrangler pages deploy dist`.

## Known gaps / upstream
- **`npm audit`:** `braces` (via `micromatch` ← `starlight-llms-txt`) has a high advisory with no fixed release. It is build-time only, on patterns we control. `@lhci/cli` has dev-only advisories. CI audits production deps at `critical`; restore `high` when fixed.
- **Starlight search button:** its accessible name "Search" does not include the visible ⌘K hint (axe `label-content-name-mismatch`). That element is excluded in the smoke tests. Check whether a newer Starlight release fixes it.
- **Visual regression screenshots** (`stacks/testing-tooling.md`: about 400 px and 1280 px, light and dark) are not set up yet. Add them in a dedicated PR with committed baselines.
- **Unit tests:** there is no unit-testable logic beyond scripts, so Vitest is not added. Add it when a `src/lib` module grows logic worth testing.
