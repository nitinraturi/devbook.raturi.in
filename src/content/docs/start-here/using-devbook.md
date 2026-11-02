---
title: Use Devbook day to day
description: What changes after setup, how to ask for work, how to add your own rules and stack notes, feature docs, updates, troubleshooting and common questions.
sidebar:
  order: 3
---

After [setup](/start-here/setup/), you keep working in your assistant as before. The difference is in how it works: it reads before it edits, asks when something is unclear, runs your checks and tells you what it did not do.

## After setup at a glance

| You want to | Do this | Section |
|---|---|---|
| Build or fix something | Ask as usual. The rules load on their own. | [Ask for work](#ask-for-work-in-a-way-that-gets-results) |
| Run a review, release check, migration or other multi-step job | Ask for it, or type its skill name. | [Use the skills](#use-the-skills) |
| Know exactly what to type for a skill, or what a rule file changes | Look it up per file. | [Use each skill and instruction](/start-here/skills-and-instructions/) |
| Teach the assistant something about your project | Add a line to the Project section of `AGENTS.md`. | [Add your own rules](#add-your-own-rules) |
| Turn a file or skill on or off | Edit the "read" list or the links. | [Add or remove instruction files](#add-or-remove-instruction-files) |
| Confirm it's loaded | Ask the check question in a new chat. | [Check that it's working](#check-that-its-working) |
| Get a newer Devbook | Ask "Is Devbook up to date?", or run `/devbook-upgrade`. | [Keep it up to date](#keep-it-up-to-date) |

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

## Use the skills

Instruction files are rules the assistant always applies. Skills are step-by-step procedures for jobs that need a fixed order, such as a security review or a schema change. Setup links the ones that fit your project into `.claude/skills/`, which both Claude Code and VS Code Copilot read.

### How a skill runs

1. **At the start of a chat**, the assistant sees only each skill's name and one-line description.
2. **When your request matches a description**, it loads the full procedure.
3. **It follows the steps in order**, using the rules in the instruction files, and stops where the skill says to ask you, for example before a breaking API change or a migration.
4. **It ends with a report**: what it checked, what it found and what it didn't do.

### Two ways to start one

- **Ask in plain words.** "Review this branch for security problems" matches `devbook-security-review`. This works when your wording is close to the skill's description, so it may not trigger for a request that only turns out to need one.
- **Name it.** In Claude Code, type `/devbook-security-review` and then your request. In Copilot, write "use the devbook-security-review skill". Name the skill whenever you want to be sure it runs.

Even when no skill triggers, the rules still apply: an API change still follows the REST API rules because they load with the matching files. What a skill adds is the order of steps and the stops for your approval.

### Which skill to use

| Skill | Use it when |
|---|---|
| `devbook-api-endpoint` | Adding, changing or removing an endpoint, route or webhook |
| `devbook-db-migration` | Adding or changing tables, columns, indexes or constraints |
| `devbook-feature-doc` | Documenting a feature, or planning one with business rules |
| `devbook-security-review` | Before merging sensitive work, or for a full review |
| `devbook-release-check` | Before a release or deploy |
| `devbook-seo-audit` | Before launching or migrating a public site |
| `devbook-upgrade` | Checking for or moving to a newer Devbook |

[Use each skill and instruction](/start-here/skills-and-instructions/) gives the exact request to type for each one, what it does, where it stops for you and what it reports. To re-run setup, paste the [setup prompt](/start-here/setup/) again; `devbook-setup` isn't linked as a skill.

### Choose which skills are linked

Every linked skill's description loads in every chat, so link only the ones you use. To add one, link its folder: `ln -s ../../.devbook/skills/devbook-seo-audit .claude/skills/devbook-seo-audit`. To remove one, delete the link. Then commit and start a new chat.

## Add your own rules

Put project facts and rules in the **Project** section of `AGENTS.md`, not in `.devbook/`. Updates replace `.devbook/`, and your Project section stays yours.

- **Facts the assistant can't infer:** real commands, where things live, naming rules and units.
- **Exceptions to Devbook:** say what you override and why, for example: `- Rules: JSON fields are camelCase to match our mobile app; this overrides api-data.`
- **Boundaries:** what never to touch and what needs approval.
- **Repeated mistakes:** when the assistant gets something wrong twice, add one line that prevents it.

Keep the section short. Every line loads in every chat, and long files are followed less reliably.

## Add or remove instruction files

Edit the "read" list in the Devbook section of `AGENTS.md`, adding or deleting a line per file, then start a new chat. For a path-scoped file (design, REST APIs, databases, SEO, content, mobile), also add or delete its two links, as on the [setup page](/start-here/setup/#2-connect-your-assistants). For a skill, see [Choose which skills are linked](#choose-which-skills-are-linked). [How Devbook works](/start-here/how-it-works/#mandatory-and-optional-files) lists when each file applies. For a technology without a stack note, add the rules to your Project section.

## Document complex features

For features with business rules, states or permissions, the [feature docs](/instructions/feature-docs/) instruction has the assistant keep one short `FEATURE.md` per feature: its rules, flow and a map of its files. The assistant reads that file before the code, which saves tokens and avoids re-deriving the rules each time. Each doc is listed in the **Features** line of your `AGENTS.md`.

## Check that it's working

Start a new chat and ask:

```text
Which Devbook instruction files are you following in this project,
and what do they require before you call a task done?
```

The answer should name core, security and testing, and mention running checks and reporting what was not done. Path-scoped files appear only after the assistant has opened a matching file. In Claude Code, `/memory` lists the instruction files loaded so far. If the answer is wrong, see the troubleshooting section below.

## Keep it up to date

Devbook ships from its `main` branch. The `VERSION` file at its root holds a version number, such as `2026.11.02.1`, that goes up with every commit to `main`. Your copy is fixed at the commit you added, so nothing changes until you update, and `.devbook/VERSION` shows which version you have.

**Automatic:** with the [enforcement kit](/start-here/enforcement-kit/), Claude Code checks once a day when a session starts and, when a newer version is out, tells you and asks whether to upgrade. Nothing in `AGENTS.md` makes a network call, so other assistants don't check on their own.

**On request:** ask "Is Devbook up to date?" or run `/devbook-upgrade`. The assistant compares your version with `main`, summarises the changelog entries in between, and updates only after you say yes.

**By hand:**

1. Check your version: `cat .devbook/VERSION`. No file means you have a release from before version numbers, so update.
2. Check the newest: `curl -fsSL https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in/main/VERSION`.
3. Read the [changelog](https://github.com/nitinraturi/devbook.raturi.in/blob/main/CHANGELOG.md) entries since your version. Entries with an **Upgrade** note need a change in your project, such as a new line in `AGENTS.md` or a new link.
4. Update. **Submodule:** `git -C .devbook fetch origin main && git -C .devbook checkout -q FETCH_HEAD && git add .devbook`. **Copy:** rerun the download command from the [setup page](/start-here/setup/#1-choose-how-to-add-devbook).
5. Review the diff, make any **Upgrade** changes, commit and start a new chat.

These files steer your assistant, so treat an update like a dependency upgrade. If a new version doesn't suit your project yet, don't commit the update; your project keeps the version it has.

## Troubleshooting

| Problem | Fix |
|---|---|
| The assistant ignores the rules | Start a new chat; rules load at the start. Check that `CLAUDE.md` contains `@AGENTS.md` and that every `@` path exists. |
| An `@` line isn't loaded | Write it as plain text. An `@` path inside backticks or a code block is not imported. |
| The setup command fails on Windows | Use the PowerShell command on the [setup page](/start-here/setup/#1-choose-how-to-add-devbook), or download the ZIP. |
| The assistant mentions `npm run check` or Devbook's contributor rules | It opened `.devbook/AGENTS.md`, which is for changing Devbook itself. Tell it to follow your root `AGENTS.md`; that file says the same. |
| A cloud agent says `.devbook/` is empty | Its checkout skips submodules. Add `git submodule update --init` to its setup steps, or switch to the copy method. |
| Copilot skips some files | Copilot doesn't expand `@` lines. Check that `.github/copilot-instructions.md` tells it to read the files listed in `AGENTS.md`. |
| A path rule didn't load | It loads only after the assistant reads or edits a matching file; ask it to open one. Check that the link resolves (`ls -L .claude/rules`) and that your files match the globs in the instruction's `paths:` list. If they don't, rely on the "read" line, or ask the assistant to read the file. |
| A skill didn't trigger | Check the link resolves (`ls -L .claude/skills`) and that the folder name matches the skill's `name`. Ask for the task in the words of its description, or name it: "use the devbook-security-review skill". Smaller, faster models use skills less often on their own. |
| Links show up as small text files (Windows) | Git checked out symlinks as plain files. Delete them and run `node .devbook/skills/devbook-setup/scripts/link.mjs --copy`, which writes copies instead, or turn on Developer Mode, set `git config core.symlinks true` and check out again. |
| Not sure the setup is complete | Run `node .devbook/skills/devbook-setup/scripts/verify.mjs`. It lists every missing path or broken link. |
| A Devbook kit hook blocked a command | The [enforcement kit](/start-here/enforcement-kit/) stops `git push`, `.env` edits and recursive `rm` outside the project. Run the command yourself if it's what you want, or remove that hook from `.claude/settings.json`. |
| Two rules conflict | Your Project section wins where it says so. Write the exception there with its reason. |
| A rule is wrong for your project | Override it in your Project section. If it's wrong for everyone, [tell us](/start-here/contact/). |

## Common questions

**Does Devbook change my code?** Only the setup prompt writes files, and only `.devbook/`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` and the `devbook-*` links in `.claude/` and `.github/instructions/`. It doesn't commit.

**Can I use it in an existing project?** Yes. The setup prompt merges into your existing agent files and lists any conflicts for you to decide.

**Does it work in a monorepo?** Yes. Add Devbook and the Devbook lines once, in the root `AGENTS.md`. Put package-specific facts, such as that package's commands, in a short `AGENTS.md` inside the package; assistants use the nearest one for files there.

**Do I need both Claude and Copilot?** No. Use any assistant that reads `AGENTS.md` or `CLAUDE.md`.

**Can I edit files in `.devbook/`?** Don't. The next update replaces them. Put changes in your Project section.

**Can I use the text elsewhere?** Yes, with credit. See the [license](/license/).
