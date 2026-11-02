---
name: devbook-setup
description: "Connects Devbook (in .devbook/) to a project: chooses the instruction files, writes AGENTS.md, CLAUDE.md and the Copilot file, and links path rules and skills with a script. Use when asked to set up, re-run or repair Devbook setup."
license: CC-BY-4.0
---

# Set up Devbook

Devbook is already in `.devbook/` (the setup prompt added it). Do the setup; don't just describe it. Don't change app code, install packages, read secrets or `.env` values, commit, push or deploy.

## 1. Inspect

- Read the README, existing agent files (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.claude/rules/`, `.claude/skills/`, `.github/instructions/`), manifests, scripts, source layout and CI.
- If the project is empty, ask what it is, who it is for and which stack and hosting to use before step 3.

## 2. Choose the files

Instruction files load in three ways. Pick the ones that apply:

| File | Choose it when | How it loads |
|---|---|---|
| core, security, testing | Always | Every chat (`@` import) |
| security-web | It serves pages or an API to browsers, or has its own sign-in (choose it with design or any web backend) | By file path |
| design | The project has any user interface | By file path |
| api-data | It has a backend or API | By file path |
| database | It stores data in a relational database | By file path |
| seo, content | It is a public website, docs site or blog | By file path |
| mobile | It is an iOS, Android, React Native or Flutter app | By file path |
| performance | Any app, site or service (skip for libraries and scripts) | Read when relevant |
| licensing | It is published or distributed, or ships third-party code, fonts, images or data | Read when relevant |
| feature-docs | Its features have business rules, states or permissions | Read when relevant |
| A stack note from `.devbook/stacks/` | For each technology the project actually uses | Read when relevant |

## 3. Write the agent files

- `AGENTS.md`: start from `.devbook/templates/AGENTS.md`, or merge it into the existing file without losing content. Fill the Project section with facts you verified from the repo: real commands, stack and layout. Mark unknowns as TODO. In the Devbook section, keep the three `@` lines, the `devbook-upgrade` line and only the "read when" lines for the files chosen in step 2, and remove the template comments. Every chosen file gets a "read when" line, path-scoped ones too, so assistants without path rules still find them.
- `CLAUDE.md`: must contain the line `@AGENTS.md`. Keep any existing content.
- `.github/copilot-instructions.md`: copy `.devbook/templates/copilot-instructions.md`, or add its text to the existing file.
- If existing project rules conflict with Devbook, list the conflicts and ask. Don't silently drop either side.

## 4. Link the path rules and skills

Run the link script from the repository root. It reads the files `AGENTS.md` lists and links, from `.devbook/devbook.manifest.json`, each path-scoped instruction into `.claude/rules/` and `.github/instructions/`, and the matching skills into `.claude/skills/`. Every project gets `devbook-security-review`, `devbook-release-check` and `devbook-upgrade`; `devbook-feature-doc`, `devbook-api-endpoint`, `devbook-db-migration` and `devbook-seo-audit` come with feature-docs, api-data, database and seo. It never links `devbook-setup`, and it copies files with a generated-file header where symlinks don't work.

Ask which assistants the team uses, or infer it from the repo (`.cursor/`, `.codex/`, Copilot code review in `.github/`), and pass them as `--assistants`: `claude` and `copilot` (the default), `cursor` (generated `.cursor/rules/*.mdc`), `codex` (skills in `.agents/skills/`) and `copilot-review` (copies Copilot code review can read on github.com, plus the always-loaded rules as a Copilot instruction).

```sh
node .devbook/skills/devbook-setup/scripts/link.mjs --dry-run --assistants claude,copilot   # check the plan first
node .devbook/skills/devbook-setup/scripts/link.mjs --assistants claude,copilot
node .devbook/skills/devbook-setup/scripts/gitignore-secrets.mjs   # SEC-29
```

- Compare each linked file's `paths:` globs with the project's layout. If the project's files for that topic wouldn't match (for example, UI in `.py` templates), tell the user; the "read when" line still covers it.
- If a line says `skipped`, a file the project made is in the way; ask before replacing it.
- Claude Code asks before writing to `.claude/`. If that write is refused, finish the rest and give the user the commands above.

## 5. Offer the enforcement kit

`.devbook/kit/` turns a few rules into checks (see `.devbook/kit/README.md`). Ask the user which parts they want, and install only those. If they don't answer, skip it and mention it in the report.

- Claude Code hooks that block `git push`, `.env` edits and recursive `rm` outside the project, and say when a newer Devbook version is on `main`: merge the `hooks` from `.devbook/kit/claude-code/settings.json` into `.claude/settings.json`, keeping existing settings. They need Node.js on the `PATH`.
- A gitleaks secret scan and a Conventional Commits check on each commit: give the user the link commands from the kit README, because `.git/hooks/` is per clone.
- A weekly Devbook version check for every assistant: copy `.devbook/kit/ci/devbook-version.yml` to `.github/workflows/`. It only warns in the job summary.
- Starter CI: copy `.devbook/kit/ci/node.yml` or `python.yml` to `.github/workflows/ci.yml` only if the project has no CI. Change the commands to the project's real ones, and copy `zizmor.yml` to `.github/zizmor.yml`.

## 6. Verify and report

- Run `node .devbook/skills/devbook-setup/scripts/verify.mjs --assistants <the same list>` and fix every problem it lists until it exits 0. Record the list in the Project section of `AGENTS.md` (`- Assistants: claude, copilot`), so upgrades pass it again.
- Report the files you changed, the Devbook version (from `.devbook/VERSION`), the kit parts installed or declined, the instruction files and skills you chose and why, and any TODOs or questions.
- Remind the user to commit `.devbook`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.claude/rules/`, `.claude/skills/`, `.github/instructions/` and any kit files, plus `.gitmodules` for a submodule; to clone with `--recurse-submodules`; and to start a new chat so the instructions load.
