# AGENTS.md

## Project
<!-- Project-specific facts and rules. Keep this section short; add to it as the project grows. -->
- What: <one sentence: what this project is and who it is for>
- Stack: <language, framework, hosting, database, package manager>
- Commands: install `<cmd>` · dev `<cmd>` · lint `<cmd>` · typecheck `<cmd>` · test `<cmd>` · build `<cmd>`
- Layout: <where pages, components, content, tests and scripts live>
- Project docs: <links to design system, specs or domain rules, if any>
- Features: <one line per feature doc, `- <feature>: <path to FEATURE.md>`, if any>
- Rules: <project-specific rules; they override Devbook where they say so>

## Devbook
Follow these in every task:

@.devbook/instructions/core.md
@.devbook/instructions/security.md
@.devbook/instructions/testing.md

Before working on the matching kind of change, read the file and follow it. Paths are relative to the repository root.
<!-- Keep only the lines that apply, and delete the rest. -->
- `.devbook/instructions/performance.md`: pages, endpoints, queries, caching or deploys
- `.devbook/instructions/api-data.md`: API endpoints, webhooks or the OpenAPI document
- `.devbook/instructions/database.md`: tables, models, migrations or queries
- `.devbook/instructions/design.md`: UI, styles, components or forms
- `.devbook/instructions/seo.md`: pages, URLs, metadata, sitemaps or structured data
- `.devbook/instructions/content.md`: copy, docs, blog posts or UI text
- `.devbook/instructions/mobile.md`: iOS or Android app code
- `.devbook/instructions/licensing.md`: adding dependencies, assets or copied code, or licence files
- `.devbook/instructions/feature-docs.md`: building or changing a feature with business rules
- `.devbook/stacks/<stack>.md`: work that touches <stack>
- `.devbook/skills/devbook-upgrade/SKILL.md`: when asked whether Devbook is up to date, or to upgrade it

At the start of each session, before the first task, do step 1 of `.devbook/skills/devbook-upgrade/SKILL.md`. If `main` has a newer version, tell the user in one sentence and ask whether to upgrade; upgrade only after a yes. If the check fails, carry on without mentioning it.
