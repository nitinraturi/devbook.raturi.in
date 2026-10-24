# Changelog

Notable changes to Devbook, newest first. Devbook is not versioned: projects track `main` through the `.devbook` submodule, so check this file after `git submodule update --remote .devbook`.

## 2026-10-24: Guides for every reader, and instructions rewritten for adherence

### Added
- **How Devbook works**: terms (context window, token, `@` import, submodule), what gets added to a project, how Claude, Copilot and other assistants load the files, which rule wins, when to load each file, size and token cost per project type, and what Devbook can't do.
- **Use Devbook day to day**: what to expect from the assistant, how to ask for work, adding your own rules and overrides, adding or removing files, feature docs, checking it works, updates, troubleshooting and common questions.
- **Writing instructions**: the research-backed guide to writing agent files, prompts and system prompts that models follow. Devbook's own files follow it.

### Changed
- Every instruction and stack note was rewritten to follow the writing guide:
  - each rule is concrete, and non-obvious rules carry a short reason
  - every "never" comes with what to do instead
  - each rule lives in one file; repeated validation, pagination, indexing, rate-limit, caching, deploy, migration and env-var rules were merged
  - every instruction names its sources and says when to load it
  
  Core no longer names specific frameworks. The rules themselves are unchanged unless listed here.
- Performance links to the REST API and database instructions for pagination and indexes. Request-size caps moved to security, and animation rules stay in design.
- The setup page links to the new guides instead of repeating the loading details and cost table.

## 2026-10-24: REST API instruction

### Changed
- `instructions/api-data.md` was rewritten as **REST APIs**. It is based on RFC 9110, RFC 9457, RFC 3339, RFC 9745 and RFC 8594, OpenAPI, Google AIP, the Microsoft Azure and Zalando guidelines, Stripe's API, the OWASP API Security Top 10 (2023) and Standard Webhooks. It now covers:
  - design first, resource modelling and custom actions
  - URL rules, method semantics and status codes
  - long-running operations and bulk endpoints
  - payload formats, nulls, extensible enums and mass-assignment protection
  - problem-details errors with stable codes
  - cursor pagination, filtering and sorting
  - `Idempotency-Key`, ETag and `If-Match`, and caching
  - breaking-change rules, versioning schemes, and `Deprecation` and `Sunset` headers
  - object-, property- and function-level authorisation, consumption limits and SSRF
  - signed, deduplicated webhooks
  
  Where the big guidelines differ (field casing, versioning scheme, custom-action style), it asks you to pick one option and record it. The URL is unchanged.

## 2026-10-24: Feature docs instruction

### Added
- `instructions/feature-docs.md`: one short `FEATURE.md` per complex feature with its purpose, a map of files, data and tests, rules with stable IDs in EARS form, flow and states, decisions, and what is out of scope. Agents read it before the code and update it in the same change. It is created only when a feature has rules, states, permissions, money, personal data, integrations or code across several modules. Based on Anthropic's context-engineering guidance, GitHub Spec Kit, Kiro specs and EARS.
- `templates/FEATURE.md`: the starting template. It is read only when a feature doc is created.
- The `AGENTS.md` template has a **Features** line that indexes feature docs.

### Upgrade
- Copy method: rerun the download command to get `templates/FEATURE.md`. Then add `@.devbook/instructions/feature-docs.md` and a `Features` line to your `AGENTS.md` if your features have business rules.

## 2026-10-24: Database instruction

### Added
- `instructions/database.md`: designing tables and models. It covers modelling before tables, normalisation, naming, primary keys and UUIDv7, column types (time zones, money, text, enums, JSON), constraints and nulls, foreign keys and delete rules, polymorphic references, indexes, history and soft delete, concurrency, multi-tenancy, privacy, safe migrations and backups. Sources: PostgreSQL docs and wiki, *Use The Index, Luke*, *SQL Antipatterns*, *Designing Data-Intensive Applications*, RFC 9562 and OWASP.

### Changed
- `instructions/api-data.md` now covers APIs only. Its data modelling, migration and backup rules moved to `database.md`. The URL is unchanged.

### Upgrade
- If your project has a relational database, add `@.devbook/instructions/database.md` to your `AGENTS.md` next to `api-data.md`. Otherwise it loses the migration and backup rules.

## 2026-10-24: Licensing instruction

### Added
- `instructions/licensing.md`: choosing and changing the project licence (a human decides), SPDX identifiers and expressions, mixed-licence repositories, dependency and asset licence allowlists, copyleft triggers, CI licence scanning, notices and attribution, trademarks, and copied or generated code.

### Upgrade
- Add `@.devbook/instructions/licensing.md` to your `AGENTS.md` if the project is published or distributed, or ships third-party code, fonts, images or data.

## 2026-10-24: CC BY 4.0 for the guide text

### Changed
- `instructions/` and `stacks/` are now licensed under CC BY 4.0. You can reuse and change them with credit. Keeping `.devbook/` with its `LICENSE-CC-BY-4.0` file counts as credit. `templates/` and the site code stay MIT-0.

### Upgrade
- Copy method: rerun the download command from the setup page. It now also fetches `LICENSE-CC-BY-4.0`. Submodules get the file automatically.

## 2026-10-24: Distinctive design

### Added
- Design: a **Direction** section. Before the first screen, the agent writes a design direction (audience, tone, an outside reference, type pairing, palette, one signature element) and gets approval. It also lists the generic template patterns to avoid.
- Design: a **Craft** section based on Dieter Rams, the Swiss grid tradition, Edward Tufte and *Refactoring UI*. It covers grid rhythm, density, borders, optical alignment, radius and elevation scales, icons and imagery, typographic detail, and squint, greyscale and removal tests.

### Changed
- Design: tinted neutrals, a sparing accent, dark mode tuned on its own, display type that may jump the scale, and at most one expressive motion moment per page.
- Design: merged or dropped rules that models already follow. The axe check now lives only in `testing.md`.

## 2026-10-23: Structure, naming, SEO and design refresh

### Added
- Core: **Project structure** (framework layout first, feature folders, no catch-all utils, shallow nesting) and **Naming** (per-language conventions, domain words, booleans, units, branches).
- Security: NIST SP 800-63B password rules, passkeys, `__Host-` cookies, and an OWASP Top 10 baseline.
- Performance: lazy iframes, back/forward cache eligibility, Brotli and HTTP/2 or HTTP/3.
- Mobile: store target-SDK requirements, and edge-to-edge layouts with safe areas.

### Changed
- SEO rewritten against Google Search Central. It now covers crawlable links, `robots.txt` versus `noindex`, mobile-first parity, pagination canonicals, `hreflang`, snippet controls, site names and favicons, image and video SEO, the current Search Gallery features (no FAQ or HowTo rich results for most sites), spam policies and launch checks.
- Design rewritten around WCAG 2.2, the Apple HIG, Material 3 and Nielsen's heuristics. It now covers hierarchy, spacing scale, container queries, modern type (`clamp`, `text-wrap`), OKLCH semantic colour, dark mode, component states, forms (`autocomplete`, validation timing), motion and the new WCAG 2.2 criteria.
- Content aligned with Google's helpful-content guidance: Who/How/Why, E-E-A-T, YMYL reviewers, disclosures, and no fake freshness.

## 2026-10-23: Mandatory core and new instructions

### Added
- `instructions/testing.md` (mandatory): what to test, test levels, deterministic tests, test data and CI gates.
- `instructions/performance.md`: budgets, Core Web Vitals, front-end loading, back-end efficiency, caching and reliability.
- `instructions/api-data.md`: API contracts, errors, pagination, idempotency, webhooks, data modelling, migrations, backups and retention.
- A documentation and decisions section in core (README, ADRs, API docs), and security-event logging in security.
- A license page on the site.

### Changed
- `workflow.md` and `engineering.md` are merged into `instructions/core.md`. Old URLs redirect to it with a 301.
- Core, security and testing are mandatory for every project. The other files are loaded when they apply.
- Core Web Vitals moved from `seo.md` to `performance.md`.

### Upgrade
- In your `AGENTS.md`, replace the `workflow.md` and `engineering.md` lines with `core.md` and `testing.md`. Add `performance.md` and `api-data.md` where they apply, or re-run the setup prompt.

### Removed
- The changelog link on the site. This file stays in the repository.

## 2026-10-23: License and setup page

### Added
- The MIT No Attribution (MIT-0) license. You can copy the instructions into any project without keeping a notice.

### Changed
- The setup page starts with a clear choice between Submodule and Copy, shown as styled tabs.

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
