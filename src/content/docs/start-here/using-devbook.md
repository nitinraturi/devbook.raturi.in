---
title: Use Devbook day to day
description: What changes after setup, how to ask for work, how to add your own rules and stack notes, feature docs, updates, troubleshooting and common questions.
sidebar:
  order: 3
---

After [setup](/start-here/setup/), you keep working in your assistant as before. The difference is in how it works: it reads before it edits, asks when something is unclear, runs your checks and tells you what it did not do.

## What to expect from the assistant

- **Questions first.** When a request is ambiguous, it restates the goal and asks, instead of guessing.
- **A plan for big changes.** Work that touches many files, data models, auth, payments, infrastructure or public URLs gets a short plan and waits for your approval.
- **Checked facts.** It looks up versions, APIs and prices in official docs instead of relying on memory, and says when it can't verify something.
- **Real check output.** It runs format, lint, typecheck, tests and build, and shows the result.
- **An honest report.** Each task ends with what changed, what was verified, what was not done and its assumptions.
- **No commits unless you ask.** It never commits, pushes or deploys on its own.

## Ask for work in a way that gets results

A good request names the outcome, the scope and when it's done:

```text
Goal: let users export invoices as CSV.
Scope: only src/billing/.
Done when: the export downloads from the invoices page, has a test,
and npm run check passes. Ask me if anything is unclear.
```

You don't need to repeat Devbook's rules in the request. For more on writing prompts and rules that models follow, see [Writing instructions](/start-here/writing-instructions/).

## Add your own rules

Put project facts and rules in the **Project** section of `AGENTS.md`, not in `.devbook/`. Updates replace `.devbook/`, and your Project section stays yours.

- **Facts the assistant can't infer:** real commands, where things live, naming rules and units.
- **Exceptions to Devbook:** say what you override and why, for example: `- Rules: JSON fields are camelCase to match our mobile app; this overrides api-data.`
- **Boundaries:** what never to touch and what needs approval.
- **Repeated mistakes:** when the assistant gets something wrong twice, add one line that prevents it.

Keep the section short. Every line loads in every chat, and long files are followed less reliably.

## Add or remove instruction files

Edit the Devbook section of `AGENTS.md`: add or delete `@.devbook/instructions/<file>.md` or `@.devbook/stacks/<stack>.md` lines, then start a new chat. [How Devbook works](/start-here/how-it-works/#mandatory-and-optional-files) lists when to load each file. For a technology without a stack note, add the rules to your Project section.

## Document complex features

For features with business rules, states or permissions, the [feature docs](/instructions/feature-docs/) instruction has the assistant keep one short `FEATURE.md` per feature: its rules, flow and a map of its files. The assistant reads that file before the code, which saves tokens and avoids re-deriving the rules each time. Each doc is listed in the **Features** line of your `AGENTS.md`.

## Check that it's working

Start a new chat and ask:

```text
Which Devbook instruction files are you following in this project,
and what do they require before you call a task done?
```

The answer should name the files in your `AGENTS.md` and mention running checks and reporting what was not done. If it doesn't, see the troubleshooting section below.

## Keep it up to date

- **Submodule:** run `git submodule update --remote .devbook`, review the diff and commit it.
- **Copy:** rerun the download command from the [setup page](/start-here/setup/#1-choose-how-to-add-devbook), review `git diff .devbook` and commit.

Then read the [changelog](https://github.com/nitinraturi/devbook.raturi.in/blob/main/CHANGELOG.md). Some entries have an **Upgrade** section, for example when a file is added or split and you need a new `@` line.

Review each update's diff before you commit it. These files steer your assistant, so treat an update like a dependency upgrade: read what changed, and pin the submodule to the old commit if something doesn't suit your project yet.

## Troubleshooting

| Problem | Fix |
|---|---|
| The assistant ignores the rules | Start a new chat; rules load at the start. Check that `CLAUDE.md` contains `@AGENTS.md` and that every `@` path exists. |
| An `@` line isn't loaded | Write it as plain text. An `@` path inside backticks or a code block is not imported. |
| The setup command fails on Windows | Use the PowerShell command on the [setup page](/start-here/setup/#1-choose-how-to-add-devbook), or download the ZIP. |
| The assistant mentions `npm run check` or Devbook's contributor rules | It opened `.devbook/AGENTS.md`, which is for changing Devbook itself. Tell it to follow your root `AGENTS.md`; that file says the same. |
| A cloud agent says `.devbook/` is empty | Its checkout skips submodules. Add `git submodule update --init` to its setup steps, or switch to the copy method. |
| Copilot skips some files | Copilot doesn't expand `@` lines. Check that `.github/copilot-instructions.md` tells it to read the files listed in `AGENTS.md`. |
| Two rules conflict | Your Project section wins where it says so. Write the exception there with its reason. |
| A rule is wrong for your project | Override it in your Project section. If it's wrong for everyone, [tell us](/start-here/contact/). |

## Common questions

**Does Devbook change my code?** Only the setup prompt writes files, and only `.devbook/`, `AGENTS.md`, `CLAUDE.md` and `.github/copilot-instructions.md`. It doesn't commit.

**Can I use it in an existing project?** Yes. The setup prompt merges into your existing agent files and lists any conflicts for you to decide.

**Does it work in a monorepo?** Yes. Add Devbook and the Devbook lines once, in the root `AGENTS.md`. Put package-specific facts, such as that package's commands, in a short `AGENTS.md` inside the package; assistants use the nearest one for files there.

**Do I need both Claude and Copilot?** No. Use any assistant that reads `AGENTS.md` or `CLAUDE.md`.

**Can I edit files in `.devbook/`?** Don't. The next update replaces them. Put changes in your Project section.

**Can I use the text elsewhere?** Yes, with credit. See the [license](/license/).
