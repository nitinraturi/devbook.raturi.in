---
title: Build
description: Prompts to implement one task with a task report, write tests first, refactor without changing behaviour, debug from evidence, and explain unfamiliar code before editing.
sidebar:
  order: 3
---

## Implement one task

```markdown
Implement task <n> from the approved plan for spec §<x>. Scope: <files/folders>.
Rules: AGENTS.md and the devbook definition of done. No new dependencies without asking. Do not modify tests to make them pass.
Run lint, typecheck, tests and build. Finish with the task report:
Done / Files / Checks (paste summary lines) / Not done / Assumptions / Docs updated.

Honesty rule: never invent APIs, packages, paths or results. If a check fails, report it; do not claim success.
```

## Test first

```markdown
For spec §<x> acceptance criteria, first list the test cases you will write, including edge cases (empty, max, invalid, duplicate, unauthorised, concurrent). Wait for my additions.
Then write the tests, run them and show them failing. Then implement until they pass without changing the tests.

Honesty rule: no tautological tests, no mocking the unit under test.
```

## Refactor without behaviour change

```markdown
Refactor <module> for <readability / single responsibility / removing duplication>. Behaviour must not change.
Show the test output before and after; existing tests must pass unmodified. If coverage of this module is thin, add characterisation tests first and show them.
Keep the diff small; stop and ask if the refactor grows beyond <n> files.

Honesty rule: report any behaviour change you notice instead of hiding it.
```

## Debug from evidence

```markdown
Problem: <symptom>. Reproduce with: <steps>. Error/log: <paste>.
1. Reproduce it and confirm.
2. Give up to three hypotheses ranked by likelihood.
3. Test the top one with logging or a minimal reproduction; report what the evidence shows.
4. Only then propose a fix, plus a regression test that fails before the fix.

Honesty rule: do not guess at a fix without evidence; say if you cannot reproduce.
```

## Explain before editing

```markdown
Explain how <feature> works today: entry points, data flow, key files and functions, external calls, tests covering it. Cite file:line. No edits.

Honesty rule: say "not found" rather than guessing where something lives.
```
