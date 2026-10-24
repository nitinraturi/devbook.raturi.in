---
title: Feature docs
description: One short file per complex feature that holds its rules, flow, states and file map, so agents read it instead of re-deriving the feature from code.
sidebar:
  order: 12
---

Based on Anthropic's guidance on context engineering (load the smallest set of high-signal tokens, and fetch details just in time), spec-driven development as in GitHub Spec Kit and Kiro, and EARS requirement syntax (Alistair Mavin, Rolls-Royce, IEEE RE 2009). A feature doc is the durable answer to "what does this feature do, under which conditions, and where is it": rules and flow live there, and how it works lives in the code.

## When to create one
- Create a feature doc only when a feature has at least one of: business rules or conditions, states or a lifecycle, permissions, money or personal data, an external integration, or code spread across several modules or layers.
- Don't create one for simple CRUD, presentational UI, one-file features or anything the code, types and tests already make obvious. Ask when unsure.
- One doc per feature, not per file or per task. Keep it under about 150 lines; split a larger feature into sub-features with their own docs.

## Where it lives
- Put it in the feature's folder as `FEATURE.md`. When the framework spreads a feature across folders, use `docs/features/<feature>.md` instead.
- List every feature doc in the project's `AGENTS.md`, one line each: `- <feature>: <path>`. That line is the only always-loaded cost.
- Start from `.devbook/templates/FEATURE.md`. Drop the optional sections a feature does not need.

## What goes in it
- Purpose: one or two sentences on what it does, for whom and why.
- Map: each relevant file, table, endpoint, job and test with a one-line role. Paths, not code.
- Rules: every condition, permission, limit and failure response, one per line with a stable ID (`R1`, `R2`), in EARS form: `WHEN <trigger>`, `WHILE <state>`, `IF <unwanted event> THEN`, `WHERE <variant>`, then `the system SHALL <response>`. Never renumber or reuse an ID; mark removed rules as removed.
- Flow: the main path as numbered steps, and states with their allowed transitions as a list or a Mermaid state diagram.
- Decisions: why the non-obvious choices were made, one line each, linking to ADRs.
- Out of scope and open questions, so nobody builds or "fixes" what was deliberately left out.
- Never: copied code, schemas or API definitions (link to them), change history (git has it), task lists after the work is done, secrets or real personal data.

## Working with it
- New feature that needs a doc: write Purpose, Rules and Flow first, get approval, then build. Fill in the Map as files appear.
- Before changing a feature, read its doc first, then open only the files its Map points to.
- Update the doc in the same change as any behaviour, rule, state, permission or file move. A change that alters a rule without its doc is not done.
- Name each rule's ID in the tests that cover it (`R3: locks lines when the invoice is issued`). Every rule has at least one test.
- The code is the truth. When the doc and the code disagree, stop, report the mismatch, and fix whichever is wrong with approval.
- Write terse facts in the domain's words, defining a term on first use. No preamble or narrative.
- Delete the doc and its `AGENTS.md` line when the feature is removed.
