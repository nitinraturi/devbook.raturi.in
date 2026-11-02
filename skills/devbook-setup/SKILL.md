---
name: devbook-setup
description: Connect Devbook (in .devbook/) to this project - choose the instruction files, write AGENTS.md, CLAUDE.md and Copilot files, and link path rules and skills. Use when asked to set up, re-run or repair Devbook setup.
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

## 4. Link the path-scoped files

For each chosen file whose frontmatter has `paths:` (security-web, design, api-data, database, seo, content, mobile), link it into both rule folders. Claude Code then loads it only when a matching file is read or edited, and Copilot when one is edited:

```sh
mkdir -p .claude/rules .github/instructions
ln -s ../../.devbook/instructions/design.md .claude/rules/devbook-design.md
ln -s ../../.devbook/instructions/design.md .github/instructions/devbook-design.instructions.md
```

- Compare the file's `paths:` globs with the project's layout. If the project's files for that topic wouldn't match (for example, UI in `.py` templates), tell the user; the "read when" line still covers it.
- If symlinks don't work (Windows without Developer Mode, or `git config core.symlinks` is `false`), skip the links, say so, and rely on the "read when" lines.

## 5. Link the skills

Link the skills that fit the project into `.claude/skills/`. Claude Code and VS Code Copilot both read that folder. Each skill's description costs a little context in every chat, so link only useful ones:

- Always: `devbook-security-review`, `devbook-release-check`, `devbook-upgrade`.
- `devbook-feature-doc` with feature-docs; `devbook-api-endpoint` with api-data; `devbook-db-migration` with database; `devbook-seo-audit` with seo.

```sh
mkdir -p .claude/skills
ln -s ../../.devbook/skills/devbook-security-review .claude/skills/devbook-security-review
```

Never link `devbook-setup` itself.

Claude Code asks before writing to `.claude/`. If that write is refused, finish the rest and give the user the exact link commands to run.

## 6. Offer the enforcement kit

`.devbook/kit/` turns a few rules into checks (see `.devbook/kit/README.md`). Ask the user which parts they want, and install only those. If they don't answer, skip it and mention it in the report.

- Claude Code hooks that block `git push`, `.env` edits and recursive `rm` outside the project, and say when a newer Devbook version is on `main`: merge the `hooks` from `.devbook/kit/claude-code/settings.json` into `.claude/settings.json`, keeping existing settings. They need Node.js on the `PATH`.
- A gitleaks secret scan and a Conventional Commits check on each commit: give the user the link commands from the kit README, because `.git/hooks/` is per clone.
- Starter CI: copy `.devbook/kit/ci/node.yml` or `python.yml` to `.github/workflows/ci.yml` only if the project has no CI. Change the commands to the project's real ones, and copy `zizmor.yml` to `.github/zizmor.yml`.

## 7. Verify and report

- Confirm every `@` path and "read when" path in `AGENTS.md` exists, and every link resolves (`ls -L .claude/rules .claude/skills .github/instructions`).
- Report the files you changed, the Devbook version (from `.devbook/VERSION`), the kit parts installed or declined, the instruction files and skills you chose and why, and any TODOs or questions.
- Remind the user to commit `.devbook`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.claude/rules/`, `.claude/skills/`, `.github/instructions/` and any kit files, plus `.gitmodules` for a submodule; to clone with `--recurse-submodules`; and to start a new chat so the instructions load.
