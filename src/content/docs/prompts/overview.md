---
title: Prompt library
description: How to use the copy-paste prompts for planning, building, reviewing, auditing and writing, including placeholders, the honesty rule and saving project-specific prompts.
sidebar:
  order: 1
---

Copy-paste prompts for recurring work. Replace `<placeholders>`. Every prompt assumes the agent has the repository open with `AGENTS.md` and `docs/`.

| Page | Prompts |
|---|---|
| [Plan and scaffold](/prompts/plan-and-scaffold/) | Brief to spec, plan a feature, scaffold a project |
| [Build](/prompts/build/) | Implement a task, test first, refactor, debug |
| [Review](/prompts/review/) | Code review, security review, research-doc review |
| [Audit](/prompts/audit/) | SEO, performance and accessibility, dependency, docs drift |
| [Content](/prompts/content/) | Research doc, article, update on new evidence |

## Rules
- Every prompt ends with the honesty rule. Do not remove it.
- Ask for evidence (pasted check output, file:line references), not claims.
- Project-specific prompts live in the project's `docs/prompts.md`. Prompts useful across projects are proposed here.

## The honesty rule

> Never invent facts, APIs, packages, file paths, test results, citations, statistics, quotes, people or credentials. If unsure, say so and ask. If something is missing, leave a visible `TODO(<area>)` and list it in your report.
