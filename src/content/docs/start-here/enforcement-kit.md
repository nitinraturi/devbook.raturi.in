---
title: Enforcement kit
description: Install the optional Devbook kit - Claude Code hooks that block risky commands and flag new releases, git hooks for secrets and commit messages, and starter CI.
sidebar:
  order: 4
---

The kit turns a few Devbook rules into checks that tools run, because an assistant can miss a rule it has read but can't get past a hook that blocks it. Each part is optional and independent. The setup prompt asks before installing any of them, and you can add or remove a part at any time.

| Part | Stops or reports | Needs |
|---|---|---|
| [Claude Code hooks](#claude-code-hooks) | `git push`, edits to `.env` files, recursive `rm` outside the project; a newer Devbook release | Claude Code, Node.js 18 or later |
| [Git hooks](#git-hooks) | Secrets in staged changes; commit messages that aren't Conventional Commits | [gitleaks](https://github.com/gitleaks/gitleaks#installing) |
| [Starter CI](#starter-ci) | A pull request that fails format, lint, types, tests, build or the dependency audit, or uses an unpinned action | GitHub Actions |

The files are in `.devbook/kit/`, which Devbook's copy and submodule methods both include. The [kit README](https://github.com/nitinraturi/devbook.raturi.in/blob/main/kit/README.md) maps each rule to the check that enforces it.

## Claude Code hooks

Claude Code runs [hooks](https://code.claude.com/docs/en/hooks) before each tool call and at the start of each session. The kit has four:

- `block-git-push` blocks `git push` in any form, including `git -C app push`, after `&&` and inside `sh -c`. Pushing stays your decision.
- `protect-env` blocks changes to `.env`, `.env.local` and similar files, through the edit tools or shell commands such as `>`, `sed -i`, `cp` and `mv`. `.env.example` stays editable, and reading isn't blocked.
- `guard-rm` blocks `rm -r` when the target resolves outside the project, or uses a variable it can't check. The temp folder is allowed.
- `check-version` runs when a session starts. If you pin a release and a newer one exists, the assistant tells you and asks whether to upgrade. It checks at most once a day and adds nothing to the chat when you are up to date.

### Install

If the project has no `.claude/settings.json`, copy the kit's:

```sh
mkdir -p .claude && cp .devbook/kit/claude-code/settings.json .claude/settings.json
```

If it has one, add the kit's `SessionStart` and `PreToolUse` entries to its `hooks` object instead, keeping your own entries. Commit `.claude/settings.json` so everyone working on the project gets the same hooks. Then start a new session and run `/hooks` to see that they are active.

### What a block looks like

The agent sees the hook's message as the tool result and stops. This is from a test session in which the agent was asked to delete a folder next to the project (home folder shortened to `/Users/me`):

```text
Blocked by the Devbook kit: rm -r ../victim would delete /Users/me/devbook-kit-test/victim,
which is not inside the project (/Users/me/devbook-kit-test/proj). Only delete files inside
the project; if this deletion is really needed, ask the user to run it.
```

The agent then replied that it hadn't run the command, gave the command to run yourself, and didn't try another way. When a block is what you want to override, run the command yourself.

### Turn a hook off

Delete its entry from `.claude/settings.json`, then start a new session.

## Git hooks

Install [gitleaks](https://github.com/gitleaks/gitleaks#installing), then link the two scripts. Links in `.git/hooks/` aren't committed, so each developer runs this once per clone:

```sh
ln -s ../../.devbook/kit/pre-commit/pre-commit .git/hooks/pre-commit
ln -s ../../.devbook/kit/pre-commit/commit-msg .git/hooks/commit-msg
```

If the project uses the [pre-commit](https://pre-commit.com) framework, copy `.devbook/kit/pre-commit/.pre-commit-config.yaml` to the repository root and run `pre-commit install` instead.

- **Secret scan:** each commit runs `gitleaks git --pre-commit --redact --staged`. A finding stops the commit and shows the file, line and rule, with the secret redacted. Remove the secret, rotate it if it was ever pushed, and commit again. For a false positive, add a `gitleaks:allow` comment on that line.
- **Commit messages:** the subject must look like `fix(api): reject expired tokens`, with a type such as `feat`, `fix`, `docs` or `chore`. Merge, revert and fixup commits are allowed.

`git commit --no-verify` skips both, so add a secret scan to CI as well if a leak would be costly.

## Starter CI

The kit has a GitHub Actions workflow for Node.js and one for Python (with uv). Each runs every check as its own step, so a failure names the check, and a second job runs [zizmor](https://docs.zizmor.sh) to fail on actions that aren't pinned to a commit SHA.

```sh
mkdir -p .github/workflows
cp .devbook/kit/ci/node.yml .github/workflows/ci.yml     # or python.yml
cp .devbook/kit/ci/zizmor.yml .github/zizmor.yml
```

1. Change the commands to your project's real scripts, and delete steps that don't apply.
2. Push a branch and open a pull request to see it run.
3. In the repository's branch protection for `main`, make the `check` and `workflows` jobs required, so a failing check blocks the merge.

The actions are pinned to commit SHAs. [Dependabot](https://docs.github.com/en/code-security/dependabot) can keep them current.

## Limits

- The hooks catch mistakes. They aren't a sandbox: a script written to get around them still runs. For hard limits, also use Claude Code [permission rules](https://code.claude.com/docs/en/permissions) and run untrusted work in a container.
- If `.devbook/` is missing, for example in a cloud checkout without submodules, the hooks report an error and let the call through.
- The Claude Code hooks work only in Claude Code. Copilot and other assistants still follow the written rules, and the git hooks and CI apply to everyone.
- Security headers, accessibility, performance budgets and licence scans aren't in the kit. The [kit README](https://github.com/nitinraturi/devbook.raturi.in/blob/main/kit/README.md#where-each-enforced-rule-is-checked) names the tool for each.
