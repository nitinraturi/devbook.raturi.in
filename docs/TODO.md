# Owner TODOs and known gaps

## Owner
- [ ] **Custom domain:** attach `devbook.raturi.in` to the `devbook-raturi-in` Worker (`DEPLOY.md` → Custom domain).
- [ ] **GA4:** the site uses the raturi.in property (`G-4343Y0SFZ5`). Confirm its data retention is **14 months**, the period `/privacy/` states (Admin → Data collection and modification → Data retention). Optionally add a hostname filter or comparison for `devbook.raturi.in` in reports.
- [ ] **Person `sameAs`:** add profile URLs (GitHub, LinkedIn, …) in `src/lib/site.ts` → `PERSON.sameAs`.
- [ ] **OG image:** review `public/og-default.png` (regenerate with `npm run og:image` after editing `scripts/generate-og.mjs`).
- [ ] **Privacy notice:** review `/privacy/` (`src/content/docs/privacy.md`) against your own legal advice, including India's DPDP.
- [ ] **HSTS preload:** add `preload` to `Strict-Transport-Security` in `public/_headers` only once every raturi.in subdomain serves HTTPS.
- [ ] **Search Console / Bing:** submit the sitemap.
- [ ] **Structured data:** validate a home page and a doc page in Google's Rich Results Test and the Schema.org validator after the first deploy.

## Verify
- [ ] If Workers Builds is enabled, check that "Last updated" dates differ per page. If they don't, the build clone is shallow.
- [ ] Trailing-slash redirects are 307 (Workers `auto-trailing-slash`). Add explicit 301s only if Search Console reports issues.

## Known gaps / upstream
- **`npm audit`:** `braces` (via `micromatch` ← `starlight-llms-txt`) has a high advisory with no fixed release. It is build-time only, on patterns we control. `@lhci/cli` has dev-only advisories. CI audits production deps at `critical`; restore `high` when fixed.
- **Starlight search button:** its accessible name "Search" does not include the visible ⌘K hint (axe `label-content-name-mismatch`). That element is excluded in the smoke tests. Check whether a newer Starlight release fixes it.
- **Visual regression screenshots** (`stacks/testing-tooling.md`: about 400 px and 1280 px, light and dark) are not set up yet. Add them in a dedicated PR with committed baselines.
- **Unit tests:** there is no unit-testable logic beyond scripts, so Vitest is not added. Add it when a `src/lib` module grows logic worth testing.
