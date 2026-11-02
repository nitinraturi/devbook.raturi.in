---
title: Feature docs
description: One short file per complex feature that holds its rules, flow, states and file map, so agents read it instead of re-deriving the feature from code.
sidebar:
  order: 12
sources:
  - Anthropic, Effective context engineering for AI agents
  - Spec-driven development (GitHub Spec Kit, Kiro)
  - EARS requirement syntax (Alistair Mavin et al., IEEE RE 2009)
lastVerified: 2026-11-02
---

Load for any app or service with business rules. A feature doc is the durable answer to "what does this feature do, under which conditions, and where is it": rules and flow live there, and how it works lives in the code.

## First
- FEAT-01: Before changing a feature, read its doc first, then open only the files its Map points to.
- FEAT-02: Update the doc in the same change as any behaviour, rule, state, permission or file move. A change that alters a rule without its doc is not done.
- FEAT-03: The code is the truth. When the doc and the code disagree, stop, report the mismatch, and fix whichever is wrong with approval.

## When to create one
- FEAT-04: Create a feature doc only when a feature has at least one of: business rules or conditions, states or a lifecycle, permissions, money or personal data, an external integration, or code spread across several modules or layers.
- FEAT-05: Don't create one for simple CRUD, presentational UI, one-file features or anything the code, types and tests already make obvious. Ask when unsure.
- FEAT-06: One doc per feature, not per file or per task. Keep it under about 150 lines; split a larger feature into sub-features with their own docs.

## Where it lives
- FEAT-07: Put it in the feature's folder as `FEATURE.md`. When the framework spreads a feature across folders, use `docs/features/<feature>.md` instead.
- FEAT-08: List every feature doc in the project's `AGENTS.md`, one line each: `- <feature>: <path>`. That line is the only always-loaded cost.
- FEAT-09: Start from `.devbook/templates/FEATURE.md`, and drop the optional sections a feature does not need.

## What goes in it
- FEAT-10: Purpose: one or two sentences on what it does, for whom and why.
- FEAT-11: Map: each relevant file, table, endpoint, job and test with a one-line role. Paths, not code.
- FEAT-12: Rules: every condition, permission, limit and failure response, one per line with a stable ID (`R1`, `R2`), in EARS form: `WHEN <trigger>`, `WHILE <state>`, `IF <unwanted event> THEN`, `WHERE <variant>`, then `the system SHALL <response>`. Never renumber or reuse an ID; mark removed rules as removed.
- FEAT-13: Flow: the main path as numbered steps, and states with their allowed transitions as a list or a Mermaid state diagram.
- FEAT-14: Decisions: why the non-obvious choices were made, one line each, linking to ADRs.
- FEAT-15: Out of scope and open questions, so nobody builds or "fixes" what was deliberately left out.
- FEAT-16: Never include copied code, schemas or API definitions (link to them), change history (git has it), task lists after the work is done, secrets or real personal data.

## Working with it
- FEAT-17: For a new feature that needs a doc, write Purpose, Rules and Flow first, get approval, then build. Fill in the Map as files appear.
- FEAT-18: Name each rule's ID in the tests that cover it (`R3: locks lines when the invoice is issued`). Every rule has at least one test.
- FEAT-19: Delete the doc and its `AGENTS.md` line when the feature is removed.
