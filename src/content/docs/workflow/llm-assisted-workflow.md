---
title: LLM-assisted workflow
description: The end-to-end loop for building with an AI coding agent, from brief and spec to small verified tasks, review, commit and doc updates, with human gates.
sidebar:
  order: 1
---

AI agents write code quickly and confidently, including wrong code. This loop keeps speed while keeping a human in control of what ships.

## The loop

```
Brief → Spec → Plan → Task → Generate → Verify → Review → Commit → Update docs
  ▲                       │                                          │
  └──────── learnings feed back into spec, AGENTS.md, devbook ◄──────┘
```

| Stage | Who | Output | Gate |
|---|---|---|---|
| **Brief** | Human | `project-brief.md` | Human agrees on problem, users, non-goals |
| **Spec** | Human + agent | Section of `technical-spec.md` with acceptance criteria | Human approves |
| **Plan** | Agent | Ordered list of small tasks, files touched, risks, open questions | Human approves before code |
| **Task** | Agent | One small change (aim for a diff a person can review in about 10 minutes) | — |
| **Generate** | Agent | Code + tests + doc changes | — |
| **Verify** | Agent, then CI | Lint, types, tests, build, checks all green; evidence pasted | Must pass |
| **Review** | Human | Read every line; run it | Human approves |
| **Commit** | Agent or human | Conventional commit | — |
| **Update docs** | Agent | Spec, ADRs, `AGENTS.md`, changelog | Part of definition of done |

## Rules

### Before code
- Every change **MUST** trace to a spec section with acceptance criteria.
- The agent **MUST** produce a plan and wait for approval before writing code for any task that touches more than a few files, data, auth, payments or infrastructure.
- The agent **MUST** ask when the spec is ambiguous instead of assuming. It lists assumptions it would make so the human can confirm or correct.

### During code
- One task at a time. Each task **SHOULD** be a diff a person can review comfortably; split anything larger.
- The agent **MUST** run the project's checks and show the results, not claim they pass.
- The agent **MUST NOT** add a dependency without asking, and **MUST** confirm any new package exists, is maintained and has an acceptable licence (see [supply chain](/security/supply-chain/)).
- The agent **MUST NOT** leave stubs, `TODO`s or placeholder logic silently. Unfinished parts are listed in the task report.
- The agent **MUST NOT** weaken or delete a test to make it pass. A failing test is a finding.

### Never fully delegated
A human **MUST** personally review and approve changes to: authentication and authorisation, payments and money, database migrations and deletes, secrets and infrastructure config, security headers and CSP, anything legal or medical in content, and production data access.

### After code
- Docs **MUST** change in the same pull request as the behaviour they describe.
- When a mistake recurs, add a rule to `AGENTS.md` (project-specific) or propose one to the devbook (general).

## Context management

- Give the agent the **minimum relevant context**: `AGENTS.md`, the spec section, the files it will touch, and the devbook pages that apply. More context is not better; unrelated material lowers quality.
- Start a **fresh session** when switching to an unrelated task, after a long debugging detour, or when the agent starts repeating mistakes.
- Keep long-lived knowledge in files (spec, ADRs, `AGENTS.md`), not in chat history. Chat history is temporary; the repo is the memory.
- For large codebases, ask the agent to locate relevant files first and report back before it edits anything.

## Task report (agent output at the end of each task)

```markdown
**Done:** what changed, in 2–4 bullets
**Files:** list
**Checks:** lint ✓ types ✓ tests ✓ (N passed) build ✓ — paste the summary lines
**Not done / follow-ups:** list, or "none"
**Assumptions made:** list, or "none"
**Docs updated:** list
```

## Checklist
- [ ] Spec section with acceptance criteria exists
- [ ] Plan approved
- [ ] Diff small enough to review
- [ ] Checks run and output shown
- [ ] Human read every line of sensitive changes
- [ ] Docs and changelog updated
