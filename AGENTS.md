# AGENTS.md: working on devbook.raturi.in

These rules are only for changing the Devbook repository itself. If you are working in another project that includes Devbook at `.devbook/`, ignore this file and follow that project's root `AGENTS.md`.

Devbook is a small set of instruction files that other projects load into Claude and Copilot through a git submodule at `.devbook/`. Every word ships into every session of every project, so keep it short, correct and current.

## Commands

```bash
npm ci
npm run dev      # local preview
npm run check    # format, lint, typecheck, descriptions, size budgets, contrast, build (link validation), Playwright + axe
npm run lhci     # Lighthouse budgets
```

## Layout

- `instructions/*.md`: the product. Mandatory `core`, `security` and `testing`, plus conditional `security-web`, `performance`, `api-data`, `database`, `design`, `seo`, `content`, `mobile`, `licensing` and `feature-docs`. They are rendered on the site through the symlink `src/content/docs/instructions`.
- `stacks/*.md`: short notes for one technology each, also rendered through a symlink.
- `skills/<name>/SKILL.md`: Agent Skills that projects link into `.claude/skills/`. Each `name` starts with `devbook-` and matches its folder; the description, in the third person, says what it does and then "Use when…". Mechanical steps live in `scripts/` (Node, no dependencies, MIT-0, tested by `npm run test:scripts`) and report shapes in `references/`; `npm run check:skills` runs the Agent Skills validator.
- Loading tiers (in `devbook.manifest.json`): core, security and testing are `@` imports; security-web, design, api-data, database, seo, content and mobile carry identical `paths:` and `applyTo:` globs and are linked into projects' `.claude/rules/` and `.github/instructions/`; the rest are read-when lines or skills. Never add `paths:` to an always-loaded file.
- `templates/`: `setup-prompt.md` (shown on the homepage), `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md` and `FEATURE.md`. Pages import them with `?raw`; never copy template text into a page.
- `src/content/docs/`: the homepage, the `start-here/` guides (how it works, setup, day-to-day use, writing instructions, contact), license and privacy pages. Instruction and stack pages come through the symlinks.
- `kit/`: the optional enforcement kit (Claude Code hooks, git hooks, starter CI) that projects opt into. It is code, so MIT-0; `npm run test:scripts` tests the hooks and the skills' scripts.
- `evals/`: the evaluation harness (fixtures, tasks, checks) that shows whether a Devbook version changes what an agent sees and does. `npm run evals:model` (the modelled run) is free; commit its `evals/results/` with any change to shipped files. Never run `run.mjs` without `--dry-run` unless the user approves the spend. See `evals/README.md`.
- `src/content/docs/start-here/writing-instructions.md`: the research-backed guide to writing instructions LLMs follow, published at `/start-here/writing-instructions/`.

## Writing rules

Before writing or changing a file in `instructions/`, `stacks/` or `templates/`, read `src/content/docs/start-here/writing-instructions.md`; the rules below apply it to Devbook and win where they differ. Don't add `.claude/rules/` or other auto-loaded agent files here: projects that use the submodule would load them too.

1. One imperative rule per bullet, starting with its stable ID (`CORE-01`; never reuse a retired ID), concrete enough that a reviewer can check it. Add a one-clause reason when the rule is not obvious, because models generalise from the why.
2. Say what to do. Pair every "never" with the alternative, and every "always" with what to do when it can't be done.
3. Pass the deletion test: keep a rule only if a capable model would otherwise get it wrong. No preamble, filler or rules models follow by default.
4. Normal tone. No capitals, "CRITICAL" or "MUST" for emphasis, because current models over-apply it.
5. Each rule lives in one file. Link to it instead of restating it, so copies can't drift into contradictions.
6. Examples only where a format or shape matters, such as templates, and then a few consistent ones.
7. Keep each instruction file under about 8 KB, and the sets within the budgets in `devbook.manifest.json` (the always tier 9 KB, a typical website 35 KB). Budgets only go down: `check-budget.mjs` fails a raised budget unless the same change commits `evals/results/` showing no pass-rate loss against the last `main` or `stable` result.
8. No version numbers for tools. Tell the reader to check the current official docs. Stack notes carry `lastVerified`.
9. Base rules on primary sources (official docs, standards, recognised guidelines) and list them in the file's `sources:` frontmatter. Never invent facts, standards or statistics. Paraphrase sources; don't copy them.
10. Frontmatter: a `title`, a 120–160 character `description`, `sidebar.order` and, for instructions, `sources:`. No H1 in the body; the title is the heading.
11. Stack-agnostic instructions name no framework. Framework details go in `stacks/`.

## Before you finish

- [ ] `npm run check` passes.
- [ ] The change follows Devbook's own rules, read from `instructions/`: core, security and testing always; `design.md` for UI and styles; `seo.md` for pages, URLs, metadata and site config; `content.md` for any page text, guides or changelog; `performance.md` for pages and scripts. Fix what doesn't pass and say which files you checked.
- [ ] For any change to pages, layouts, `astro.config.mjs` or `public/`, run `npm run build` and follow `skills/devbook-seo-audit/SKILL.md` against `dist/`. Fix every finding before you commit or merge.
- [ ] Changed instruction text passes the review checklist in `src/content/docs/start-here/writing-instructions.md`.
- [ ] If you renamed or added a file (including a skill), update `devbook.manifest.json`, `skills/devbook-setup/SKILL.md`, `templates/AGENTS.md`, `templates/setup-prompt.md`, the homepage cards and the table in `start-here/how-it-works.md`. If a file's size changed noticeably, update the cost table there too.
- [ ] If you removed a URL, add a 301 to `public/_redirects`.
- [ ] Never rename or delete a file in `instructions/`, `stacks/`, `skills/` or `templates/`, because projects import and link them by path and a missing `@` file fails silently. If one must go, keep it as a one-line pointer to its replacement and add an **Upgrade** note to the changelog.
- [ ] `instructions/`, `stacks/`, `skills/` and the `start-here/` guides are CC BY 4.0; `templates/`, `kit/` and code are MIT-0. Never move text between them without updating `/license/`.
- [ ] Add a dated entry to `CHANGELOG.md` for any change to `instructions/`, `stacks/`, `skills/`, `templates/` or `kit/`. Don't edit `VERSION`, create tags or push to `stable`: the Release workflow does that when shipped files change and the gates pass (`DEPLOY.md`).
