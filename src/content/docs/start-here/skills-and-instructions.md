---
title: Use each skill and instruction
description: Exactly how to use every Devbook skill and instruction file - what to type, what the assistant does, where it stops for you and what you get back.
sidebar:
  order: 4
---

This page covers each Devbook file in turn. Skills are jobs you start. Instruction files are rules that load on their own, so for them the page tells you what changes and how to check it. For the general picture, see [How Devbook works](/start-here/how-it-works/).

## Skills

Every skill below is used the same way:

1. **Check it's linked.** Run `ls .claude/skills`. Setup links only the skills that fit your project; to add one, see [Choose which skills are linked](/start-here/using-devbook/#choose-which-skills-are-linked).
2. **Start it.** In Claude Code, type the slash command followed by your request. In Copilot, start your message with "Use the `<skill name>` skill." A plain request in the words of the "Use it when" line usually works too, but naming the skill is the only way to be sure.
3. **Answer when it stops.** Each skill pauses at the points listed under "It stops for you". Reply yes, no or with changes.
4. **Read the report.** Each skill ends with the items listed under "You get". Nothing is committed unless you ask.

### devbook-api-endpoint

- **Use it when:** you add, change or remove a REST endpoint, route or webhook.
- **Linked when:** the project has a backend or API.
- **Type:**
  ```text
  /devbook-api-endpoint Add POST /orders that creates an order for the
  signed-in customer. Body: items (product_id, quantity). Only the customer
  can see their own orders.
  ```
- **Give it:** the method and path, who may call it, the fields in and out, and any limits.
- **It does:** updates the OpenAPI document first, then writes the handler with server-side access checks, schema validation, problem-details errors, pagination for lists and idempotency keys for retried creates, then writes contract tests.
- **It stops for you:** when the change would break existing clients, such as a removed field or a changed type.
- **You get:** the endpoint, its tests, updated API docs and changelog, and open questions.

### devbook-db-migration

- **Use it when:** you add, change or remove tables, columns, indexes or constraints, or move data.
- **Linked when:** the project uses a relational database.
- **Type:**
  ```text
  /devbook-db-migration Add a required status column to orders
  (pending, paid, shipped, cancelled). The table has about 2 million rows.
  ```
- **Give it:** what should change, the rough table size, and whether the table is live.
- **It does:** plans the entities, constraints, indexes and the queries they serve. For a live table, it plans the change in safe stages across deploys. After you approve, it changes the model, generates the migration with your tool, reads the SQL for long locks, and runs it on a fresh database and a copy of the current schema.
- **It stops for you:** after the plan, before writing any migration. Every schema change needs your approval.
- **You get:** the migration, any risky SQL statements, the deploy order and the rollback plan.

### devbook-feature-doc

- **Use it when:** you want a feature documented, or before you build a feature with business rules, states, permissions, money or integrations.
- **Linked when:** the project uses the feature-docs instruction.
- **Type:**
  ```text
  /devbook-feature-doc Write a feature doc for checkout from the current code.
  ```
  or, before building something new:
  ```text
  /devbook-feature-doc Plan a feature doc for refunds: who can refund,
  partial refunds, and what happens to the invoice.
  ```
- **It does:** decides whether the feature needs a doc (simple CRUD doesn't), then writes `FEATURE.md` with purpose, numbered rules, flow and a map of the files. For existing code it writes what the code does, not what it should do. It adds the doc to the Features line in `AGENTS.md`.
- **It stops for you:** for a new feature, after Purpose, Rules and Flow, before any code is written.
- **You get:** the doc path, rules that have no test, places where doc and code disagree, and open questions.

### devbook-security-review

- **Use it when:** before merging anything touching auth, payments, user data, file uploads or LLM features, or before a release.
- **Linked in:** every project.
- **Type:**
  ```text
  /devbook-security-review Review this branch against main.
  ```
  To narrow it: `/devbook-security-review Review src/billing/ only.`
- **It does:** reads every changed file in full and checks access control, input validation, injection, output escaping, secrets, auth and sessions, headers, new dependencies, personal data and LLM use. It runs your dependency audit and secret scanner if you have them.
- **It stops for you:** it doesn't change code. Ask for fixes afterwards.
- **You get:** findings ordered by severity, each with the rule ID, `file:line`, what can go wrong and the fix, plus what it checked and found clean and what it couldn't check.

### devbook-release-check

- **Use it when:** before tagging a release or deploying.
- **Linked in:** every project.
- **Type:**
  ```text
  /devbook-release-check Are we ready to release since the v1.4.0 tag?
  ```
- **It does:** runs format, lint, typecheck, tests and build and stops at the first failure. It runs the dependency audit and secret scan, checks the changelog covers every change since the last tag, and reviews migrations and rollback. For web projects it also checks headers, performance budgets, accessibility and launch checks. It also checks monitoring.
- **It stops for you:** it never tags, pushes or deploys. Do that yourself, or ask for it.
- **You get:** a go or no-go with every blocking item, the non-blocking items, and draft release notes.

### devbook-seo-audit

- **Use it when:** before launching a public site, migrating URLs, or when pages aren't showing in search.
- **Linked when:** the project uses the SEO instruction.
- **Type:**
  ```text
  /devbook-seo-audit Audit the built site.
  ```
  or, for a live site: `/devbook-seo-audit Audit https://example.com.`
- **It does:** builds and serves the site, or fetches the URL you give. It checks `robots.txt`, the sitemap, the home page, one page per template and a missing URL for status codes, redirects, canonicals, titles, links, alt text and structured data.
- **It stops for you:** it doesn't change code. Search Console and the Rich Results Test are listed as manual checks unless you have access.
- **You get:** findings by template with rule ID, URL, problem and fix, most impactful first.

### devbook-upgrade

- **Use it when:** you want to know whether a newer Devbook exists, or to move to it.
- **Linked in:** every project, and listed in `AGENTS.md`, so a plain question works.
- **Type:**
  ```text
  /devbook-upgrade
  ```
  or just: "Is Devbook up to date?"
- **It does:** compares your version with the newest release and summarises the changelog in between, including each **Upgrade** note that needs a change in your project. After you agree, it moves `.devbook/` to the new release and applies those notes.
- **It stops for you:** after the summary, before changing anything.
- **You get:** the old and new versions, the files changed, the notes applied or skipped, and a reminder to review, commit and start a new chat.

### devbook-setup

The setup prompt runs this skill. It is not linked into `.claude/skills/`, so there is no slash command. To re-run or repair setup, paste the [setup prompt](/start-here/setup/) again. It keeps your existing method, version and `AGENTS.md` content, and lists any conflicts for you to decide.

## Instruction files

You never start an instruction file. Each one loads at the moment shown below, and the assistant follows it without being asked. To check that a file is in use, ask "Which Devbook rules apply to this change?" after the assistant has opened a matching file. To change how the assistant applies a rule, add an override to the Project section of `AGENTS.md`, as in [Add your own rules](/start-here/using-devbook/#add-your-own-rules).

### Every chat: core, security, testing

These load at the start of every chat in every project.

| File | What you'll notice | Example of what to say |
|---|---|---|
| [Core](/instructions/core/) | It runs your checks and shows the output, asks before risky changes (auth, payments, migrations, secrets, infrastructure), proposes a plan for big work, and ends with what it did and didn't do. It never commits unless asked. | "Add CSV export to invoices. Done when the export downloads and `npm run check` passes." |
| [Security](/instructions/security/) | Every endpoint checks who owns the data, every outside input is validated, and secrets never go into code or logs. | Nothing extra. Ask for `/devbook-security-review` before merging sensitive work. |
| [Testing](/instructions/testing/) | Each acceptance criterion gets a test, and a bug fix starts with a failing test. | "Fix the double-charge bug. Write a failing test first." |

### When a matching file is opened

These load when the assistant reads or edits a file that matches the paths listed, if setup linked them. If your files live elsewhere, the "read" line in `AGENTS.md` still points the assistant to them.

| File | Loads for files like | What you'll notice |
|---|---|---|
| [Design](/instructions/design/) | `*.css`, `*.html`, `*.tsx`, `*.vue`, `*.svelte`, `*.astro` | It asks for a design direction before the first screen, builds mobile first at 360 px, uses design tokens and checks WCAG 2.2 AA. |
| [REST APIs](/instructions/api-data/) | `api/`, `routes/`, `controllers/`, `handlers/`, `views.py`, `urls.py`, `openapi*.yaml` | It updates the OpenAPI document first, uses problem-details errors, paginates lists and asks before breaking changes. |
| [Databases](/instructions/database/) | `migrations/`, `models/`, `models.py`, `*.sql`, `schema.prisma`, `db/` | It declares constraints in the database, names them, stores money and time safely and plans live changes in stages. |
| [SEO](/instructions/seo/) | `pages/`, `layouts/`, `*.html`, `robots.txt`, `sitemap*`, `_redirects` | It adds canonicals, unique titles and 301 redirects for changed URLs, and keeps previews out of the index. |
| [Content](/instructions/content/) | `*.mdx`, `content/`, `docs/**/*.md`, `blog/`, `locales/`, `README.md` | It uses only real facts with sources, answers first, cuts hype words and adds author and dates to articles. |
| [Mobile](/instructions/mobile/) | `*.swift`, `*.kt`, `*.dart`, `ios/`, `android/` | It uses the secure store for tokens, handles offline states, asks for permissions only when needed and checks store policies. |

### When the task calls for it

The assistant opens these when your task matches the line for them in `AGENTS.md`. To be sure one is used, name it: "Follow the performance instruction for this."

| File | Read when the task involves | What you'll notice |
|---|---|---|
| [Performance](/instructions/performance/) | pages, endpoints, queries, caching or deploys | It measures before optimising, adds timeouts to network calls, avoids N+1 queries and moves slow work into background jobs. |
| [Licensing](/instructions/licensing/) | adding dependencies, assets or copied code, or licence files | It checks the licence of each dependency, font and image, records where assets came from and never picks your licence for you. |
| [Feature docs](/instructions/feature-docs/) | building or changing a feature with business rules | It reads the feature's `FEATURE.md` before the code and updates it in the same change. Use `/devbook-feature-doc` to create one. |
| [Stack notes](/stacks/astro/) | work on a technology with a note | It uses that tool's current conventions and checks its official docs. |
