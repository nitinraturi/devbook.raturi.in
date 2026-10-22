---
title: Prompting patterns
description: Reusable ways to instruct a coding agent, plan first, ask before assuming, test first, evidence-based debugging, plus the anti-patterns that cause bad output.
sidebar:
  order: 2
---

Good prompts for coding agents are specific about the goal, the constraints, the files and how to prove the work is done. Ready-made prompts are in the [prompt library](/prompts/overview/).

## Rules

- A prompt **MUST** state: the goal, where the rules are (`AGENTS.md`, spec section), what done looks like, and what the agent must not do.
- A prompt **SHOULD** name the files or folders in scope.
- Every prompt that can produce facts **MUST** carry the honesty rule (below).
- Prompts used more than twice **SHOULD** be saved in the project's prompt file or proposed to the devbook prompt library.

## The honesty rule (paste into every prompt)

> Never invent facts, APIs, packages, file paths, test results, citations, statistics, quotes, people or credentials. If you are unsure, say so and ask. If something is missing, leave a visible `TODO(<area>)` and list it in your report.

## Patterns

**Plan first**
> Read `AGENTS.md` and spec §4.2. Do not write code yet. Give me: the tasks in order, files each touches, risks, and questions. Wait for my approval.

**Ask before assuming**
> Before starting, list every assumption you would need to make. Ask me about any that would change the design.

**Test first**
> Write failing tests for the acceptance criteria in spec §4.2. Show them failing. Then implement until they pass. Do not change the tests to make them pass.

**Refactor without behaviour change**
> Refactor `<module>` for readability. Behaviour must not change: existing tests must pass unmodified. Show the test output before and after.

**Debug with evidence**
> Here is the error and how to reproduce it. Form at most three hypotheses, rank them, and test the most likely one first by adding logging or a minimal reproduction. Report what the evidence showed before proposing a fix.

**Review**
> Review this diff as a sceptical senior engineer against `AGENTS.md` and the devbook security baseline. List issues as blocker / should fix / nit, each with file:line and a proposed fix. Do not rewrite the code.

**Explain before editing (unfamiliar code)**
> Explain how `<feature>` works today: entry points, data flow, files. No edits.

## Anti-patterns

| Don't | Why | Instead |
|---|---|---|
| "Build the whole app" | Huge unreviewable output, hidden assumptions | Spec → plan → small tasks |
| "Make it better" | No target, endless churn | Name the measurable outcome |
| "Fix the tests" | Agent may weaken tests | "Find why the test fails; fix the code" |
| Pasting the whole repo | Dilutes attention | Point to files; let the agent search |
| Accepting "all tests pass" without output | Agents sometimes report success that did not happen | Require pasted output; CI decides |
| Long chat as memory | Lost between sessions | Write decisions into spec/ADR |
