# Owner TODOs and known gaps

## Bootstrap prompt launch (owner)
Until the steps below are done, the Release workflow and the Claude reviews are skipped, not failed, and Drift only reports.
- [ ] **Release App:** create the GitHub App with Contents and Pull requests write, set the `RELEASE_APP_CLIENT_ID` variable and `RELEASE_APP_PRIVATE_KEY` secret, and make the App a bypass actor on the `main` ruleset (`DEPLOY.md`, Releases). Releases and drift pull requests then run on their own.
- [ ] **Old token:** delete the `VERSION_PUSH_TOKEN` secret and revoke the token.
- [ ] **Claude reviews:** run `claude setup-token`, save the token as the `CLAUDE_CODE_OAUTH_TOKEN` secret (paste it into `gh secret set`, never as an argument), then set the `CLAUDE_REVIEWS` variable to `true`.
- [ ] **Settings:** turn on private vulnerability reporting (Security → Settings) and "Allow auto-merge" (General), and create the `rule-wrong`, `rule-ignored`, `suggest-source`, `make-eval` and `drift` labels.
- [ ] **Deploy the site** (`npm run deploy`) if Workers Builds isn't connected, and check `/catalog/`, `/evals/` and that `/instructions/core/` redirects.
- [ ] **First measured baseline:** approve the spend, then run `node evals/run.mjs --yes` (or set `MEASURED_EVALS` to `true` and dispatch `eval.yml`) and commit `evals/results/<date>.json`. Until then `/evals/` says "No measured results yet". Start with one case (`claude plugin eval evals --case bug-test-first --runs 1 --scaffold …`) to confirm the scaffold scripts and the SessionStart hook load in a real run.
- [ ] **Scan the catalog:** run `uvx mcp-scan@latest --skills` on each pinned non-official source and record the result in its `scan` field (all are `not-run`).

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
