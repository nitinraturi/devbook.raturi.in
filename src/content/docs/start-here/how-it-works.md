---
title: How Devbook works
description: What Devbook is, the terms you need, how Claude, Copilot and other assistants load the files, which rules win, what it costs and what it can't do.
sidebar:
  order: 1
---

Devbook is a set of short rule files for AI coding assistants. You add them to a project once. After that, every chat with the assistant starts with the same engineering, security and design rules, so you don't have to repeat them.

## The terms you need

| Term | Meaning |
|---|---|
| AI coding assistant | A tool that reads and edits your code from a chat, such as Claude Code, GitHub Copilot in agent mode, Codex or Cursor. |
| Context window | Everything the model can see during a chat: your messages, files it opened and the instruction files. It has a fixed size. |
| Token | The unit models read text in. One token is about 4 characters of English, so 4 KB of rules is about 1,000 tokens. |
| Instruction file | A Markdown file the assistant reads at the start of every chat. `AGENTS.md` is the shared standard; Claude Code reads `CLAUDE.md`. |
| `@` import | A line such as `@.devbook/instructions/core.md` in a file Claude Code reads. Claude Code pastes that file's text in its place. |
| Submodule | A git feature that keeps another repository inside yours at a pinned commit. Devbook's default install. |
| Instruction (Devbook) | A rule file for a concern, such as security or design, that applies to any stack. |
| Stack note | A short rule file for one technology, such as Astro or Django. |
| Template | A starting file you copy into your project, such as `AGENTS.md` or `FEATURE.md`. |

## What gets added to your project

```text
your-project/
├── .devbook/                       Devbook itself (submodule or copied files)
│   ├── instructions/               core.md, security.md, design.md, …
│   ├── stacks/                     astro.md, django.md, …
│   └── templates/                  AGENTS.md, CLAUDE.md, FEATURE.md, …
├── AGENTS.md                       your project facts + the Devbook files you chose
├── CLAUDE.md                       one line: @AGENTS.md
└── .github/copilot-instructions.md one sentence that points Copilot to AGENTS.md
```

`AGENTS.md` is the only file you edit. Its **Project** section holds facts about your project: what it is, the commands, the layout and your own rules. Its **Devbook** section lists the instruction files that apply, one `@` line each.

## How each assistant loads the rules

- **Claude Code** reads `CLAUDE.md` at the start of every chat, follows `@AGENTS.md`, then follows each `@.devbook/...` line. The full text is in context before you type anything.
- **GitHub Copilot** (VS Code agent mode, the coding agent and the CLI) reads `AGENTS.md` and `.github/copilot-instructions.md` on its own. It does not expand `@` lines, so the sentence in `copilot-instructions.md` tells it to open each listed file. It normally does, but that is an instruction, not a guarantee.
- **Other assistants** that support `AGENTS.md`, such as Codex, Cursor and Gemini CLI, read the same file list.

Rules load once per chat. After you change `AGENTS.md`, start a new chat.

## Which rule wins

1. What you ask for in the chat.
2. Your rules in the Project section of `AGENTS.md`, where they say they override Devbook.
3. Stack notes, for details about one technology.
4. Devbook instructions.

So you never edit Devbook's files to change a rule. Write the exception in your Project section instead, for example: `- Rules: we use offset pagination on /reports because the dataset is fixed; this overrides api-data.`

## Mandatory and optional files

Core, security and testing load in every project. The rest load only when they apply, so a small script doesn't pay for design or SEO rules.

| File | Load it when |
|---|---|
| [Core](/instructions/core/), [Security](/instructions/security/), [Testing](/instructions/testing/) | Always |
| [Performance](/instructions/performance/) | Any app, site or service |
| [REST APIs](/instructions/api-data/) | The project has a backend or API |
| [Databases](/instructions/database/) | It stores data in a relational database |
| [Design](/instructions/design/) | It has any user interface |
| [SEO](/instructions/seo/) and [Content](/instructions/content/) | It is a public website, docs site or blog |
| [Mobile apps](/instructions/mobile/) | It is an iOS, Android, React Native or Flutter app |
| [Licensing](/instructions/licensing/) | It is published or distributed, or ships third-party code, fonts, images or data |
| [Feature docs](/instructions/feature-docs/) | Its features have business rules, states or permissions |
| Stack notes | You use that technology |

## What it costs

Every rule takes up part of the context window in every chat, so Devbook keeps its files short. Sizes today:

| Project type | Files | Size | About |
|---|---|---|---|
| Any project | Core, security, testing | 14 KB | 3,600 tokens |
| Public website | + performance, design, SEO, content | 36 KB | 9,000 tokens |
| API service | + performance, REST APIs, databases | 32 KB | 7,900 tokens |
| Web app | + performance, REST APIs, databases, design, feature docs | 43 KB | 10,900 tokens |

That is a small share of a modern context window, and it is the same in every chat, so providers can cache it.

## What it can't do

- **Rules are advice, not enforcement.** Assistants follow instructions most of the time, not always. Back hard limits with tooling: CI checks, branch protection, permission settings and hooks.
- **It doesn't know your project.** The Project section does. Facts you leave out, such as a test command or a naming rule, are facts the assistant has to guess.
- **It doesn't replace review.** Read every change before you merge it.

Next: [set it up](/start-here/setup/), then read [Use Devbook day to day](/start-here/using-devbook/).
