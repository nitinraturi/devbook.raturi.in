# Changelog

Notable changes to Devbook, newest first. Devbook ships from `main`, and `VERSION` holds the version number, which goes up with each release. Each entry is in the first version on or after its date. Read the entries newer than your `.devbook/VERSION` before you update. Read the entries newer than your `.devbook/VERSION` before you update.

## 2026-11-03: Shipping is optional, GA4 is the default for websites

### Changed
- **Setup asks first.** `devbook-setup` now asks three questions in one message. How does the project ship today? Should a public website or web app use Google Analytics 4 (default yes)? Which kit parts are wanted (default none)? It never adds, edits or removes existing CI, git hooks, branch protection or deploy config unless asked.
- **`templates/AGENTS.md`** has two new Project lines: `Workflow`, which overrides Devbook's CI, branch and deploy rules, and `Analytics`.
- **Rules that assumed CI or a deploy process are now conditional:** TEST-08 (where the project has CI), CORE-20, SEC-19 and SEC-28 (any CI), PERF-14 (keep the project's own deploy process), PERF-02 and DES-05 (automated checks rather than CI specifically). The rules for how the assistant writes code are unchanged.

**Upgrade:** add `- Workflow (overrides Devbook's CI, branch and deploy rules): <how changes ship>` and `- Analytics: <GA4, another tool, or none>` to the Project section of `AGENTS.md`. For GA4, also add the `.devbook/stacks/ga4-consent.md` read-when line.

## 2026-11-02: Swift stack note for iOS and macOS apps

### Added
- **`stacks/swift.md`** for iOS and macOS apps in Swift: the Swift 6 language mode and module-by-module migration, thin SwiftUI views over testable packages, Swift Testing alongside XCTest UI tests, privacy manifests, Swift Package Manager with a committed `Package.resolved`, signing secrets kept out of the repository, App Sandbox entitlements for the Mac App Store, and Developer ID signing, the Hardened Runtime and notarization outside it. iOS apps also follow the mobile instructions.

**Upgrade:** for a Swift app, add `- \`.devbook/stacks/swift.md\`: work on the iOS or macOS app` to the Devbook section of `AGENTS.md`. With Cursor, rerun `link.mjs --assistants <yours>` to generate its rule.

## 2026-11-02: Devbook v1

Devbook is a set of short rule files that AI coding assistants load from your project: core, security and testing in every chat (9 KB), the rest only when a matching file or task needs them, and skills for multi-step jobs. v1 is the first public release. It brings everything in the entries below: a smaller always-loaded tier, browser and sign-in rules in `security-web.md`, setup and upgrade scripts, adapters for Cursor, Codex and Copilot code review, versions that rise only with real releases, and sources that are checked every week. The [evals page](https://devbook.raturi.in/evals/) shows what was measured.

**Upgrade from any earlier version:**
1. Update `.devbook/`. **Submodule:** `git -C .devbook fetch -q origin main && git -C .devbook checkout -q FETCH_HEAD`. **Copy:** rerun the copy command from the [setup page](https://devbook.raturi.in/start-here/setup/). A submodule that isn't tracking `main` should also run `git config -f .gitmodules submodule..devbook.branch main`.
2. Replace the Devbook section of `AGENTS.md` with the one in `.devbook/templates/AGENTS.md`, keeping the "read when" lines for the files you use. Delete any "At the start of each session" paragraph, and add the `security-web.md` line if the project has pages, an API for browsers or its own sign-in. Add the `Assistants` line to the Project section.
3. Run `node .devbook/skills/devbook-setup/scripts/link.mjs --assistants <yours>`, then `verify.mjs` with the same list until it exits 0.
4. Run `node .devbook/skills/devbook-setup/scripts/gitignore-secrets.mjs`, review the diff, commit and start a new chat.

Or ask your assistant "Is Devbook up to date?", and it walks through these steps.

## 2026-11-02: Sources with URLs, checked every week

### Added
- **`sources.json`** lists every source behind the instructions, stack notes and skills, with its URLs, how often it changes and the rule IDs it supports. Each file's `sources:` frontmatter is now generated from it.
- Every instruction file and stack note has `lastVerified`, and stack notes list their sources.
- Behind the scenes, a weekly watcher flags changed sources and scheduled reviews propose fixes as pull requests for the owner to review. Nothing in projects changes.

### Changed
- Three source titles are shorter (OWASP Secrets Management Cheat Sheet, The Practical Test Pyramid, Software Engineering at Google); the sources are the same.

## 2026-11-02: Versions only for real releases

### Added
- **Release gates.** `VERSION` goes up only when the files projects load change and the gates pass: `npm run check`, a new changelog entry, and no eval regression against the last release. A site, eval or CI change no longer raises it, so projects are told to upgrade only when something they load changed. There are still no tags; `main` and `VERSION` are all you need.
- **`kit/ci/devbook-version.yml`**, a weekly job for any assistant that compares `.devbook/VERSION` with `main` and warns in the job summary. It never fails the build.

**Upgrade:** nothing to change; projects keep following `main`.

## 2026-11-02: Adapters for Cursor, Codex and Copilot code review

### Added
- **`link.mjs --assistants`** writes files for more assistants from the same sources, as `devbook.manifest.json` declares per file:
  - `cursor`: generated `.cursor/rules/devbook-*.mdc` rules. Core, security and testing always apply, path-scoped files attach by glob, and the rest are agent-requested by description. Cursor reads only `.mdc` there and doesn't inline `@` references.
  - `codex`: skill links in `.agents/skills/`, where Codex looks for repository skills.
  - `copilot-review`: Copilot's instruction files as copies, which code review on github.com can read, plus the always-loaded rules as an instruction for every file.
  - The default stays `claude,copilot`. Skills stay in `.claude/skills/`, which Claude Code, VS Code Copilot and Cursor all read.
- `verify.mjs --assistants` fails when a generated file differs from its source; `link.mjs` refreshes them on every run.
- An `Assistants` line in the `AGENTS.md` template's Project section records the list, so upgrades pass it again.

### Changed
- The `AGENTS.md` template asks assistants that don't load `@` lines (Codex, Cursor, Copilot outside the CLI) to read the three mandatory files before their first change.

**Upgrade:** update `.devbook/`, add the `Assistants` line and the new first sentence of the Devbook section from `.devbook/templates/AGENTS.md`, then run `node .devbook/skills/devbook-setup/scripts/link.mjs --assistants <yours>` and `verify.mjs` with the same list. For Cursor, commit the generated `.cursor/rules/devbook-*.mdc` files.

## 2026-11-02: Skills that run scripts

### Added
- **`skills/devbook-setup/scripts/link.mjs`** creates the path-rule and skill links from `devbook.manifest.json` and the files `AGENTS.md` lists. It is idempotent, copies files with a "Generated by Devbook" header where symlinks don't work, refreshes those copies on the next run, never overwrites a file it didn't make, and reports (or with `--prune` removes) links that are no longer chosen.
- **`skills/devbook-setup/scripts/verify.mjs`** checks every `@` and "read when" path in `AGENTS.md`, `CLAUDE.md`'s import, every link and every generated copy, and exits 1 with the list of problems.
- **`skills/devbook-upgrade/scripts/compare.mjs`** prints the current and newest versions and the changelog entries and **Upgrade** notes in between. It reads `VERSION` and `CHANGELOG.md` on `main`.
- **Report templates** (`references/report-template.md`) for the security review, SEO audit and release check, each with one canonical finding.
- `devbook.manifest.json` now ships with Devbook (the copy command fetches it), because `link.mjs` reads it.

### Changed
- `devbook-setup` and `devbook-upgrade` run the scripts instead of describing the commands, and are shorter.
- Every skill description is in the third person: what it does, then "Use when…", with the words people type.
- The skills' scripts are MIT-0, like the kit; the rest of `skills/` stays CC BY 4.0.

**Upgrade:** update `.devbook/` (for a copy, rerun the copy command, which now also fetches `devbook.manifest.json`), then run `node .devbook/skills/devbook-setup/scripts/link.mjs` and `node .devbook/skills/devbook-setup/scripts/verify.mjs`, and start a new chat.

## 2026-11-02: A smaller always-loaded tier

### Added
- **`instructions/security-web.md`**, path-scoped like design: the browser and sign-in rules SEC-05 (CSP), SEC-09 (CSRF), SEC-10 (CORS), SEC-14 and SEC-15 (passwords), SEC-16 (session cookies), SEC-17 (account responses) and SEC-18 (headers) moved here with their IDs and wording unchanged. CLIs, libraries and other projects without a browser or sign-in no longer load them in every chat.
- **`skills/devbook-setup/scripts/gitignore-secrets.mjs`** adds the secret-file patterns to `.gitignore` and lists any such file already tracked. SEC-29 now points to it instead of listing the patterns.

### Changed
- The always-loaded tier (core, security, testing) is 9.0 KB, down from 10.8 KB. Rules were reworded for density; their meaning and IDs are unchanged.
- **`AGENTS.md` template:** no session-start version check. It made a network call in every chat, failed in sandboxes and repeated what the kit's `SessionStart` hook does once a day. The `devbook-upgrade` line stays for "Is Devbook up to date?".
- The `devbook-security-review` skill also reads `security-web.md`.

**Upgrade:**
1. Update `.devbook/`.
2. In `AGENTS.md`, delete the paragraph that starts "At the start of each session, before the first task". If you want automatic checks in Claude Code, install the kit's `SessionStart` hook.
3. If the project serves pages or an API to browsers, or has its own sign-in, add the `security-web.md` line from `.devbook/templates/AGENTS.md` and link it: `ln -s ../../.devbook/instructions/security-web.md .claude/rules/devbook-security-web.md` and `ln -s ../../.devbook/instructions/security-web.md .github/instructions/devbook-security-web.instructions.md`.
4. Optionally run `node .devbook/skills/devbook-setup/scripts/gitignore-secrets.mjs`, then commit and start a new chat.

## 2026-11-02: Keep tokens out of reach

### Added
- **SEC-27:** never put a secret in a command argument, URL, chat or CI output; have the user paste it into a hidden prompt or stdin. Tokens get the least scope, one repository or service, and an expiry.
- **SEC-28:** scan for secrets before each commit and in CI, treat a hit as a leak until a human clears it, and generate test keys at run time instead of committing them.
- **SEC-29:** gitignore every file that can hold secrets before it exists (`.env*`, `.dev.vars`, keys and certificates, credential files such as `.npmrc` with tokens, and editor or assistant local settings), and check `git status` for them before each commit.

### Changed
- **SEC-03** now says to revoke an exposed secret first, because deleting the commit leaves the copies.

**Upgrade:** add the SEC-29 patterns your project can have to its `.gitignore`, then run `git ls-files` to check none of those files are already tracked; if one is, remove it from the index (`git rm --cached <file>`) and revoke what it held.

## 2026-11-02: Versions instead of release tags

### Changed
- **No more release tags.** Setup takes the latest `main`, and the new `VERSION` file records its version number. The copy method now also copies `VERSION` and `CHANGELOG.md` into `.devbook/`.
- **`devbook-upgrade` skill** compares `.devbook/VERSION` with `VERSION` on `main`, summarises the changelog between them and updates to `main` after you agree.
- **Version check hook** (`kit/claude-code/hooks/check-version.mjs`) reads `VERSION` on `main` instead of listing tags.
- **Setup prompt** no longer has a `Version:` line. When `.devbook/` already exists, it updates to the newest version before re-running setup.
- **`AGENTS.md` template** has the assistant compare `.devbook/VERSION` with `main` at the start of each session, and offer the upgrade when `main` is newer.
- `VERSION` goes up automatically with every commit to Devbook's `main`.

- Shorter meta descriptions for the api-data, design, performance, security and testing instructions and the Cloudflare stack note, so each is within 160 characters. The rules don't change.

**Upgrade:** projects pinned to the `v2026.11.02` tag keep working. To move to version numbers:
1. Submodule: `git -C .devbook fetch origin main && git -C .devbook checkout -q FETCH_HEAD && git config -f .gitmodules submodule..devbook.branch main && git add .devbook .gitmodules`. Copy: rerun the copy command from the setup page.
2. Add the version-check paragraph from `.devbook/templates/AGENTS.md` (under the `devbook-upgrade` line) to the Devbook section of your `AGENTS.md`.
3. Check that `.devbook/VERSION` exists, then commit and start a new chat.

## 2026-11-02: Cloudflare preview builds

### Changed
- **`stacks/cloudflare.md`** now says to add `"previews": {}` to `wrangler.jsonc` when you use Workers Builds. Non-production branches run `npx wrangler preview` by default, and without the block, branch builds and pull request checks fail. It also covers preview variables, routes and the fact that preview URLs are public.

**Upgrade:** if Workers Builds fails on your branches, add `"previews": {}` to `wrangler.jsonc`.

## 2026-11-02: Find out when a newer Devbook is out

### Added
- **`devbook-upgrade` skill.** It compares your pinned tag with the newest release, summarises the changelog entries and **Upgrade** notes in between, and upgrades `.devbook/` only after you agree.
- **Version check hook** in the kit: `kit/claude-code/hooks/check-version.mjs` runs when a Claude Code session starts. When a newer release exists, the assistant tells you and asks whether to upgrade. It checks at most once a day and adds nothing to the chat when you are up to date.
- The `AGENTS.md` template lists the skill, so Copilot, Codex and Cursor can follow it when you ask whether Devbook is up to date.

**Upgrade:**
1. Update `.devbook/`.
2. Link the skill: `ln -s ../../.devbook/skills/devbook-upgrade .claude/skills/devbook-upgrade`.
3. Add the `devbook-upgrade` line from `.devbook/templates/AGENTS.md` to your `AGENTS.md`.
4. If you use the kit's hooks, add the `SessionStart` entry from `.devbook/kit/claude-code/settings.json` to `.claude/settings.json`.

## 2026-11-02: Optional enforcement kit

### Added
- **`kit/`**, opt-in checks for rules that tools enforce better than text:
  - Claude Code `PreToolUse` hooks that block `git push`, edits to `.env` files and recursive `rm` outside the project, each telling the agent what to do instead.
  - Git hooks: a gitleaks secret scan before each commit, and a Conventional Commits check on each message.
  - Starter GitHub Actions workflows for Node.js and Python, with every action pinned to a commit SHA and a zizmor job that fails on unpinned ones.
- `kit/README.md` maps each rule marked "Enforce" in the pruning audit to the check that covers it, or to the tool to use where the kit has none.
- The setup prompt asks whether you want the kit and installs only the parts you choose. The copy command now also downloads `kit/`.

The kit is MIT-0, like the templates.

**Upgrade:** nothing changes unless you opt in. To add the kit, update `.devbook/` (rerun the copy command, which now includes `kit/`), then follow [Use the enforcement kit](https://devbook.raturi.in/start-here/enforcement-kit/).

## 2026-11-02: Dated releases you can pin

### Added
- **Releases.** Each release is a git tag named by its date, such as `v2026.11.02`, with `.1` for a second release that day. Tags never move.
- The setup prompt has a `Version:` line. `latest`, the default, pins the newest tag; a tag name pins that one; `main` follows every change, as before.
- The copy method downloads the tag's tarball and records the tag in `.devbook/VERSION`.

### Changed
- New submodules are added without `-b main` and checked out at the tag, so `git submodule update --remote` no longer applies to them. Upgrade by checking out a newer tag.
- The setup page and [Use Devbook day to day](https://devbook.raturi.in/start-here/using-devbook/#keep-it-up-to-date) describe checking your version, reading the changelog and upgrading.

**Upgrade:** nothing breaks if you keep following `main`. To pin a release instead:
- **Submodule:** run `git config -f .gitmodules --unset submodule..devbook.branch`, then `git -C .devbook fetch --tags && git -C .devbook checkout -q <tag> && git add .gitmodules .devbook`, and commit.
- **Copy:** rerun the download command from the [setup page](https://devbook.raturi.in/start-here/setup/#1-choose-how-to-add-devbook). It fetches the newest tag and writes `.devbook/VERSION`.

## 2026-11-02: Load rules only when they apply

A chat now starts with core, security and testing (10 KB), the "read" list and the skill descriptions: about 12 KB in all, instead of every chosen file. The rest load when the work needs them.

### Added
- **Path-scoped instructions.** Design, REST APIs, databases, SEO, content and mobile carry their own globs in frontmatter (`paths:` for Claude Code, `applyTo:` for Copilot). Setup links them into `.claude/rules/devbook-<name>.md` and `.github/instructions/devbook-<name>.instructions.md`, so each loads only when the assistant reads or edits a matching file, such as a `.css` file for design. Tested in Claude Code with the `InstructionsLoaded` hook: nothing loads at session start, and opening an `.astro` page loads design and SEO. We couldn't test Copilot's handling of linked files.
- **Skills** in `skills/`: `devbook-security-review`, `devbook-release-check`, `devbook-feature-doc`, `devbook-api-endpoint`, `devbook-db-migration`, `devbook-seo-audit`, and `devbook-setup` for the setup itself. Projects link the ones they need into `.claude/skills/`, which Claude Code and VS Code both read. Only each skill's name and description load until a task needs it.

### Changed
- The `AGENTS.md` template keeps `@` lines for core, security and testing, then lists the other files with when to read each, instead of "read every file below". Assistants without path rules or skills (Codex, Cursor, Gemini CLI) open them from that list.
- The setup prompt is now short: it adds `.devbook/` and hands over to `skills/devbook-setup/SKILL.md`. The copy command also downloads `skills/`.
- `.github/copilot-instructions.md` tells Copilot to read the three core files up front and the others before matching work.

**Upgrade:** existing projects keep working unchanged, because every file keeps its path and `@` lines still load. To switch to on-demand loading:
1. Update `.devbook/`. For the copy method, rerun the download command; it now includes `skills/`.
2. In `AGENTS.md`, keep the three `@` lines for core, security and testing, and turn the other `@` lines into "read" lines, as in `.devbook/templates/AGENTS.md`.
3. Link the path-scoped files and the skills you want, as on the [setup page](https://devbook.raturi.in/start-here/setup/#2-connect-your-assistants), or ask your assistant to "follow .devbook/skills/devbook-setup/SKILL.md".
4. Copy the new `.devbook/templates/copilot-instructions.md`, commit, and start a new chat.

## 2026-11-02: Fewer, numbered rules

The instructions now hold about 250 rules instead of about 410. The mandatory core, security and testing files are 10 KB (about 2,500 tokens) instead of 14.6 KB; a public website's set is 27 KB instead of 36 KB. Every removed rule failed the deletion test in the [writing guide](https://devbook.raturi.in/start-here/writing-instructions/): a capable model already does it, or another file already says it. The full rule-by-rule audit, with a reason for each verdict, is in `docs/plans/prune-audit.md`.

### Changed
- Every rule starts with a stable ID (`CORE-02`, `SEC-05`, `API-03`). Assistants cite IDs in their reports, and project overrides can name the rule they replace. IDs are never reused.
- Each file starts with its most important rules.
- Sources moved from each file's first paragraph to a `sources:` list in its frontmatter. The site shows them under the title.
- Validating input at the boundary now lives only in security (`SEC-02`), along with access per property, rate limits and URL allowlists that the REST API file repeated.
- The browser check for UI work (360 px and 1440 px, light and dark, keyboard) moved from core to design (`DES-04`). The axe check moved from testing to design (`DES-05`).

### Removed
- Core: reading code first, naming conventions (language defaults, verbs for functions, domain words), folder-layout defaults, small functions, comment style, error-handling and logging advice that security already covers, README contents and re-reading the diff.
- Testing: the edge-case list, test levels models choose by default, arrange-act-assert, snapshot and coverage advice.
- Design: general heuristics (hierarchy, consistency, feedback timing, recognition over recall), grid rhythm, density, optical alignment, squint tests, logical properties, button-label, toast and skeleton advice, and focus trapping, which native `<dialog>` handles.
- Database, REST APIs, SEO, content, mobile, licensing and performance: rules models follow by default (normal forms, column naming, HTTP method semantics, readable URLs, platform conventions) and rules repeated in another file.

**Upgrade:** nothing breaks; every file keeps its path. If your project relied on a removed rule, such as a naming convention or the edge-case list, add it to the Project section of your `AGENTS.md`. Overrides that named a section ("this overrides api-data") can now name the rule ID instead.

## 2026-11-02: PBKDF2 for FIPS-140, and accurate loading notes

### Changed
- Security: where FIPS-140 validation is required, hash passwords with PBKDF2-HMAC-SHA-256 at 600,000 iterations or more, as the OWASP Password Storage Cheat Sheet says. Argon2id stays the default.
- How Devbook works: says exactly how Codex, Cursor and Gemini CLI load `AGENTS.md`, instead of saying they read the same file list. Gemini CLI reads `GEMINI.md` unless you set `context.fileName`. The cost table reflects current sizes.
- The "View Markdown" version of the home, setup and license pages is now plain Markdown, with no MDX components, and includes the licence text.

## 2026-10-24: Ready for public use

### Added
- A PowerShell copy command for Windows, on the setup page and in the setup prompt.
- Day-to-day guide: review updates like a dependency upgrade, monorepo setup, and troubleshooting for Windows and for assistants that pick up Devbook's own contributor rules.
- A test that the setup prompt names every instruction file.

### Changed
- Devbook's own `AGENTS.md` now says it applies only to changing Devbook. Projects that embed Devbook may load it when an assistant reads `.devbook/` files, and should ignore it.
- The guides on the site are CC BY 4.0, like the instructions and stack notes.
- Instruction, stack and template files are never renamed or deleted, because projects import them by path.

### Removed
- `BUILD-PROMPT.md`, an outdated scaffolding prompt that referred to pages that no longer exist.

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

## 2026-10-23: First design, v1.0.0 (replaced the next day by unversioned files)

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
