---
title: Plan and scaffold
description: Prompts to turn a rough idea into a project brief and spec, plan a feature into small reviewable tasks, and scaffold a new project from a master build prompt.
sidebar:
  order: 2
---

## Idea → project brief

```markdown
I want to build: <rough idea, 3–10 lines>.

Using the devbook project-brief template, interview me to fill it in. Ask at most 5 questions at a time, starting with the problem, users and success measures. Do not propose solutions or a stack yet. When done, write docs/project-brief.md and list remaining open questions.

Honesty rule: never invent facts, numbers, users or evidence. Mark guesses as assumptions for me to confirm.
```

## Brief → technical spec (first pass)

```markdown
Read docs/project-brief.md and AGENTS.md. Draft docs/technical-spec.md from the devbook template:
architecture, data model, and one section per v1 feature with user story and testable Given/When/Then acceptance criteria, errors and edge cases, and security notes where auth, money, personal data, uploads or LLM tools are involved.
List every decision that needs an ADR, with 2–3 options each and your recommendation and reasons. Do not write code.

Honesty rule: never invent APIs, packages, limits or prices; mark anything to verify.
```

## Plan a feature

```markdown
Read AGENTS.md and spec §<n>. Do not write code.
Give me:
1. Tasks in order, each small enough to review in about 10 minutes, with files touched.
2. Tests per task mapped to acceptance criteria.
3. Risks and what could break.
4. Questions where the spec is ambiguous, and the assumption you would otherwise make.
Wait for my approval.

Honesty rule: never invent files, APIs or packages; check the repo first.
```

## Scaffold a new project

```markdown
Follow docs/00-master-build-prompt.md exactly. Before writing code:
1. Read every file it lists and summarise the constraints you will follow in 10 bullets.
2. Propose the order of work as small commits.
3. List any dependency you want that is not named in the docs.
Wait for approval, then build commit by commit, running checks after each and reporting results.

Honesty rule: never fabricate content, citations, people or credentials; leave TODO(content) and list it.
```
