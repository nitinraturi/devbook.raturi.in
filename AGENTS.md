# AGENTS.md: working on devbook.raturi.in

Devbook is a small set of instruction files that other projects load into Claude and Copilot through a git submodule at `.devbook/`. Every word ships into every session of every project, so keep it short, correct and current.

## Commands

```bash
npm ci
npm run dev      # local preview
npm run check    # typecheck, descriptions, contrast, build (link validation), Playwright + axe
npm run lhci     # Lighthouse budgets
```

## Layout

- `instructions/*.md`: the product. Always-on rules (workflow, engineering, security, design, seo, content) plus optional `mobile`. They are rendered on the site through the symlink `src/content/docs/instructions`.
- `stacks/*.md`: short notes for one technology each, also rendered through a symlink.
- `templates/`: `setup-prompt.md` (shown on the homepage), `AGENTS.md`, `CLAUDE.md` and `copilot-instructions.md`. Pages import them with `?raw`; never copy template text into a page.
- `src/content/docs/`: the homepage, `start-here/setup.mdx`, contact and privacy pages only.

## Writing rules

1. One imperative rule per bullet. No preamble, no examples unless the rule is unclear without one.
2. Add a rule only if a capable model would otherwise get it wrong. Remove rules that models follow by default.
3. Keep each instruction file under about 4 KB. A typical website should load under about 20 KB in total.
4. No version numbers for tools. Tell the reader to check the current official docs. Stack notes carry `lastVerified`.
5. Never invent facts, standards or statistics. Paraphrase sources; don't copy them.
6. Frontmatter: a `title`, a 120–160 character `description` and `sidebar.order`. No H1 in the body; the title is the heading.
7. Stack-agnostic instructions name no framework. Framework details go in `stacks/`.

## Before you finish

- [ ] `npm run check` passes.
- [ ] If you renamed or added a file, update `templates/AGENTS.md`, `templates/setup-prompt.md` and the homepage cards.
- [ ] If you removed a URL, add a 301 to `public/_redirects`.
- [ ] Add a dated entry to `CHANGELOG.md` for any change to `instructions/`, `stacks/` or `templates/`.
