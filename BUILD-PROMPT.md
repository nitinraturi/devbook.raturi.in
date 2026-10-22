# BUILD-PROMPT — scaffold devbook.raturi.in with Astro Starlight

Paste everything inside the fenced block into Claude Code (or a similar coding agent) at the root of this repository. The guides already exist in `src/content/docs/`; the agent builds the site **around** them and must not rewrite their content.

Facts in this prompt were checked on 2026-10-22, when the latest npm releases were Astro 7.4.1 and Starlight 0.42.6, and all pages in this repo built cleanly (61 pages) with that pair. The agent must re-check anything version- or vendor-specific against official docs before using it.

---

````markdown
# Role
You are a senior front-end engineer and technical SEO specialist. You are building **devbook.raturi.in**, a public guide to LLM-assisted software development, using Astro + Starlight. You write production-quality TypeScript, keep the site fast and accessible, and never invent facts.

# Read first (binding)
1. `README.md` and `AGENTS.md` in this repo.
2. Every page under `src/content/docs/stacks/` that applies: `astro.md`, `starlight.md`, `typescript.md`, `cloudflare.md`, `ga4-consent.md`, `testing-tooling.md`.
3. `src/content/docs/quality/performance-budgets.md`, `quality/accessibility.md`, `security/security-baseline.md`, `web/technical-seo.md`, `web/structured-data.md`.

If this prompt conflicts with those pages, the pages win. If they are silent, pick the simplest option that meets the budgets and record the choice in `docs/adr/`.

# Hard constraints
- **Do not edit the body text of any existing page** in `src/content/docs/` or `templates/`. You may add frontmatter fields the schema needs and fix broken internal links (report each fix).
- Verify current setup steps against the official Starlight and Astro docs before installing. Use the latest stable Astro and Starlight; record exact versions in `docs/adr/0001-stack-versions.md`.
- Ask before adding any dependency not listed here.
- Never fabricate citations, statistics, quotes, testimonials, authors or credentials.

# 1. Project setup
- This repo already has content, so follow Starlight's **manual setup** for an existing project (not the template generator), or generate the template in a temp folder and copy only config files in.
- npm, Node current LTS, lockfile committed. TypeScript `strict` with `noUncheckedIndexedAccess`.
- `astro.config.mjs`:
  - `site: 'https://devbook.raturi.in'`, `trailingSlash: 'always'`, `output: 'static'`.
  - Starlight integration with:
    - `title: 'Devbook'`, `description` (120–160 chars) about LLM-assisted engineering.
    - `logo` (simple wordmark SVG you create), favicon.
    - `social` link to the GitHub repo (placeholder `https://github.com/<owner>/devbook.raturi.in`, listed in deliverables).
    - `editLink.baseUrl` to the repo's `main` branch.
    - `lastUpdated: true` (needs full git history in CI: `fetch-depth: 0`).
    - `sidebar`: one group per top-level folder, in this order: Start here, Workflow, Engineering, Security, Quality, Web & content, LLM features, Platforms, Stack profiles, Templates, Prompts, Checklists. Each group is `{ label: '<Label>', items: [{ autogenerate: { directory: '<folder>' } }] }` (a `label` directly on an `autogenerate` object was removed in Starlight 0.39).
    - `customCss: ['./src/styles/custom.css']`.
    - `head`: Open Graph defaults (`og:site_name`, `og:image` → `/og-default.png` 1200×630 that you generate as a simple branded image), `twitter:card=summary_large_image`.
- Content config (`src/content.config.ts`): Starlight's `docsLoader()` + `docsSchema({ extend: z.object({ lastVerified: z.coerce.date().optional() }) })`. Confirm the current API in the Starlight docs.

# 2. Components and overrides
- **Last-verified notice:** pages with `lastVerified` show "Last verified: <date>" under the title, and a `caution` aside when the date is older than 180 days ("This page covers fast-changing tools. Some details may be out of date."). Implement as a small Starlight component override (e.g. `PageTitle`), reusing the default component inside it.
- **Templates pages:** each page in `src/content/docs/templates/` is `.mdx` and imports its raw file: `import tpl from '../../../../templates/<name>.md?raw'` and renders it with Starlight's `<Code code={tpl} lang="md" title="<name>.md" />` plus a one-line "Copy into your project as …" note. One source of truth: never paste template text into the page.
- **JSON-LD:** override `Head` (keep the default inside) and add one `@graph` per page:
  - `WebSite` (`@id`: `https://devbook.raturi.in/#website`, `publisher` → Person).
  - `Person` with `@id: https://raturi.in/#person`, name "Nitin Raturi", url `https://raturi.in/` (same entity across all raturi.in sites; `sameAs` left as TODO list items for the owner).
  - Doc pages: `TechArticle` with `headline`, `description`, `author` → Person, `dateModified` (git last-updated), `isPartOf` → WebSite, plus `BreadcrumbList` matching the sidebar group.
  - Home: `WebSite` + `Person` only. No FAQPage, HowTo, Review or SearchAction markup (see `web/structured-data.md`).
- **Home page:** `src/content/docs/index.mdx` already exists with `template: splash`. Keep its content; style it with `custom.css`.

# 3. Design
- Use Starlight's theming through CSS custom properties only (accent and gray scales, fonts) in `src/styles/custom.css`. Keep the built-in light/dark switch.
- Accent: one restrained blue that passes WCAG AA in both themes; verify contrast and record the ratios in the ADR.
- Fonts: system stacks by default (fastest). If you add a webfont, self-host one variable `woff2`, subset to Latin, `font-display: swap`.
- No hero illustrations, gradients, glassmorphism or stock images. The content is the product.

# 4. LLM-friendly output
- Add `starlight-llms-txt` (verify current version and options) to generate `/llms.txt`, `/llms-full.txt`, `/llms-small.txt`. Treat llms.txt as an emerging convention, not a ranking factor.
- Add `starlight-links-validator` so broken internal links fail the build.
- Each doc page shows a small "Copy page as Markdown" action only if it can be done without a new dependency; otherwise list it as a follow-up.

# 5. SEO and crawl files
- Starlight generates the sitemap when `site` is set; confirm it appears at `/sitemap-index.xml`. Also serve `/sitemap.xml` as a sitemap index pointing to the generated sitemap.
- `public/robots.txt`: allow all; `Sitemap: https://devbook.raturi.in/sitemap.xml`.
- Every page has a unique title and a description; the build warns if `description` is missing or outside 70–170 characters (write a tiny remark/rehype or content check script; do not edit page text, report offenders).
- Canonical URLs are absolute with trailing slash (Starlight default when `site` is set; confirm).
- Custom `404` with search and links to Start here and Workflow.

# 6. Hosting (Cloudflare)
- Default: **Cloudflare Workers with static assets** (Cloudflare and the Astro docs recommend Workers for new projects as of the verification date). `wrangler.jsonc` with `assets.directory: "./dist"`, `compatibility_date` set to the deploy day, `not_found_handling: "404-page"`. Deploy: `npx astro build && npx wrangler deploy`.
- Alternative (owner's choice): Cloudflare Pages, build `npm run build`, output `dist`. Same `_headers` file.
- `public/_headers` per `stacks/cloudflare.md`: CSP (hash inline scripts; no `'unsafe-inline'` for scripts), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`, long immutable cache for `/_astro/*` and `/pagefind/*` hashed files only. Confirm current header-file support for the chosen product in Cloudflare docs.
- Custom domain `devbook.raturi.in` on the existing raturi.in zone.

# 7. Analytics (optional, production only)
- GA4 exactly per `stacks/ga4-consent.md`: loaded only when `import.meta.env.PROD && PUBLIC_GA_ID`, Consent Mode v2 defaults, IP-safe, no personal data in events. Add GA hosts to the CSP.
- Events: `search` (Pagefind query), `copy_code` (code block copy button), `outbound_click` (domain only).
- If the owner prefers cookieless analytics, Cloudflare Web Analytics is an acceptable alternative; record the decision in an ADR.

# 8. Quality gates (CI must enforce)
GitHub Actions on PR and `main`:
`npm ci` → `astro check` → build (links validator) → description-length check → Playwright smoke (home, one page per sidebar group, search, theme toggle, 404) with axe (zero serious/critical) → Lighthouse CI (mobile) on home + 3 doc pages.

Budgets: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100; LCP ≤ 2.0 s; CLS ≤ 0.05; JS on doc pages limited to what Starlight ships plus ≤ 5 KB of your own.

# 9. Deliverables
1. Working site with every existing page rendering, sidebar in the order above, search, dark mode, llms.txt.
2. `DEPLOY.md`: Cloudflare setup (Workers static assets; Pages alternative), env vars (`PUBLIC_GA_ID` production only), custom domain steps, how to tag a release (`git tag v1.0.0 && git push --tags`).
3. ADRs in `docs/adr/` for: stack versions, hosting choice, analytics choice, accent colour contrast.
4. `CHANGELOG.md` entry.
5. A list of TODOs for the owner (GitHub URL, `sameAs` links, OG image review) and anything you could not complete, with reasons.

# Working style
Small commits, conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`). Run the build after each step. Report each quality-gate result at the end.
````
