# Owner TODOs and known gaps

## v1 launch (owner)
Done on 2026-11-02: `main` pushed, `stable` created at the first v1 release with a GitHub Release, issue labels created, auto-merge and private vulnerability reporting turned on. Until the steps below are done, the Release and Sources workflows and the Claude reviews are skipped, not failed.
- [ ] **Release App:** create the GitHub App, set the `RELEASE_APP_CLIENT_ID` variable and `RELEASE_APP_PRIVATE_KEY` secret, and make the App the bypass actor on the `main` ruleset and a new `stable` ruleset (`DEPLOY.md`, Releases). Releases after the first one then run on their own.
- [ ] **Old token:** delete the `VERSION_PUSH_TOKEN` secret and revoke the token.
- [ ] **Claude reviews:** run `claude setup-token`, save the token as the `CLAUDE_CODE_OAUTH_TOKEN` secret (paste it into `gh secret set`, never as an argument), then set the `CLAUDE_REVIEWS` variable to `true`. Leave `MEASURED_EVALS` unset to keep evals modelled.
- [ ] **Deploy the site** (`npm run deploy`) if Workers Builds isn't connected, and check `/evals/` and `/stacks/swift/`.
- [ ] **Measured baseline (optional):** `node evals/run.mjs --task django-search --variant main --repeat 3 --yes` to see real usage per run before a full baseline.

## Owner
- [ ] **GA4:** the site uses the raturi.in property (`G-4343Y0SFZ5`). Confirm its data retention is **14 months**, the period `/privacy/` states (Admin → Data collection and modification → Data retention). Optionally add a hostname filter or comparison for `devbook.raturi.in` in reports.
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
- **Visual regression screenshots** (about 400 px and 1280 px, light and dark) are not set up yet. Add them in a dedicated PR with committed baselines.
- **Unit tests:** there is no unit-testable logic beyond scripts, so Vitest is not added. Add it when a `src/lib` module grows logic worth testing.
