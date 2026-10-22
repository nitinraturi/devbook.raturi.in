# AGENTS.md — <project name>

<One sentence: what this project is and who it is for.>

## Standards
This project follows **devbook @ v<X.Y.Z>** (pinned at `docs/devbook/`). Precedence: this file and `docs/` > devbook stack profiles > devbook universal rules.

Read before any task:
- `docs/devbook/src/content/docs/workflow/llm-assisted-workflow.md`
- `docs/devbook/src/content/docs/workflow/definition-of-done.md`
- `docs/devbook/src/content/docs/security/security-baseline.md`
- <add only the devbook pages this project uses, e.g. stacks/astro.md, stacks/cloudflare.md, web/technical-seo.md, web/content-standards.md>

Project docs:
- `docs/project-brief.md` — what and why
- `docs/technical-spec.md` — how; acceptance criteria per feature
- `docs/adr/` — decisions
- <design-system.md, domain-rules.md, research/… as applicable>

## Stack
- <language + version>, <framework + version>, <hosting>, <database>, <package manager>

## Commands
```bash
<install>        # e.g. npm ci
<dev>            # e.g. npm run dev
<lint>           # e.g. npm run lint
<typecheck>      # e.g. npm run typecheck
<test>           # e.g. npm test
<e2e>            # e.g. npm run test:e2e
<build>          # e.g. npm run build
```
Run lint, typecheck, test and build before reporting a task as done. Paste the summary output.

## Layout
```
<short tree of the important folders and what lives where>
```

## Conventions
- <naming, file placement, test location, component patterns>
- <how content/data is added>
- <units, dates, money conventions>

## Never
- Never invent facts, APIs, packages, file paths, test results, citations, people or credentials. Ask, or leave `TODO(<area>)` and report it.
- Never add a dependency without asking.
- Never weaken or delete a test to make it pass.
- Never commit secrets or put them in prompts, logs or client code.
- Never touch <auth / payments / migrations / infra / production data> without an approved plan.
- <project-specific never-rules>

## Workflow
1. Read the spec section for the task. If acceptance criteria are missing or unclear, ask.
2. Propose a plan (tasks, files, risks, questions) and wait for approval on non-trivial work.
3. One small task at a time; run checks; report with the task-report format from the devbook workflow page.
4. Update docs, ADRs and the changelog in the same change.

## Known pitfalls
- <add a line here every time an agent makes the same mistake twice>
