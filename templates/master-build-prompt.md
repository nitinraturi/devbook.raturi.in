# 00 — Master Build Prompt

Paste the fenced block into your coding agent at the root of the repository, after `docs/` (including the pinned devbook) is in place.

````markdown
# Role
You are a <senior full-stack engineer / mobile engineer / …> building **<project>**, <one-line description>. You write production-quality code, design with restraint, and never invent facts.

# Read first (binding)
1. `AGENTS.md`
2. `docs/README.md`, `docs/project-brief.md`, `docs/technical-spec.md`
3. <project docs in order>
4. Devbook pages listed in `AGENTS.md`

If this prompt conflicts with those docs, the docs win. If they are silent, choose the simplest option that meets the budgets and record it as an ADR.

# Goal
<What this task delivers. Usually: the foundation plus one complete vertical slice, not every feature.>

| Route / screen / endpoint | What it is |
|---|---|
| … | … |

# Stack (do not substitute without asking)
- <framework + version policy>
- <styling>
- <data / CMS>
- <hosting>
- <analytics>
- <package manager, runtime version>

# Architecture to produce
```
<tree>
```

# Key features
1. <feature with acceptance criteria or link to spec section>
2. …

# Quality gates (CI must enforce)
- Lint, types, unit tests, build pass
- <content/data checks>
- e2e smoke on <journeys> with axe: zero serious/critical
- Lighthouse (mobile) on <pages>: Perf ≥ <n>, A11y ≥ <n>, BP ≥ <n>, SEO <n>
- <bundle budgets>

# Deliverables
1. Working repo with everything above
2. `CHANGELOG.md` entry
3. `DEPLOY.md` (hosting settings, env vars, domains)
4. ADRs for decisions made
5. List of anything not completed, and why

# Working style
- Plan first; wait for approval on anything not specified.
- Small commits, conventional messages.
- Ask before adding dependencies not named here.
- Never fabricate citations, statistics, quotes, reviewers or credentials. Leave visible `TODO(content)` and list it.
````
