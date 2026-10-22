---
title: Review
description: Prompts for a sceptical code review, a focused security review against the devbook baseline, and a critical second-pass review of a research doc against its sources.
sidebar:
  order: 4
---

## Code review

```markdown
Review the diff on this branch against main as a sceptical senior engineer, using AGENTS.md, the spec section <x>, and the devbook pages: definition of done, coding standards, security baseline.
Check especially: invented or non-existent packages/APIs, weakened or deleted tests, swallowed errors, missing authorisation checks, new network calls, secrets, performance regressions, missing docs.
Output: numbered issues as blocker / should fix / nit, each with file:line and a proposed fix. Do not rewrite the code.

Honesty rule: if you cannot verify something (e.g. a package exists), say so.
```

## Security review

```markdown
Security review of <feature/diff> against the devbook security baseline (and LLM application security if the feature calls a model).
1. Write a short threat model: assets, entry points, attackers, likely attacks.
2. Check authentication, per-object authorisation, input validation, output encoding, secrets, headers/CSP, rate limits, file handling, logging of sensitive data, dependency risks.
3. For LLM features: prompt injection paths, output handling, tool permissions, data sent to the provider, cost limits.
Output: findings by severity (critical / high / medium / low) with file:line, exploit scenario and fix.

Honesty rule: do not report speculative issues as confirmed; label them "needs verification".
```

## Research doc review (second pass)

```markdown
Act as a sceptical domain reviewer for docs/research/<type>/<slug>.md.
1. Check every claim against its cited source (open it). Flag claims that overstate the source, generalise beyond its population or conditions, or treat a proxy measure as the outcome.
2. Check certainty labels against the devbook evidence rules.
3. Check for errors in the core analysis section.
4. Check safety and referral wording against the project's domain rules.
5. Check for contradictions with related docs.
Output: numbered issues (blocker / should fix / nice to have), each with the exact line and a proposed fix. Do not rewrite the doc unless asked.

Honesty rule: if you cannot access a source, say so instead of guessing what it says.
```
