---
name: devbook-upgrade
description: Check whether a newer Devbook version is on main and upgrade .devbook/ to it - compare VERSION numbers, summarise the changelog and its Upgrade notes, and apply them once the user agrees. Use when asked whether Devbook is up to date, or to upgrade or update it.
license: CC-BY-4.0
---

# Upgrade Devbook

Devbook ships from its `main` branch. The `VERSION` file at its root holds the version number, such as `2026.11.02.1`, and goes up with every commit to `main`. Upgrading changes what steers the assistant, so explain the changes and wait for a yes before applying them. Don't commit, push or deploy.

## 1. Compare versions

- Current version: `cat .devbook/VERSION`. If the file is missing, the project uses a release from before version numbers; treat it as out of date.
- Newest version: `curl -fsSL https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in/main/VERSION`
- Compare the dot-separated numbers left to right, ignoring a leading `v`. If the current one is the same or newer, say Devbook is up to date and stop.

## 2. Explain what changes

- Submodule (a `.devbook/.git` file exists): `git -C .devbook fetch -q origin main`, then `git -C .devbook diff HEAD FETCH_HEAD -- CHANGELOG.md`.
- Copy: fetch `https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in/main/CHANGELOG.md` and compare it with `.devbook/CHANGELOG.md`; the new entries are the ones missing from the local file. If there is no local changelog, summarise the entries dated after the project's Devbook was last updated (`git log -1 --format=%cs -- .devbook`).
- Tell the user, in a few lines: what changes for them, and each **Upgrade** note that needs a change in this project, such as a new `AGENTS.md` line or link. Ask whether to upgrade. Stop if they don't agree.

## 3. Upgrade

- Submodule: `git -C .devbook checkout -q FETCH_HEAD && git add .devbook`. If `.gitmodules` has no `branch = main` for `.devbook`, also run `git config -f .gitmodules submodule..devbook.branch main`.
- Copy: rerun the copy command from `.devbook/templates/setup-prompt.md`.
- Apply each **Upgrade** note. Keep the project's own content in `AGENTS.md`, and ask before removing anything.
- Confirm `.devbook/VERSION` shows the newest version, every `@` path and "read when" path in `AGENTS.md` exists, and every link resolves (`ls -L .claude/rules .claude/skills .github/instructions`).

## 4. Report

Report the old and new versions, the files you changed, the **Upgrade** notes applied or skipped and why, and remind the user to review the diff, commit it and start a new chat.
