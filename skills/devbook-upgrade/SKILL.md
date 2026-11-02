---
name: devbook-upgrade
description: "Checks whether a newer Devbook version is on main and, once the user agrees, upgrades .devbook/ and applies the changelog's Upgrade notes. Use when asked whether Devbook is up to date, or to upgrade or update Devbook."
license: CC-BY-4.0
---

# Upgrade Devbook

Upgrading changes what steers the assistant, so explain the changes and wait for a yes before applying them. Don't commit, push or deploy.

## 1. Compare versions

Run `node .devbook/skills/devbook-upgrade/scripts/compare.mjs`. It prints `status: up-to-date`, `behind` or `unknown`, the current and newest versions (`VERSION` on Devbook's `main`), and the changelog entries and **Upgrade** notes in between. It changes nothing.

- `up-to-date`: say so and stop.
- `unknown`: you're offline or GitHub is unreachable; say so and stop.

## 2. Explain and ask

Tell the user, in a few lines, what changes for them and each **Upgrade** note that needs a change in this project, such as a new `AGENTS.md` line. Ask whether to upgrade, and stop if they don't agree.

## 3. Upgrade

- Submodule (a `.devbook/.git` file exists): `git -C .devbook fetch -q origin main && git -C .devbook checkout -q FETCH_HEAD && git add .devbook`.
- Copy: rerun the copy command from `.devbook/templates/setup-prompt.md`.
- Apply each **Upgrade** note. Keep the project's own content in `AGENTS.md`, and ask before removing anything.
- Run `node .devbook/skills/devbook-setup/scripts/link.mjs --assistants <list>` to refresh links and generated files, with the list from the Assistants line in `AGENTS.md` (default `claude,copilot`), then `verify.mjs` with the same list until it exits 0.

## 4. Report

Report the old and new versions, the files you changed, the **Upgrade** notes applied or skipped and why, and remind the user to review the diff, commit it and start a new chat.
