# Devbook

A few short instruction files that make AI coding assistants (Claude, Copilot and others) build like a senior engineer. Site: https://devbook.raturi.in

| File | Covers | Load when |
|---|---|---|
| `instructions/core.md` | understand first, stay current, design principles, project structure, naming, code, docs and decisions, git, done | always (mandatory) |
| `instructions/security.md` | secure defaults, auth, headers, secrets, dependencies, privacy, LLM features | always (mandatory) |
| `instructions/testing.md` | what to test, test levels, deterministic tests, CI gates | always (mandatory) |
| `instructions/performance.md` | budgets, Core Web Vitals, back-end efficiency, caching, reliability | any app, site or service |
| `instructions/api-data.md` | API contracts, errors, pagination, migrations, backups | backend, API or database |
| `instructions/design.md` | hierarchy, layout, type, colour, tokens, components, forms, motion, WCAG 2.2 AA | the project has a UI |
| `instructions/seo.md` | Google Search Central: crawling, indexing, titles, links, structured data, spam policies | public website |
| `instructions/content.md` | voice, structure, facts, trust, AI editorial policy | public website or blog |
| `instructions/mobile.md` | mobile-app rules | mobile app |
| `stacks/*.md` | Astro, Starlight, Cloudflare, TypeScript, Django, GA4, three.js | you use that technology |

## Use it in a project

Paste [`templates/setup-prompt.md`](templates/setup-prompt.md) into Claude Code or Copilot agent mode inside your project. The prompt walks the assistant through these steps:

1. Add Devbook at `.devbook/`. The default is a submodule that tracks `main`. Set `Method: copy` to download plain files you commit instead.
2. Create or merge a root `AGENTS.md`. It has your project section, then `@.devbook/...` lines for the files that apply.
3. Create a `CLAUDE.md` containing `@AGENTS.md`, and a `.github/copilot-instructions.md` that tells Copilot to read the files `AGENTS.md` lists.

To update a submodule, run `git submodule update --remote .devbook`. For a copy, rerun the download command on the setup page. Project rules in `AGENTS.md` override Devbook. See the [setup page](https://devbook.raturi.in/start-here/setup/) for manual steps, how the instructions load and their limits.

## Develop the site

Requires Node.js 22.23.4 or later.

```bash
npm ci
npm run dev
npm run check
```

Contributor rules are in [`AGENTS.md`](AGENTS.md), deployment in [`DEPLOY.md`](DEPLOY.md) and changes in [`CHANGELOG.md`](CHANGELOG.md).

## License

[MIT No Attribution (MIT-0)](LICENSE). Copy, change and redistribute the instructions in any project, commercial or not, without keeping a notice.
