---
name: feature-doc
description: "Reads, updates or, when one is needed, writes a feature doc (FEATURE.md) with EARS rules, a flow and a file map, and says when a feature needs none. Use when asked to document, start or change a feature with business rules: who may do what, states, sharing, expiry, scheduling, money or integrations."
license: CC-BY-4.0
---

# Feature doc

A feature doc answers "what does this feature do, under which conditions, and where is it". Rules and flow live there; how it works lives in the code. The code is the truth: when the doc and the code disagree, stop, report the mismatch and fix whichever is wrong with the user's approval.

## Procedure

1. Find the feature's doc: a `- <feature>: <path>` line in `AGENTS.md`, a `FEATURE.md` in the feature's folder, or `docs/features/<feature>.md`. If one exists, read it and then only the files its Map lists.
2. If none exists, decide whether the feature needs one. It does when it has business rules or conditions, states or a lifecycle, permissions, money or personal data, an external integration, or code spread across several modules. It doesn't for simple CRUD, presentational UI, one-file features or anything the code, types and tests already make obvious. If it doesn't, say so and stop; if unsure, ask. Create a new doc only when the user asked for one or agreed.
3. For a new feature, write Purpose, Rules and Flow from the template below, then stop and ask for approval before building. Fill in the Map as files appear.
4. For an existing feature, write what the code does, not what it should do.
5. Update the doc in the same change as any behaviour, rule, state, permission or file move.
6. Add or update the `- <feature>: <path>` line in `AGENTS.md`; it is the doc's only always-loaded cost.
7. Check that each rule has a test naming its ID (`R3: locks lines when the invoice is issued`) and list the rules that don't.
8. Report the doc path, rules without tests, doc and code mismatches, and open questions.

## Rules for the doc

- One doc per feature, under about 150 lines; split a larger feature into sub-features.
- Put it in the feature's folder as `FEATURE.md`, or `docs/features/<feature>.md` when the framework spreads the feature across folders.
- Rules use stable IDs (`R1`, `R2`) in EARS form. Never renumber or reuse an ID; mark removed rules as removed.
- Never include copied code, schemas or API definitions (link to them), change history, finished task lists, secrets or real personal data.
- Delete the doc and its `AGENTS.md` line when the feature is removed.

## Template

```markdown
# <Feature name>

<One or two sentences: what the feature does, for whom, and why.>

## Map
- `<path>`: <one-line role>
- Data: `<table or model>`: <what it stores>
- Entry points: `<route, command, event or job>`
- Tests: `<path>`

## Rules
- R1: WHEN <trigger>, the system SHALL <response>.
- R2: WHILE <state>, the system SHALL <response>.
- R3: IF <unwanted event>, THEN the system SHALL <response>.
- R4: WHERE <variant or plan>, the system SHALL <response>.

## Flow
1. <first step of the main path>
2. <next step>

States (optional): `<state>` → `<state>` → `<state>` | `<state>`

## Decisions (optional)
- <choice>: <why, in one line>

## Out of scope (optional)
- <deliberately not handled>

## Open questions (optional)
- <question, and who decides>
```
