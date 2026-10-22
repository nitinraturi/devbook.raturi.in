# Changelog

All notable changes to the devbook. Versions follow semantic versioning (see README).

## [1.0.0] — 2026-10-22

### Added
- Universal guides: workflow, engineering, security, quality, web/SEO/content, LLM features, platforms.
- Stack profiles: Astro, Starlight, TypeScript, CSS tokens, Cloudflare hosting, GA4 + consent, test tooling, three.js, Django.
- Templates: AGENTS.md, CLAUDE.md, Copilot instructions, project README, master build prompt, project brief, technical spec, ADR, research doc, sources registry, page build procedure.
- Prompt library and checklists.
- `BUILD-PROMPT.md` to scaffold the Starlight site.

- Site: Astro 7.4.2 + Starlight 0.42.6 at `https://devbook.raturi.in`, hosted on Cloudflare Pages. It has sidebar groups, search, dark mode, a last-verified notice (with a caution after 180 days), JSON-LD (`WebSite`, `Person`, `TechArticle`, `BreadcrumbList`), an OG image, `llms.txt` files, per-page Markdown, a custom 404, a privacy notice and optional GA4 with Consent Mode v2.
- Quality gates in CI: `astro check`, description check, contrast check, link validation, Playwright smoke tests with axe, Lighthouse CI budgets.
- Security headers with a hashed-script CSP (`public/_headers`).
- ADRs 0001–0005 in `docs/adr/`, `DEPLOY.md`, owner TODOs in `docs/TODO.md`.

### Notes
- Extracted from the fitness.raturi.in docs; project-specific material stays in that repo.
