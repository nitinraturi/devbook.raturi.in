# Devbook: LLM efficiency plan (implementation brief)

You are working in the `nitinraturi/devbook.raturi.in` repository. This brief tells you what to change, in what order, and how to know each step is done. Follow the repository's own `AGENTS.md` (contributor rules) as well; where this brief and `AGENTS.md` differ, this brief wins only for the items it names.

Save this file as `docs/plans/llm-efficiency.md` and work one phase per session: "Read docs/plans/llm-efficiency.md and do Phase N."

## Goal

Make Devbook cheaper and more effective for AI coding assistants. Today a typical web-app project loads about 43 KB (about 11,000 tokens, about 290 rules) into every chat, whatever the task. The target is a small always-loaded core, with everything else loading only when the task or the files being edited need it, and evidence that each change helps.

## Why (evidence to keep in mind)

- *Evaluating AGENTS.md* (arXiv 2602.11988, ICLR 2026): repository context files did not generally improve task success for LLM-generated or developer-written files, and raised inference cost by over 20% on average. Agents do follow the instructions; the value is in specifying non-standard practices. Repository overviews did not help.
- Claude Code memory docs: `@` imports load together with the file that imports them, so splitting files does not reduce context cost. Keep each file under about 200 lines. Move rules that matter for only part of the codebase into path-scoped rules (`.claude/rules/*.md` with `paths:`), which load only when matching files are opened, and multi-step procedures into skills, which load only when relevant. Imports recurse at most four hops. Claude Code reads `AGENTS.md` directly when there is no `CLAUDE.md`.
- Agent Skills is an open standard (published December 2025). VS Code Copilot scans `.github/skills/`, `.claude/skills/` and `.agents/skills/`; only `name` and `description` load at startup, and the body loads when the skill applies.
- Devbook's own writing guide (`src/content/docs/start-here/writing-instructions.md`) already says: fewer rules, concrete rules, test before adding. This plan applies it to Devbook itself.

Re-check any tool behaviour in the official docs before relying on it; these features change monthly. If the docs now say something different from this brief, stop and tell the user.

## Decisions

Use these defaults unless the user has changed them here:

- **Assistants to support:** Claude Code and GitHub Copilot in VS Code get first-class wrappers (path rules and skills). Codex, Cursor, Gemini CLI and others get the routing list in `AGENTS.md` only.
- **Paid evaluation runs:** never run an evaluation that spends API credits without the user's explicit go-ahead in chat. Build the harness so it can dry-run without calling a model.
- **Versioning:** introduce dated release tags. New setups pin the latest tag; existing submodule users keep tracking `main` until they choose to switch.

## Ground rules for every phase

- Work on a new branch per phase (`chore/hygiene`, `feat/evals`, `refactor/prune-core`, `feat/load-tiers`, `feat/releases`, `feat/enforcement-kit`). Commit in small logical steps with Conventional Commits. Don't push, open a pull request, merge, tag or deploy unless the user asks.
- Never rename or delete a file in `instructions/`, `stacks/` or `templates/`. Projects import them by path and a missing `@` file fails silently. Slim a file in place; if content moves, leave a one-line pointer.
- Don't add `.claude/`, `.github/instructions/`, `.agents/` or other auto-loaded agent folders to this repository: projects that embed Devbook as a submodule would load them too. Ship skills and rule sources under top-level folders (`skills/`, `rules/`) and let the setup prompt link them into each project.
- Every change to `instructions/`, `stacks/` or `templates/` gets a dated `CHANGELOG.md` entry, with an **Upgrade** note when a project has to do something.
- Run `npm run check` before you finish a phase and show its real output. If a check can't run in your environment (for example, Playwright can't download a browser), say which one and why. Never weaken a check to make it pass.
- Keep licences intact: `instructions/`, `stacks/`, `skills/`, `rules/` and the `start-here/` guides are CC BY 4.0; `templates/` and code are MIT-0. Update `/license/` and the README licence section when you add a folder.
- At the end of each phase, report: what changed, what you verified, what you did not do, and every assumption. Then stop and wait for the user.

---

## Phase 1: Hygiene and guardrails

Branch `chore/hygiene`. Low risk, no change to rule content. Each item below is a separate commit.

1. **Formatter and linter.** Add Prettier (with the Astro plugin) and ESLint (flat config, TypeScript and Astro support), using the latest stable versions you can confirm on npm. Match the existing style: tabs, single quotes. Add `format`, `format:check` and `lint` scripts, add `format:check` and `lint` to `npm run check` and to CI before the build. Run the formatter once in its own `style:` commit so other diffs stay readable.
2. **Dependency updates.** Add `.github/dependabot.yml` for `npm` and `github-actions`, weekly, with grouped minor and patch updates. Actions stay pinned to commit SHAs.
3. **No duplicate site.** Set `"workers_dev": false` in `wrangler.jsonc` and update `DEPLOY.md` so it no longer presents the `workers.dev` URL as live.
4. **Zero build warnings.** `npm run build` currently warns that the `i18n` collection does not exist and that `/404` conflicts with a higher-priority route. Find the cause of each from the Starlight and Astro docs and fix it without hiding it. Then add a step that fails the build script when Astro prints `[WARN]` or `[ERROR]`.
5. **Clean Markdown endpoints.** `src/pages/[...slug]/index.md.ts` leaves MDX in the output for `/index.md`, `/start-here/setup/index.md` and `/license/index.md`. Convert `Tabs`/`TabItem` to headings, `Steps` to a numbered list, `Aside` to a blockquote with its title, `CardGrid`/`LinkCard`/`Card` to a link list, and resolve the license page's `<Code code={licenseText}>` import so the licence text appears. Add an e2e or build-time test that no `/**/index.md` contains a capitalised JSX tag outside fenced code.
6. **Staleness notice at view time.** `PageTitle.astro` decides "stale" at build time, so with manual deploys the notice may never appear. Render the `lastVerified` date in a data attribute and let `src/scripts/site.ts` show or hide the notice in the browser. Keep the build-time render as the no-JS fallback.
7. **Scheduled checks.** Add a weekly scheduled CI workflow that runs `npm run check` and an external-link check of the instruction and stack files (for example, `lychee`, pinned by SHA). Failures open no issues automatically; they just fail the run.
8. **Size budget.** Add `devbook.manifest.json` listing every file in `instructions/`, `stacks/` and `templates/` with: path, kind (instruction, stack, template), when to load it (one line), and its tier (`always`, `path`, `task`; for now core, security and testing are `always`, everything else `path`). Add `scripts/check-budget.mjs` that reads the manifest, fails if a file is missing from it or a listed file is missing on disk, and checks budgets using bytes ÷ 4 as the token estimate: each instruction under 8 KB, the `always` tier under 15 KB, and the public-website set (`always` + performance, design, seo, content) under 35 KB. Wire it into `npm run check`. It will fail on `design.md` (8.6 KB) and the website set (about 36 KB); record that as an expected failure in the commit message and leave the fix to Phase 3, or mark it as a warning until then. Say which you chose.
9. **Stale owner TODOs.** Update `docs/TODO.md`: the custom domain and `PERSON.sameAs` items are done.
10. **Inconsistencies.**
    - README says project rules override Devbook; `instructions/core.md` says they override it only where they say so explicitly. Make the README match core.
    - Node version: README says 22.23.4 or later, `.nvmrc` says 24, `engines` says `>=22`. Make README say "Node.js 22 or later; CI uses the version in `.nvmrc`".
    - `AGENTS.md` asks for 120–160-character descriptions; `scripts/check-descriptions.mjs` allows 70–170. Make the script match `AGENTS.md`.
    - `scripts/generate-og.mjs` still uses the old tagline. Update it to the current site description and regenerate `public/og-default.png`.
11. **How-it-works accuracy.** In `src/content/docs/start-here/how-it-works.md`, "Other assistants … read the same file list" overstates support. Check the current Codex, Cursor and Gemini CLI docs and say exactly how each loads `AGENTS.md` and whether it expands `@` lines. Gemini CLI may read `GEMINI.md` by default; confirm before writing it.
12. **Consent banner coverage.** `src/scripts/site.ts` shows the banner only for `Europe/*` time zones, so EEA visitors in `Atlantic/*` zones (for example, Iceland, the Canary Islands, Madeira, the Azores) get no banner. Add the EEA `Atlantic/*` zones you can confirm from the IANA database.
13. **Local server robustness.** In `scripts/serve-dist.mjs`, wrap `decodeURIComponent` so a malformed URL returns 400 instead of crashing the server.
14. **Password hashing.** In `instructions/security.md`, check the current OWASP Password Storage Cheat Sheet and, if it still says so, add PBKDF2 for systems that require FIPS-140 validation. Changelog entry required.

**Done when:** `npm run check` passes (or the budget check fails only on the items noted), CI runs format and lint, the site still builds with zero warnings, and the changelog has entries for items 14 and any instruction text you touched.

---

## Phase 2: Evaluation harness and baseline

Branch `feat/evals`. The goal is to measure whether a Devbook version helps before changing rule content.

1. Create `evals/` with:
   - `fixtures/astro-site/` and `fixtures/django-api/`: two small, realistic projects with tests, each committed in a known state. Keep them minimal; they are test data.
   - `tasks/*.yaml`: 15–20 tasks across both fixtures. Each has a prompt, the fixture, and automated checks. Cover behaviours Devbook claims to change, for example: runs the test command before reporting done; does not weaken or delete a failing test; adds a migration for a model change; does not invent a package; keeps the CSP without `'unsafe-inline'`; validates input at the boundary; reports partial work as partial; doesn't commit or push unasked.
   - `checks/`: one script per check, reading the fixture's final state and the agent transcript.
   - `run.mjs`: copies a fixture into a temporary directory, installs a chosen Devbook variant (`none`, `main`, or a local working tree), runs the agent headless, runs the checks, and records pass/fail plus token usage and cost from the agent's JSON output. Confirm the headless flags from `claude --help` and the Claude Code docs. Support `--dry-run`, which does everything except call the model.
2. Each task runs at least three times per variant, because single runs are noisy. Report per-task pass rate, overall pass rate, mean input tokens and mean cost.
3. Write `evals/README.md`: how to run it, what it costs per run (estimate it from one task first), and how to read the report.
4. Don't run the full baseline. Run one task once with `--dry-run`, show the output, give the cost estimate for the full baseline, and ask the user to approve it.

**Done when:** the dry run works end to end, every task has at least one automated check, and the user has a cost estimate to approve.

---

## Phase 3: Prune to rules a model wouldn't follow anyway

Branch `refactor/prune-core`. Needs the Phase 2 baseline.

1. Make a table in `docs/plans/prune-audit.md` with one row per bullet in `instructions/*.md`: file, rule text, verdict, reason. Verdicts:
   - **Delete:** a capable model does this unprompted (for example, "write small functions", "comments explain why"). The writing guide's deletion test applies.
   - **Keep:** non-standard, opinionated or easy to get wrong (for example, the precedence order, "never weaken a check", "report partial work as partial", the human-approval list, the password rules, CSP by hash).
   - **Enforce:** a tool or check can enforce it better than text. Keep a one-line pointer and add the check to the Phase 6 list.
2. Show the user the table before editing any instruction file, and wait for approval.
3. Apply the approved verdicts. Put the three to five most important rules first in each file. Move the "Draws on …" source lines into a `sources:` frontmatter list (rendered on the site, kept short) instead of body text.
4. Give every kept rule a stable ID such as `CORE-01`, `SEC-07`, `TEST-03` at the start of the bullet, and add one line to `core.md` asking the agent to cite rule IDs when its report mentions a rule. Never reuse an ID; retire it instead.
5. Targets (confirm against the evals, not just the byte count): `always` tier about 6–10 KB (about 1,500–2,500 tokens); every instruction under 8 KB; the website set under 35 KB. Update the cost table in `how-it-works.md` and the manifest sizes.
6. Run the evaluation for the pruned variant (with the user's approval for the spend) and compare with the baseline. If any task's pass rate drops, restore or rewrite the rule that covered it and re-run that task.

**Done when:** the budget check passes, the evaluation shows pass rate at or above baseline with lower mean input tokens, and the changelog explains what was removed and why.

---

## Phase 4: Three loading tiers

Branch `feat/load-tiers`. Additive only; every existing `@.devbook/...` path keeps working.

**Tier 1, always loaded:** the slimmed `core`, `security` and `testing` through `AGENTS.md`, unchanged in mechanism.

**Tier 2, loaded by file path:**

1. Spike first, and report the result before building on it: does an `@` import inside a Claude Code `.claude/rules/*.md` file with `paths:` frontmatter expand when the rule loads? Test it in a scratch project. Check the current Copilot docs for the frontmatter field that scopes `.github/instructions/*.instructions.md` files (expected `applyTo`, but confirm).
2. Add `rules/` at the repository root with one source per path-scoped instruction (design, database, api-data, seo, content, mobile) and suggested globs per common stack in `devbook.manifest.json` (for example, design → `**/*.{css,astro,tsx,jsx,vue,svelte,html}`; database → migrations and model files).
3. Depending on the spike:
   - If imports work in rule files, the setup prompt writes a small wrapper per tool: `.claude/rules/devbook-<name>.md` with the project's own `paths:` and one `@.devbook/instructions/<name>.md` line, and `.github/instructions/devbook-<name>.instructions.md` with its scope field and a one-line instruction to read the file.
   - If they don't, the wrapper for Claude Code is a symlink into `.devbook/rules/<name>.md` and the globs live in that file; explain the trade-off (globs can't be project-specific) to the user before choosing.

**Tier 3, loaded by task (skills):**

1. Add `skills/<name>/SKILL.md` following the Agent Skills specification (`name`, `description`, body under 500 lines, details in referenced files). Start with: `devbook-setup` (replaces the long setup prompt), `feature-doc` (uses `templates/FEATURE.md` and `instructions/feature-docs.md`), `security-review`, `seo-audit`, `new-api-endpoint`, `db-migration`, `release-checklist`. Descriptions say exactly when to use the skill, because the description is all the agent sees until it loads.
2. The setup prompt links the chosen skills into the project (`.claude/skills/` and `.github/skills/`, or one folder if a tool reads both). Confirm current folder names in the docs before writing them.
3. Keep skill count small: each description costs context in every chat.

**Routing list for everything else:**

1. Change `templates/AGENTS.md` so the Devbook section has the mandatory `@` lines, then a "Read when" list: one line per optional file saying when to open it, replacing "Read and follow every file below before your first change". Keep the `@` form as a documented opt-in for projects that want everything loaded.
2. Update `templates/copilot-instructions.md` to match.

**Updates:** `templates/setup-prompt.md`, the setup page, `how-it-works.md` (loading section, cost table), `using-devbook.md` (troubleshooting: skill didn't trigger, path rule didn't load), the homepage cards, the manifest, the smoke test that checks every file is listed, and the changelog with an **Upgrade** note telling existing projects how to switch.

**Done when:** a fresh project set up with the new prompt loads only tier 1 at session start (show the Claude Code `/memory` or `/context` output), a path rule loads when a matching file is opened, a skill loads when its task is asked for, and the evaluation pass rate is at or above Phase 3 with lower mean input tokens.

---

## Phase 5: Releases and versioning

Branch `feat/releases`.

1. Adopt dated tags (`vYYYY.MM.DD`, with `.N` for a second release the same day). Document the release steps in `DEPLOY.md`: update `CHANGELOG.md`, tag, push the tag. Don't create a tag yourself unless the user asks.
2. Setup prompt: the submodule method checks out the latest tag (`git submodule add` then `git -C .devbook checkout <tag>`); the copy method downloads the tag's tarball. Updating means moving to a newer tag after reading the changelog.
3. Keep tracking `main` as a documented option for people who want every change immediately.
4. Optional, ask first: a CI job on tag push that publishes a stripped "agent build" (no frontmatter, no source lines) to a `release` branch, if Phase 3 measurements show frontmatter is a meaningful share of tokens.

**Done when:** the setup page, setup prompt and `using-devbook.md` describe pinning and upgrading, and the changelog has an **Upgrade** note.

---

## Phase 6: Enforcement kit

Branch `feat/enforcement-kit`. Instruction files are context, not enforcement; hard limits belong in tools.

1. Add `kit/claude-code/` with an example `settings.json` and `PreToolUse` hook scripts that block `git push`, edits to `.env*` files, and recursive `rm` outside the project, each with a clear message to the agent. Confirm the current hooks format in the Claude Code docs.
2. Add `kit/pre-commit/` with a secret-scanning hook (for example, gitleaks) and `kit/ci/` with a starter workflow: install from lockfile, format check, lint, typecheck, tests, build, dependency audit, actions pinned by SHA.
3. For each Phase 3 "Enforce" verdict, add the check to the kit or document which existing tool covers it.
4. The setup prompt offers the kit as an opt-in step and never installs it without asking.
5. Licence: the kit is code, so MIT-0.

**Done when:** each hook is tested in a scratch project with its real output shown, and the setup page documents the kit as optional.

---

## Out of scope

- Rewriting the site design.
- Adding new instruction topics.
- Changing the GA4 property or analytics behaviour beyond Phase 1, item 12.

## Sources

- Evaluating AGENTS.md (arXiv 2602.11988): https://arxiv.org/abs/2602.11988v1
- Claude Code, How Claude remembers your project: https://code.claude.com/docs/en/memory
- VS Code, Use Agent Skills: https://code.visualstudio.com/docs/agent-customization/agent-skills
- GitHub Copilot custom instructions: https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions
- Agent Skills specification: https://agentskills.io
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
