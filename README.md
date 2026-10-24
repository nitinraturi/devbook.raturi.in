# Devbook

A few short instruction files that make AI coding assistants (Claude, Copilot and others) build like a senior engineer. Site: https://devbook.raturi.in

| File | Covers | Load when |
|---|---|---|
| `instructions/core.md` | understand first, stay current, design principles, project structure, naming, code, docs and decisions, git, done | always (mandatory) |
| `instructions/security.md` | secure defaults, auth, headers, secrets, dependencies, privacy, LLM features | always (mandatory) |
| `instructions/testing.md` | what to test, test levels, deterministic tests, CI gates | always (mandatory) |
| `instructions/performance.md` | budgets, Core Web Vitals, back-end efficiency, caching, reliability | any app, site or service |
| `instructions/api-data.md` | REST API design: contract first, resources and URLs, methods and status codes, payloads, problem-details errors, pagination, idempotency, ETags and caching, versioning and deprecation, OWASP API Top 10, webhooks | backend or API |
| `instructions/database.md` | modelling, naming, keys, types, constraints, relationships, indexes, concurrency, migrations, backups | relational database |
| `instructions/design.md` | design direction, craft, hierarchy, layout, type, colour, tokens, components, forms, motion, WCAG 2.2 AA | the project has a UI |
| `instructions/seo.md` | Google Search Central: crawling, indexing, titles, links, structured data, spam policies | public website |
| `instructions/content.md` | voice, structure, facts, trust, AI editorial policy | public website or blog |
| `instructions/mobile.md` | mobile-app rules | mobile app |
| `instructions/licensing.md` | project licence, SPDX, dependency and asset licences, notices, copied code | published or distributed project, or third-party code and assets |
| `instructions/feature-docs.md` | when to write a feature doc, where it lives, EARS rules with IDs, flow, file map, keeping it in sync | app or service with business rules |
| `stacks/*.md` | Astro, Starlight, Cloudflare, TypeScript, Django, GA4, three.js | you use that technology |

## Use it in a project

Paste [`templates/setup-prompt.md`](templates/setup-prompt.md) into Claude Code or Copilot agent mode inside your project. The prompt walks the assistant through these steps:

1. Add Devbook at `.devbook/`. The default is a submodule that tracks `main`. Set `Method: copy` to download plain files you commit instead.
2. Create or merge a root `AGENTS.md`. It has your project section, then `@.devbook/...` lines for the files that apply.
3. Create a `CLAUDE.md` containing `@AGENTS.md`, and a `.github/copilot-instructions.md` that tells Copilot to read the files `AGENTS.md` lists.

To update a submodule, run `git submodule update --remote .devbook`. For a copy, rerun the download command on the setup page. Project rules in `AGENTS.md` override Devbook. See the [setup page](https://devbook.raturi.in/start-here/setup/) for manual steps.

New to instruction files? Read [How Devbook works](https://devbook.raturi.in/start-here/how-it-works/) for the terms, loading, precedence, cost and limits. Then read [Use Devbook day to day](https://devbook.raturi.in/start-here/using-devbook/) for your own rules, checks, updates and troubleshooting, and [Writing instructions](https://devbook.raturi.in/start-here/writing-instructions/) for writing rules and prompts that models follow.

## Develop the site

Requires Node.js 22.23.4 or later.

```bash
npm ci
npm run dev
npm run check
```

Contributor rules are in [`AGENTS.md`](AGENTS.md), and every instruction change follows the [writing guide](src/content/docs/start-here/writing-instructions.md). Deployment is in [`DEPLOY.md`](DEPLOY.md) and changes are in [`CHANGELOG.md`](CHANGELOG.md).

## License

- `instructions/` and `stacks/`: [CC BY 4.0](LICENSE-CC-BY-4.0). Reuse and change them with credit. Keeping `.devbook/` with its license file counts as credit.
- `templates/` and the site code: [MIT No Attribution (MIT-0)](LICENSE). No notice needed.

See the [license page](https://devbook.raturi.in/license/) for how to give credit.
