---
name: devbook-upgrade
description: Check whether a newer Devbook release exists and upgrade .devbook/ to it - compare versions, summarise the changelog and its Upgrade notes, and apply them once the user agrees. Use when asked whether Devbook is up to date, or to upgrade or update it.
license: CC-BY-4.0
---

# Upgrade Devbook

Devbook releases are dated tags, such as `v2026.11.02`. Upgrading changes what steers the assistant, so explain the changes and wait for a yes before applying them. Don't commit, push or deploy.

## 1. Compare versions

- Current version: `git -C .devbook describe --tags --exact-match` for a submodule (a `.devbook/.git` file exists), or `.devbook/VERSION` for a copy. If the submodule is not on a tag, or `VERSION` says `main`, the project follows `main`: run `git submodule update --remote .devbook`, or rerun the copy command with `REF=main`, then go to step 3.
- Newest release: `git ls-remote --tags --refs --sort=-version:refname https://github.com/nitinraturi/devbook.raturi.in 'v*' | head -n1 | cut -d/ -f3`
- If they match, say Devbook is up to date and stop.

## 2. Explain what changes

- Submodule: `git -C .devbook fetch --tags`, then `git -C .devbook diff HEAD <newest> -- CHANGELOG.md`.
- Copy: fetch `https://raw.githubusercontent.com/nitinraturi/devbook.raturi.in/<tag>/CHANGELOG.md` for both tags; the new entries are the ones only in the newer file.
- Tell the user, in a few lines: what changes for them, and each **Upgrade** note that needs a change in this project, such as a new `AGENTS.md` line or link. Ask whether to upgrade. Stop if they don't agree.

## 3. Upgrade

- Submodule: `git -C .devbook checkout -q <newest> && git add .devbook`.
- Copy: rerun the copy command from `.devbook/templates/setup-prompt.md` with `REF=<newest>`.
- Apply each **Upgrade** note. Keep the project's own content in `AGENTS.md`, and ask before removing anything.
- Confirm every `@` path and "read when" path in `AGENTS.md` exists and every link resolves (`ls -L .claude/rules .claude/skills .github/instructions`).

## 4. Report

Report the old and new versions, the files you changed, the **Upgrade** notes applied or skipped and why, and remind the user to review the diff, commit it and start a new chat.
