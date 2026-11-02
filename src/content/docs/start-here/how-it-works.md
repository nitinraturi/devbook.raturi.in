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
│   ├── skills/                     devbook-security-review/, devbook-release-check/, …
│   └── templates/                  AGENTS.md, CLAUDE.md, FEATURE.md, …
├── AGENTS.md                       your project facts + the Devbook files you chose
├── CLAUDE.md                       one line: @AGENTS.md
├── .claude/rules/devbook-*.md      links to the path-scoped instructions
├── .claude/skills/devbook-*        links to the skills you chose
└── .github/
    ├── copilot-instructions.md     points Copilot to AGENTS.md
    └── instructions/devbook-*.instructions.md   the same path-scoped links, for Copilot
```

`AGENTS.md` is the only file you edit. Its **Project** section holds facts about your project: what it is, the commands, the layout and your own rules. Its **Devbook** section has three `@` lines for the files every chat needs, then a "read" list: one line per other file that applies, saying when to open it. The links are created once by the setup.

## How each assistant loads the rules

Devbook loads in three tiers, so a chat pays only for what its task needs:

1. **Every chat:** core, security and testing, through the `@` lines in `AGENTS.md`.
2. **By file path:** design, REST APIs, databases, SEO, content and mobile carry their own globs (`paths:` for Claude Code, `applyTo:` for Copilot). Through the links in `.claude/rules/` and `.github/instructions/`, each loads only when the assistant reads or edits a matching file, such as a `.css` file for design.
3. **By task:** performance, licensing, feature docs and stack notes are in the "read" list, so the assistant opens them when a task calls for them. Skills load only their name and description until a task needs one, then the full procedure.

- **Claude Code** reads `CLAUDE.md` at the start of every chat, follows `@AGENTS.md`, and loads the three `@` files. It loads a linked rule the first time it reads or edits a matching file, and a skill when the task matches its description.
- **GitHub Copilot** (VS Code agent mode, the coding agent and the CLI) reads `AGENTS.md` and `.github/copilot-instructions.md` on its own. It does not expand `@` lines, so the sentence in `copilot-instructions.md` tells it to open the three core files and the "read" files when they apply. It normally does, but that is an instruction, not a guarantee. VS Code attaches a linked `.instructions.md` file when a matching file is edited, and reads skills from `.claude/skills/`.
- **Codex** reads `AGENTS.md` files from the repository root down to the folder you work in and joins them, up to 32 KiB by default. Its docs describe no `@` imports or path rules, so the `@` lines and the "read" list arrive as plain text and the model has to open each file itself, as with Copilot.
- **Cursor** reads `AGENTS.md` in the root and in subfolders. Its docs describe no imports for `AGENTS.md`; in Cursor's own rules, an `@` file mention points the agent to a file to read with its tools rather than adding the file's text. Expect the same as Copilot: the agent is asked to open the files.
- **Gemini CLI** reads `GEMINI.md` by default, not `AGENTS.md`. To use `AGENTS.md`, set `"context": { "fileName": ["AGENTS.md", "GEMINI.md"] }` in `.gemini/settings.json`. Gemini expands `@` imports, but its documented forms start with `./`, `../` or `/`, so check that the `@.devbook/...` lines load by asking which files it is following.

Rules load once per chat. After you change `AGENTS.md`, start a new chat.

## Which rule wins

1. What you ask for in the chat.
2. Your rules in the Project section of `AGENTS.md`, where they say they override Devbook.
3. Stack notes, for details about one technology.
4. Devbook instructions.

Every rule has a stable ID (`CORE-02`, `SEC-05`), so an override can name exactly the rule it replaces, and the assistant cites IDs in its reports. So you never edit Devbook's files to change a rule. Write the exception in your Project section instead, for example: `- Rules: we use offset pagination on /reports because the dataset is fixed; this overrides API-03.`

## Mandatory and optional files

Core, security and testing load in every project. The rest are set up only when they apply, so a small script doesn't pay for design or SEO rules, and even then they load only for the matching files or tasks.

| File | Set it up when | Loads |
|---|---|---|
| [Core](/instructions/core/), [Security](/instructions/security/), [Testing](/instructions/testing/) | Always | Every chat |
| [Performance](/instructions/performance/) | Any app, site or service | When a task needs it |
| [REST APIs](/instructions/api-data/) | The project has a backend or API | API files |
| [Databases](/instructions/database/) | It stores data in a relational database | Models, migrations, SQL |
| [Design](/instructions/design/) | It has any user interface | Styles, components, templates |
| [SEO](/instructions/seo/) and [Content](/instructions/content/) | It is a public website, docs site or blog | Pages and layouts; Markdown content |
| [Mobile apps](/instructions/mobile/) | It is an iOS, Android, React Native or Flutter app | Swift, Kotlin, Dart files |
| [Licensing](/instructions/licensing/) | It is published or distributed, or ships third-party code, fonts, images or data | When a task needs it |
| [Feature docs](/instructions/feature-docs/) | Its features have business rules, states or permissions | When a task needs it |
| Stack notes | You use that technology | When a task needs it |

Seven skills cover multi-step jobs: `devbook-security-review`, `devbook-release-check`, `devbook-feature-doc`, `devbook-api-endpoint`, `devbook-db-migration`, `devbook-seo-audit`, and `devbook-setup`, which the setup prompt uses. The globs in each path-scoped file suit common layouts; if yours differs, the "read" list still covers it.

## What it costs

Every rule loaded takes up part of the context window, so Devbook keeps its files short and loads most of them only when needed. Sizes today:

| Project type | At the start of every chat | Most a chat can add | Files that can be added |
|---|---|---|---|
| Any project | about 12 KB, 3,000 tokens | — | — |
| Public website | about 12 KB, 3,000 tokens | 18 KB, 4,500 tokens | performance, design, SEO, content |
| API service | about 12 KB, 3,000 tokens | 15 KB, 3,800 tokens | performance, REST APIs, databases |
| Web app | about 12 KB, 3,000 tokens | 25 KB, 6,200 tokens | performance, REST APIs, databases, design, feature docs |

The start of every chat holds core, security and testing (10 KB), the "read" list in `AGENTS.md` and the descriptions of the linked skills. A chat that only touches backend code never loads design or SEO rules. The always-loaded part is the same in every chat, so providers can cache it.

## What it can't do

- **Rules are advice, not enforcement.** Assistants follow instructions most of the time, not always. Back hard limits with tooling: CI checks, branch protection, permission settings and hooks.
- **It doesn't know your project.** The Project section does. Facts you leave out, such as a test command or a naming rule, are facts the assistant has to guess.
- **It doesn't replace review.** Read every change before you merge it.

Next: [set it up](/start-here/setup/), then read [Use Devbook day to day](/start-here/using-devbook/).
