# Changelog

Notable changes to Devbook, newest first. Devbook is not versioned: projects track `main` through the `.devbook` submodule, so check this file after `git submodule update --remote .devbook`.

## 2026-10-23: Copy method

### Added
- A second way to add Devbook: download plain files into `.devbook/` with one `curl | tar` command, or as a ZIP, and commit them. This needs no submodule and works offline and in cloud agents. Set `Method: copy` in the setup prompt. The setup page shows both methods.

## 2026-10-23: Minimal redesign

### Changed
- Devbook is now seven short instruction files in `instructions/`: workflow, engineering, security, design, seo and content, which are always on, plus an optional mobile file. It also has seven short stack notes in `stacks/`. A typical website loads about 18 KB.
- Projects add Devbook as a submodule at `.devbook/` that tracks `main`. The root `AGENTS.md` lists the files with `@.devbook/...` lines. `CLAUDE.md` imports `@AGENTS.md`, and `.github/copilot-instructions.md` points Copilot to the same list.
- A new setup prompt (`templates/setup-prompt.md`) handles setup for new and existing projects. The site now has a homepage, a setup page and one page per instruction file and stack note.
- There are no versions or tags anymore. This changelog is dated.

### Removed
- The 60+ guide pages, templates, prompt library and checklists. Their essentials are in the instruction files. Old URLs redirect with a 301.
- The rule packs (`rules/`), the sync tool (`bin/devbook-sync.mjs`), `devbook.json` and the drift check workflow.
- LLM-feature guides beyond the short "LLM features" section in `security.md`.

The history below is from the earlier, versioned design.

## 2026-10-23: v1.0.0 (versioned design, superseded)

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
