# AGENTS.md: working on devbook.raturi.in

These rules are only for changing the Devbook repository itself. If you are working in another project that includes Devbook at `.devbook/`, ignore this file and follow that project's root `AGENTS.md`.

Devbook is a small set of instruction files that other projects load into Claude and Copilot through a git submodule at `.devbook/`. Every word ships into every session of every project, so keep it short, correct and current.

## Commands

```bash
npm ci
npm run dev      # local preview
npm run check    # typecheck, descriptions, contrast, build (link validation), Playwright + axe
npm run lhci     # Lighthouse budgets
```

## Layout

- `instructions/*.md`: the product. Mandatory `core`, `security` and `testing`, plus conditional `performance`, `api-data`, `database`, `design`, `seo`, `content`, `mobile`, `licensing` and `feature-docs`. They are rendered on the site through the symlink `src/content/docs/instructions`.
- `stacks/*.md`: short notes for one technology each, also rendered through a symlink.
- `templates/`: `setup-prompt.md` (shown on the homepage), `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md` and `FEATURE.md`. Pages import them with `?raw`; never copy template text into a page.
- `src/content/docs/`: the homepage, the `start-here/` guides (how it works, setup, day-to-day use, writing instructions, contact), license and privacy pages. Instruction and stack pages come through the symlinks.
- `src/content/docs/start-here/writing-instructions.md`: the research-backed guide to writing instructions LLMs follow, published at `/start-here/writing-instructions/`.

## Writing rules

Before writing or changing a file in `instructions/`, `stacks/` or `templates/`, read `src/content/docs/start-here/writing-instructions.md`; the rules below apply it to Devbook and win where they differ. Don't add `.claude/rules/` or other auto-loaded agent files here: projects that use the submodule would load them too.

1. One imperative rule per bullet, concrete enough that a reviewer can check it. Add a one-clause reason when the rule is not obvious, because models generalise from the why.
2. Say what to do. Pair every "never" with the alternative, and every "always" with what to do when it can't be done.
3. Pass the deletion test: keep a rule only if a capable model would otherwise get it wrong. No preamble, filler or rules models follow by default.
4. Normal tone. No capitals, "CRITICAL" or "MUST" for emphasis, because current models over-apply it.
5. Each rule lives in one file. Link to it instead of restating it, so copies can't drift into contradictions.
6. Examples only where a format or shape matters, such as templates, and then a few consistent ones.
7. Keep each instruction file under about 8 KB. The mandatory set stays under about 15 KB and a typical website under about 35 KB.
8. No version numbers for tools. Tell the reader to check the current official docs. Stack notes carry `lastVerified`.
9. Base rules on primary sources (official docs, standards, recognised guidelines) and name them in the file's intro. Never invent facts, standards or statistics. Paraphrase sources; don't copy them.
10. Frontmatter: a `title`, a 120–160 character `description` and `sidebar.order`. No H1 in the body; the title is the heading.
11. Stack-agnostic instructions name no framework. Framework details go in `stacks/`.

## Before you finish

- [ ] `npm run check` passes.
- [ ] Changed instruction text passes the review checklist in `src/content/docs/start-here/writing-instructions.md`.
- [ ] If you renamed or added a file, update `templates/AGENTS.md`, `templates/setup-prompt.md`, the homepage cards and the table in `start-here/how-it-works.md`. If a file's size changed noticeably, update the cost table there too.
- [ ] If you removed a URL, add a 301 to `public/_redirects`.
- [ ] Never rename or delete a file in `instructions/`, `stacks/` or `templates/`, because projects import them by path and a missing `@` file fails silently. If one must go, keep it as a one-line pointer to its replacement and add an **Upgrade** note to the changelog.
- [ ] `instructions/`, `stacks/` and the `start-here/` guides are CC BY 4.0; `templates/` and code are MIT-0. Never move text between them without updating `/license/`.
- [ ] Add a dated entry to `CHANGELOG.md` for any change to `instructions/`, `stacks/` or `templates/`.
