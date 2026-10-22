---
title: Introduction
description: What the devbook is, how its three layers fit together, which rules win when they conflict, and how to read MUST, SHOULD and MAY.
sidebar:
  order: 1
---

The devbook is a versioned set of engineering rules for building software with AI coding assistants. It exists so that every project starts from the same baseline and so that an agent such as Claude or Copilot gets clear, testable instructions instead of guessing.

## The three layers

| Layer | Where | What goes in it |
|---|---|---|
| **Universal** | This site, every section except Stack profiles | Rules that hold for any stack: workflow, design principles, security, testing, performance, accessibility, SEO, content, evidence |
| **Stack profiles** | This site, [Stack profiles](/stacks/astro/) | Specifics for one tool: config syntax, commands, gotchas |
| **Project** | Each project repo, `docs/` | Brand, design tokens, data model, domain rules, research, backlog |

A rule belongs in the **lowest** layer where it is still true. If you find yourself copying a rule into a second project, it belongs in the devbook.

## Precedence

1. Project rules override stack rules, which override universal rules.
2. A project MAY tighten any rule without justification.
3. A project MUST write an [ADR](/templates/adr/) to loosen a rule about security, privacy, accessibility, testing, or honesty of content.
4. When two rules at the same layer conflict, the more specific one wins. Report the conflict so it can be fixed here.

## Rule keywords

- **MUST / MUST NOT**: required.
- **SHOULD / SHOULD NOT**: the default; deviate with a written reason.
- **MAY**: optional.

## Who it is for

- **You**, when starting a project, reviewing a pull request or deciding how to structure something.
- **AI agents**, through the project's `AGENTS.md`, which links only the pages that apply. Agents follow short, explicit rules far more reliably than long prose, which is why pages are written as rule lists.

## What it is not

- Not a tutorial for a language or framework. It assumes you can already build; it tells you how to build consistently.
- Not a replacement for official docs. Stack profiles link to the vendor's docs and carry a "Last verified" date.

## Next

- [Adopt the devbook in a project](/start-here/adopt-in-a-project/)
- [The LLM-assisted workflow](/workflow/llm-assisted-workflow/)
