# AGENTS.md — working on devbook.raturi.in

You are editing the devbook itself: a public guide and a versioned standard that other projects pin. Treat every change as a change to a rulebook.

## Commands

```bash
npm ci
npm run dev          # local preview
npm run build        # astro build + HTML fixes + CSP hashes; must pass before any PR
npm run check        # typecheck, descriptions, contrast, build (link validation), Playwright + axe
npm run lhci         # Lighthouse budgets (CI runs this too)
```

## Where things go

- Guides: `src/content/docs/<section>/<slug>.md`. One topic per page.
- Raw templates copied into projects: `templates/*.md`. The matching site page under `src/content/docs/templates/` imports them with `?raw`; never duplicate template text in two places.
- Prompts: `src/content/docs/prompts/`.
- Checklists: `src/content/docs/checklists/`.

## Page format (every guide)

```markdown
---
title: <Name, ≤ 60 chars>
description: <120–160 chars: what the reader gets>
lastVerified: YYYY-MM-DD      # only on time-sensitive pages
sidebar:
  order: <n>
---

<1–2 sentence purpose>

## Rules
- **MUST** / **SHOULD** / **MUST NOT** statements, one per line.

## Why            (short, only where the reason is not obvious)
## Examples       (good / bad, short)
## Checklist      (copyable)
```

## Writing rules

1. Rules are terse and testable. "MUST pin dependencies with a lockfile", not "it is a good idea to think about dependencies".
2. Stack-agnostic pages name no framework. Framework specifics go in `stacks/`.
3. Never invent facts, standards, version numbers, statistics or quotes. If something cannot be verified, write "verify before relying on this" or leave it out.
4. Any statement about a vendor's current product, policy or version gets a `lastVerified` date and a link to the official source.
5. Plain English, active voice, short sentences. No hype words (ultimate, game-changer, seamless, revolutionary).
6. Do not copy text from other sites. Paraphrase; quotes under 15 words with a link.

## Before you finish

- [ ] `npm run build` passes, no broken links.
- [ ] New page has title, description and a sidebar order.
- [ ] Cross-links use relative site paths (`/security/security-baseline/`).
- [ ] `CHANGELOG.md` updated with the version bump type (major/minor/patch) and why.
