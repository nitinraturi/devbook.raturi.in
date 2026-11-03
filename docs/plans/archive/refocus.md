# Devbook refocus: code quality only (implementation brief, v2)

You are working in `nitinraturi/devbook.raturi.in`. Written 2026-11-03 against `main` at `17e3335` (VERSION `2026.11.02.5`). This version replaces the earlier refocus brief: there are no add-ons any more. Save it as `docs/plans/refocus.md` and work one phase per session: "Read docs/plans/refocus.md and do Phase N." Where this brief and `AGENTS.md` differ, this brief wins for the items it names.

## The product, in three sentences

1. Devbook has one purpose: an AI coding assistant writes better code, efficiently, as soon as Devbook is installed.
2. Installing it takes one prompt and no questions, and it changes only the files assistants read.
3. Anything else (how the team commits, reviews, releases or deploys, analytics, hooks, CI) is the project's own business: users add their own instructions and skills, and Devbook never overrides or edits them.

**The test for everything that ships:** does it change the code the assistant writes, or how the assistant checks that code, during the session? If not, it doesn't ship.

## What drifted (audit of `17e3335` and the live site)

| # | Finding | Where |
|---|---|---|
| D1 | Setup asks three questions before it starts (workflow, analytics, kit). | `skills/devbook-setup/SKILL.md` step 1 |
| D2 | Google Analytics defaults to **yes** for websites, and there is a GA4 stack note. Analytics isn't code quality. | Setup, `templates/AGENTS.md`, `stacks/ga4-consent.md` |
| D3 | Setup always edits `.gitignore`. | Setup step 4 |
| D4 | The enforcement kit (Claude Code hooks, git hooks, starter CI, version-check CI) and the `devbook-release-check` skill are about how code ships, not how it's written. | `kit/`, `skills/devbook-release-check/` |
| D5 | Instruction files impose process and product decisions. Examples: changelogs, ADRs, commit and branch formats, secret-scanning hooks and CI gates, monitoring and deploys, a design-direction doc before the first screen, About and privacy pages, an editorial policy to publish, project licence choice. | `instructions/*.md` |
| D6 | The submodule copies the whole repository (5.2 MB, 379 files) into every project, including Devbook's own `AGENTS.md` and `CLAUDE.md`. Claude Code loads a subdirectory's `CLAUDE.md` or `AGENTS.md` when it reads a file there, so Devbook's contributor rules can enter users' sessions. The files projects use are about 380 KB. | `git ls-files`; Claude Code memory docs |
| D7 | Setup merges into `AGENTS.md` free-form, so upgrades and uninstalls can't tell Devbook's lines from the user's. | `templates/AGENTS.md` |
| D8 | The homepage and setup page describe different flows, and neither says what Devbook never touches. | Live site |

## What ships after this refocus

| Ships | Purpose |
|---|---|
| `instructions/` (code rules only) | Always-loaded core, security and testing; path-scoped design (UI code), API, database, SEO (technical HTML), mobile, performance (code) |
| `stacks/` (code notes only) | Framework rules such as Astro, Django, TypeScript, Swift, three.js |
| Code-task skills | `devbook-security-review`, `devbook-api-endpoint`, `devbook-db-migration`, `devbook-seo-audit`, `devbook-feature-doc` (only reads and updates existing docs unless asked to create one) |
| Devbook's own skills | `devbook-setup`, `devbook-upgrade`, plus the new uninstall script |
| `templates/` | `AGENTS.md`, `CLAUDE.md`, the Copilot pointer, `FEATURE.md` |

Leaving the product (with a deprecation period, Phase 4): `kit/`, `devbook-release-check`, `stacks/ga4-consent.md`, the process and product rules, `instructions/content.md` (editorial writing isn't code), the project-licence parts of `licensing.md`, and the setup questions.

## The scope contract

Put this in `CONTRIBUTING.md`, the setup page and the setup skill, and enforce it with a test.

**Setup, upgrade and uninstall may change only:**
- `.devbook/`
- the Devbook block in `AGENTS.md`, between `<!-- devbook:start -->` and `<!-- devbook:end -->`, plus a starter Project section only when `AGENTS.md` is new
- the line `@AGENTS.md` in `CLAUDE.md`
- one sentence in `.github/copilot-instructions.md`
- `devbook-*` links or generated copies in `.claude/rules/`, `.claude/skills/`, `.github/instructions/`, and, only when the assistant is detected, `.cursor/rules/` and `.agents/skills/`
- `.gitmodules`

**They never change** application code, dependencies, `.gitignore`, CI, git hooks, `.claude/settings.json`, build, deploy or hosting config, analytics, or any user-written instruction, rule or skill.

## Users' own instructions and skills

This is how people extend Devbook. It must work without Devbook's help and survive every upgrade.

- **Project rules** go in the Project section of `AGENTS.md`, outside the Devbook block. They win over Devbook, and core says so in one line.
- **Their own instruction files:** any `@path` line or "read when" line they add outside the block, or their own files in `.claude/rules/` and `.github/instructions/` without the `devbook-` prefix.
- **Their own skills:** any folder in `.claude/skills/` (or `.agents/skills/`) without the `devbook-` prefix. Devbook never links, renames or overwrites one.
- **Turning off a Devbook rule:** a Project line such as `- Rules: ignore DES-12; we use a fixed type scale`. Rule IDs make this precise.
- The `AGENTS.md` template shows one example of each (as comments), and the setup page has a short "Add your own rules and skills" section.
- Setup lists the user's existing rules and skills in its report, so they can see nothing was touched.

---

## Phase 1: Zero-question install inside the scope contract (fixes D1, D2, D3, D7)

Branch `refactor/zero-setup`.

1. **No questions.** Setup step 1 becomes "Inspect": infer the stack, commands, layout and assistants from the repository (manifests, lockfiles, existing `.cursor/`, `.codex/` or `.github/copilot-*` files), and write TODO where it can't infer something. It asks only when the project is empty, because then nothing can be inferred.
2. **Remove** the workflow, analytics and kit questions, the `Workflow:` and `Analytics:` template lines, and the kit step. Existing projects keep any such lines they already have as their own Project rules.
3. **Delimited block.** `templates/AGENTS.md` = a starter Project section (written only when `AGENTS.md` is new) plus the Devbook block between markers. Setup, upgrade and uninstall edit only the block. For older installs, the upgrade moves Devbook's lines into a block after showing the diff.
4. **`.gitignore`:** setup no longer runs `gitignore-secrets.mjs` to write. It runs it with its existing `--check` flag and lists tracked or unignored secret files in the report as a warning, changing nothing.
5. **Scope guard.** `verify.mjs --scope` fails if any path outside the contract changed since before setup. Setup runs it last. Add a test that runs setup's scripts on a fixture with CI workflows, git hooks, a `.gitignore`, a `wrangler.jsonc`, a `Dockerfile`, a user rule in `.claude/rules/` and a user skill in `.claude/skills/`, and asserts none of them changed.
6. **Uninstall.** `skills/devbook-setup/scripts/uninstall.mjs` (with `--dry-run`) removes the block, the lines Devbook added, and every `devbook-*` link or copy, then prints the command to remove `.devbook/`.
7. **Changelog** entry with an **Upgrade** note.

**Done when** setup finishes on every eval fixture with zero questions, `verify.mjs --scope` passes, and the scope test runs in CI.

## Phase 2: Ship only the product (fixes D6)

Branch `feat/dist-branch`.

1. `scripts/build-dist.mjs` assembles exactly the "Ships" table, plus `devbook.manifest.json`, `VERSION`, `CHANGELOG.md`, both licence files and a short `README.md`. No `AGENTS.md`, `CLAUDE.md`, `.github/`, site, evals, sources, docs or maintainer files. The build fails if any agent file appears outside `templates/`.
2. The release workflow publishes it to an orphan `dist` branch whenever shipped files change, using the existing GitHub App token.
3. The setup prompt, copy command, `devbook-upgrade`, `compare.mjs` and the setup page all use `dist`.
4. Add a distribution size budget (start at 300 KB) to `check-budget.mjs`.
5. **Upgrade** note for submodules on `main`: `git config -f .gitmodules submodule..devbook.branch dist && git submodule update --remote .devbook`. `devbook-upgrade` detects `main` and offers the switch.

**Done when** a fresh submodule install contains only distribution files, is under budget, and has no nested agent files.

## Phase 3: Code rules only (fixes D5)

Branch `refactor/code-rules-only`. Rule IDs never change; removed rules go into `retiredRuleIds`.

1. **Audit.** Write `docs/plans/refocus-audit.md`: one row per rule, labelled:
   - **Code:** keep.
   - **Process:** retire. Core's new rule covers it.
   - **Product:** retire, or reword into a code rule.

   Proposed verdicts for the owner to confirm:
   - Retire as Process: CORE-19 (ADRs), CORE-21 (commit and branch format), the changelog half of CORE-18, SEC-28 (scanning hooks and CI), TEST-08 (CI gates), PERF-13 and PERF-14 (monitoring, deploys), CONT-16 (review cadence), LIC-01 and LIC-05 to LIC-09 (project licence choice and files).
   - Retire as Product: CONT-12 (About, contact and privacy pages) and the "Publish this policy" line. Reword SEC-24 to: when code collects personal data, flag a missing retention or deletion path in the report. Reword DES-01: for an existing UI, follow the project's design system; for a new one, propose a direction in the report instead of requiring an approved doc.
   - `content.md` and `stacks/ga4-consent.md`: retire the files (Phase 4 deprecation). Before retiring, move any rule that governs UI text in code (CONT-07: user's words, sentence case, consistent terms) into `design.md`.
   - Keep in `licensing.md` only the rules about code the assistant brings in (LIC-02 to LIC-04, LIC-10, LIC-14), and make it read-when for "adding dependencies, assets or copied code".
   - SEO: keep the technical rules (status codes, links, canonicals, robots, sitemap, titles, structured data, images). Retire SEO-13 (author pages) and SEO-25 (launch checklist).

   Show the table and wait for approval before editing.
2. **Two core rules** (the always tier stays within its budget, so reword elsewhere to make room):
   - Follow the project's existing conventions and process, including commits, branches, changelog, docs, CI, release and deploy. Devbook doesn't define them; the project's `AGENTS.md` does.
   - Don't add features, pages, tracking, dependencies, services or config the task didn't ask for. Suggest them in the report instead.
3. **Efficiency pass.** With process and product rules gone, re-tier what is left. Anything not needed for most code tasks moves from always-loaded to a path rule or read-when line. Target an always tier of about 7 KB (about 1,750 tokens), and confirm it with the modelled evals.
4. **Evals:** retire the tasks that tested retired rules. Add tasks for the two new core rules: a task where adding analytics or a dependency would be tempting, and a task in a repository with its own commit convention. Re-run the modelled evals, then ask the owner before any measured run.

**Done when** no shipped rule fails the "does it change the code or how it's checked" test, the always tier is at or under target, and the evals pass.

## Phase 4: Retire what isn't code quality, without breaking anyone (fixes D2, D4)

Branch `refactor/retire-non-code`. Projects reference files by path, and some have the kit's hooks wired to `.devbook/kit/`, so removal is staged.

1. **Deprecate now:** `kit/`, `devbook-release-check`, `stacks/ga4-consent.md` and `instructions/content.md` each get a first line saying they're deprecated, the date they leave the distribution (one minor cycle, about 60 days), and what to do. For the kit: copy the hooks into your own repository or remove them from `.claude/settings.json`. For the others: keep your own copy if you want it.
2. **Setup** no longer links, offers or mentions any of them. `link.mjs` stops creating them; `verify.mjs` warns, without failing, when a project still has them.
3. **`devbook-upgrade`** tells projects that use any of them, in one line each, and offers to remove the links. It doesn't touch the project's own copies or settings.
4. **After the deprecation date:** remove them from the distribution (Phase 2), keep the IDs in `retiredRuleIds`, and keep a one-line pointer file at each instruction path so `@` lines don't break silently.
5. **Changelog** entry with **Upgrade** steps for each.

**Done when** a new install has none of them, an existing install keeps working and is told what changes and when, and the changelog says how to keep each piece on your own.

## Phase 5: Say it plainly (fixes D8)

Branch `docs/code-quality-only`.

1. **Homepage:** "Rules and skills that make AI coding assistants write better code. One prompt, no questions. Touches only the files your assistant reads." Then the setup prompt, then a generated table: **Devbook writes** / **Devbook never touches**.
2. **Setup page:**
   - the zero-question flow;
   - the scope contract;
   - "Add your own rules and skills", with the four examples above;
   - uninstall.
3. **Remove** every mention of the GA4 question, the workflow question, the kit and `.gitignore` edits. Keep the deprecation notes on the changelog only.
4. **Evals page:** keep "modelled" on every number until measured runs exist, and add the scope test's result.
5. **`CONTRIBUTING.md`:** the three-sentence product statement, the shipping test and the scope contract. A pull request that adds anything failing the test is declined.
6. **README:** the same three sentences and the setup prompt link.

**Done when** the homepage, setup page, README, setup prompt and setup skill describe one identical flow, checked by a test that compares the generated tables with the manifest.

## Not changing

- The maintainer automation (source watcher, scheduled reviews, digest, release gates) stays, because users never see it. Its pull requests must pass the shipping test and the scope contract like any other change.
- Rule IDs, the loading tiers, the size budgets and the adapters for Claude Code, Copilot, Cursor and Codex stay.

## Sources

- Claude Code, How Claude remembers your project (nested `CLAUDE.md` and `AGENTS.md` load on demand when Claude reads files in a subdirectory): https://code.claude.com/docs/en/memory
- *Evaluating AGENTS.md* (arXiv 2602.11988): context files add cost and help most when they state non-standard practices: https://arxiv.org/abs/2602.11988v1
- Anthropic, Effective context engineering for AI agents ("the smallest set of high-signal tokens"): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
