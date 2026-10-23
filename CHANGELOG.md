# Changelog

All notable changes to the devbook. `CHANGELOG.md` is the canonical release history; the site links here instead of keeping a duplicate. Versions follow semantic versioning (see README).

## [Unreleased]

No unreleased changes.

## [1.0.0] — 2026-10-23

### Added
- Mandatory baseline rule packs in `rules/` (`core` always, plus `web`, `mobile` and `llm-features`). They are distilled from the design principles, coding standards, security, testing, definition-of-done, accessibility, performance, mobile and LLM guides.
- `bin/devbook-sync.mjs` installs the packs into `.claude/rules/` and `.github/instructions/` so Claude and Copilot load them every session, records profiles in `devbook.json`, and fails CI with `--check` on missing, edited or stale rules. Includes the `templates/devbook-check.yml` workflow and a new "Mandatory baseline rules" page.
- An agent-first onboarding prompt shared by the homepage and adoption guide. Claude or Copilot can pin Devbook, merge agent entry files and draft missing project context from codebase evidence while preserving existing docs and hosting. `CLAUDE.md` imports `@AGENTS.md`.
- Homepage with a copyable onboarding prompt, version-history link and module links.
- Universal guides: workflow, engineering, security, quality, web/SEO/content, LLM features, platforms.
- Stack profiles: Astro, Starlight, TypeScript, CSS tokens, Cloudflare hosting, GA4 + consent, test tooling, three.js, Django.
- Templates: AGENTS.md, CLAUDE.md, Copilot instructions, project README, master build prompt, project brief, technical spec, ADR, research doc, sources registry, page build procedure.
- Prompt library and checklists.
- `BUILD-PROMPT.md` to scaffold the Starlight site.

- Site: Astro 7.4.2 + Starlight 0.42.6 at `https://devbook.raturi.in`, hosted on Cloudflare Workers static assets. It has sidebar groups, search, dark mode, a last-verified notice (with a caution after 180 days), JSON-LD (`WebSite`, `Person`, `TechArticle`, `BreadcrumbList`), an OG image, `llms.txt` files, per-page Markdown, a custom 404, a privacy notice and optional GA4 with Consent Mode v2.
- Quality gates in CI: `astro check`, description check, contrast check, link validation, Playwright smoke tests with axe, Lighthouse CI budgets.
- Security headers with a hashed-script CSP (`public/_headers`).
- ADRs 0001–0005 in `docs/adr/`, `DEPLOY.md`, owner TODOs in `docs/TODO.md`.

### Notes
- Extracted from the fitness.raturi.in docs; project-specific material stays in that repo.
