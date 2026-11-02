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

Devbook ships from `main`; there are no release tags. The `VERSION` file at the root holds the version number: the UTC date, `YYYY.MM.DD`, with `.1`, `.2` and so on for later commits the same day. New projects get the latest `main`. Existing ones compare `.devbook/VERSION` with `VERSION` on `main` at the start of each session (the `AGENTS.md` template, the `devbook-upgrade` skill and the kit's version hook) and update when the user agrees. So merge only reviewed changes, and merge before deploying the site when the setup commands change.

`VERSION` is raised automatically. On every push to `main`, `.github/workflows/version.yml` runs `scripts/bump-version.mjs` and pushes a `chore: version …` commit. The `main` ruleset blocks direct pushes, and personal repositories can't add GitHub Actions to its bypass list, so the workflow pushes with `VERSION_PUSH_TOKEN`: a fine-grained personal access token from the repository admin, who is a bypass actor. Create it at GitHub → Settings → Developer settings → Fine-grained tokens, for this repository only, with **Contents: Read and write** and an expiry, then save it with `gh secret set VERSION_PUSH_TOKEN`. Renew it before it expires; when it's missing or expired, the Version run fails and says so. The workflow skips its own `chore: version …` commits, so a bump doesn't trigger another. Don't edit `VERSION` by hand.

For a change to `instructions/`, `stacks/`, `skills/`, `templates/`, `kit/` or `LICENSE-CC-BY-4.0`:

1. In the same PR, add a dated `CHANGELOG.md` entry, with an **Upgrade** note where projects must change something.
2. Merge the PR. CI raises `VERSION`, and projects see the new version in their next session.
3. Deploy the site if it changed (`npm run deploy`).

The old `v2026.11.02` tag stays so projects pinned to it keep working; don't add new tags.

## Local checks

```bash
npm ci
npm run check        # format, lint, typecheck, descriptions, size budgets, contrast, build, Playwright + axe
npm run lhci         # Lighthouse budgets (needs Chrome; set CHROME_PATH if not found)
npm run preview      # serve dist/ with the real _headers on http://127.0.0.1:4324
```
