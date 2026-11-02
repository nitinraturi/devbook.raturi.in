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

`main` is development; `stable` is what projects install and upgrade to. Only `.github/workflows/release.yml` moves `stable`.

**What releases.** A push to `main` that changes a shipped path (`instructions/`, `stacks/`, `skills/`, `templates/`, `kit/`, `LICENSE-CC-BY-4.0`, `CHANGELOG.md`, `devbook.manifest.json`), or a manual run of the Release workflow. Site, eval and CI changes don't release, so projects aren't told to upgrade when nothing they load changed.

**The gates**, in order: `npm run check`; then `scripts/release-gate.mjs`, which needs shipped changes since `stable`, a `CHANGELOG.md` entry that `stable` doesn't have, and a modelled eval (`evals/model.mjs`, free and deterministic) with no task whose pass rate fell against `stable`. The tolerance is 0, because modelled runs don't vary; widen it in the script only with evidence once measured runs join the gate.

**Then** the workflow raises `VERSION` (`scripts/bump-version.mjs`: the UTC date `YYYY.MM.DD`, then `.1`, `.2` the same day), commits `chore(release): <version>` to `main`, fast-forwards `stable` to that commit, tags it `v<version>` for people who pin, and publishes a GitHub Release whose notes are the new changelog entries. Don't edit `VERSION` by hand.

**One-time setup** (the owner):

1. Create a GitHub App (Settings → Developer settings → GitHub Apps) with no webhook and one repository permission, **Contents: Read and write**. Install it on this repository only.
2. Save its client ID as the `RELEASE_APP_CLIENT_ID` Actions variable and a private key as the `RELEASE_APP_PRIVATE_KEY` secret (`gh variable set` / `gh secret set`, pasting into the prompt, never as a command argument).
3. In Settings → Rules, add the App as the only bypass actor on the `main` ruleset, and add a `stable` ruleset (block force pushes and deletion, restrict updates) with the same single bypass actor. Confirm the App can be added; if the repository's plan doesn't allow it, stop and choose another route rather than reusing a personal token.
4. Run the Release workflow once by hand (Actions → Release → Run workflow). It creates `stable` and the first GitHub Release. Do this before deploying the site, because the setup commands now point at `stable`.
5. Delete the old `VERSION_PUSH_TOKEN` secret and revoke that token.

Until step 2 is done, the Release and Sources workflows are skipped, not failed. The scheduled Claude reviews and triage also stay off until you save `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`) as a secret and set the `CLAUDE_REVIEWS` variable to `true`. The monthly modelled eval and the digest need neither.

For a change to shipped files:

1. In the same PR, add a dated `CHANGELOG.md` entry, with an **Upgrade** note where projects must change something, and commit the modelled results (`npm run evals:model -- --variant main,local`).
2. Merge the PR. The Release workflow promotes it to `stable` if the gates pass, and projects see the new version when they next check.
3. Deploy the site if it changed (`npm run deploy`).

The old `v2026.11.02` tag stays so projects pinned to it keep working.

## Local checks

```bash
npm ci
npm run check        # format, lint, typecheck, descriptions, size budgets, contrast, build, Playwright + axe
npm run lhci         # Lighthouse budgets (needs Chrome; set CHROME_PATH if not found)
npm run preview      # serve dist/ with the real _headers on http://127.0.0.1:4324
```
