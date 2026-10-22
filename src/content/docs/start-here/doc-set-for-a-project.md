---
title: Docs every project needs
description: The minimum set of documents to write before asking an AI agent to build anything, which ones are conditional, and when each one gets updated.
sidebar:
  order: 3
---

An agent can only follow decisions that are written down. These documents are the minimum before the first line of code.

## Required for every project

| Document | Purpose | Template | Updated when |
|---|---|---|---|
| `AGENTS.md` | Commands, stack, conventions, never-do rules, links to devbook pages | [AGENTS.md](/templates/agents-md/) | Any convention or command changes |
| `docs/project-brief.md` | Problem, users, scope, non-goals, success measures | [Project brief](/templates/project-brief/) | Scope changes |
| `docs/technical-spec.md` | Architecture, data model, interfaces, acceptance criteria | [Technical spec](/templates/technical-spec/) | Before each feature; kept current |
| `docs/adr/NNNN-*.md` | One file per significant decision | [ADR](/templates/adr/) | Every decision that is hard to reverse |
| `docs/README.md` | How to use the docs folder; file map; pipeline | [Project README](/templates/project-readme/) | New docs added |
| `CHANGELOG.md` | What changed, per release | — | Every release |

## Conditional

| Document | When | Template |
|---|---|---|
| `docs/design-system.md` | Any UI | — (project-specific) |
| `docs/domain-rules.md` | Content in a regulated or sensitive area (health, money, legal, children) | — |
| `docs/research/sources.md` + research docs | Content that makes factual claims | [Research doc](/templates/research-doc/), [Sources registry](/templates/sources-registry/) |
| `docs/page-build-procedure.md` | Repeated page types built from source docs | [Page build procedure](/templates/page-build-procedure/) |
| `docs/00-master-build-prompt.md` | First scaffold of a new project | [Master build prompt](/templates/master-build-prompt/) |
| `docs/llm/` prompts, eval sets | The product calls an LLM | [LLM feature engineering](/llm-features/llm-feature-engineering/) |
| Threat model section in the spec | Auth, payments, personal data, file uploads, LLM tools | [Security baseline](/security/security-baseline/) |

## Order of writing

1. Project brief (what and why).
2. Technical spec, first pass (how, at the level of components and data).
3. ADRs for the stack, hosting and any big choice.
4. `AGENTS.md` (now the agent has everything it needs).
5. Master build prompt for the scaffold.
6. Domain rules, design system and research docs as the work reaches them.

## Rules

- These documents **MUST** live in the project repo and be versioned with the code they describe.
- A feature **MUST NOT** start until its section of the spec has acceptance criteria.
- Documents **SHOULD** be short. If a doc passes about 600 lines, split it by topic so an agent can load only the part it needs.
