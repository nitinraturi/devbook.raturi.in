# Devbook enforcement kit

Instruction files are context: an assistant can still miss or skip a rule. The kit turns a few rules into checks that tools run, so breaking them fails loudly. It is optional, and setup never installs it without asking.

| Part | What it does | Install |
|---|---|---|
| `claude-code/` | `PreToolUse` hooks that block `git push`, changes to `.env` files, and recursive `rm` outside the project, each with a message telling the agent what to do instead, and a `SessionStart` hook that says when a newer Devbook release exists | Merge `claude-code/settings.json` into `.claude/settings.json` |
| `pre-commit/` | A gitleaks secret scan before each commit, and a Conventional Commits check on each message | Link the scripts into `.git/hooks/`, or use `.pre-commit-config.yaml` |
| `ci/` | Starter GitHub Actions workflows for Node.js and Python: install from the lockfile, format, lint, typecheck, test, build, audit dependencies, and check that every action is pinned to a commit SHA | Copy one to `.github/workflows/ci.yml` and `zizmor.yml` to `.github/zizmor.yml` |

## Claude Code hooks

The hooks need Node.js 18 or later on the `PATH`, and run from `.devbook/kit/`, so they update with Devbook. If `.claude/settings.json` already exists, add the `PreToolUse` entries to its `hooks` instead of replacing the file. Run `/hooks` in Claude Code to see that they are active.

- `block-git-push.mjs` blocks `git push` in any form (`git -C dir push`, after `&&`, inside `sh -c`). The agent tells the user the branch is ready instead.
- `protect-env.mjs` blocks edits to `.env`, `.env.local` and similar files through the edit tools and shell redirects, `sed -i`, `cp`, `mv` and `rm`. `.env.example`, `.env.sample` and `.env.template` stay editable. Reading is not blocked.
- `check-version.mjs` runs when a session starts. If the project pins a release and a newer one exists, it asks the agent to tell you and offer the `devbook-upgrade` skill. It checks the network at most once a day, caches the answer in the temp folder, and prints nothing when up to date, offline or following `main`.
- `guard-rm.mjs` blocks `rm -r` whose target resolves outside the project, or that uses a variable it can't check. The temp folder is allowed.

The hooks are guardrails against mistakes, not a sandbox: a determined agent can still write a script that does the same thing. For hard limits, also use [permission rules](https://code.claude.com/docs/en/permissions) and run untrusted work in a container. If `.devbook/` is missing, for example in a cloud checkout without submodules, the hooks report an error and let the call through.

Test them with `npm run test:kit` in the Devbook repository.

## Git hooks

Install [gitleaks](https://github.com/gitleaks/gitleaks#installing), then either link the scripts:

```sh
ln -s ../../.devbook/kit/pre-commit/pre-commit .git/hooks/pre-commit
ln -s ../../.devbook/kit/pre-commit/commit-msg .git/hooks/commit-msg
```

or, with the [pre-commit](https://pre-commit.com) framework, copy `pre-commit/.pre-commit-config.yaml` to the repository root and run `pre-commit install`. Links in `.git/hooks/` are per clone, so each developer runs the command once. Mark a false positive with a `gitleaks:allow` comment on the line. Hooks can be skipped with `--no-verify`, so CI should scan too.

## CI

The workflows run each check as its own step, so a failure names the check. Rename the scripts to the project's own, delete steps that don't apply, and keep `--audit-level=high` unless a known, unfixable advisory is tracked. Then turn on branch protection for `main` and make both jobs required, so a failing check blocks the merge.

## Where each enforced rule is checked

When the rules were pruned (`docs/plans/prune-audit.md`), these rules were marked "Enforce": a tool checks them better than text. Each keeps a short pointer in its instruction file.

| Rule | Checked by |
|---|---|
| CORE-20: formatter, linter, strict types, CI fails on warnings | `ci/`: format, lint and typecheck steps; set the linter to fail on warnings |
| CORE-21: Conventional Commits | `pre-commit/commit-msg` |
| CORE-05: commit, push and deploy only when asked | `claude-code/hooks/block-git-push.mjs`; deploys stay a text rule |
| SEC-03: secrets stay out of the repository | `pre-commit/pre-commit` (gitleaks) and `claude-code/hooks/protect-env.mjs` |
| SEC-19: lockfiles, install from them, audit in CI | `ci/`: `npm ci` or `uv sync --locked`, then `npm audit` or `pip-audit` |
| SEC-19: pin CI actions to commit SHAs | `ci/`: the zizmor job with `zizmor.yml` |
| SEC-18: HTTPS, HSTS and security headers | Not in the kit: assert the headers in an end-to-end test or a post-deploy check (`curl -sI`) |
| TEST-08: every pull request runs all checks; a failure blocks merging | `ci/` plus branch protection with required checks |
| DES-05: axe on every page template (contrast, names, landmarks, headings) | Not in the kit: run axe in end-to-end tests, such as `@axe-core/playwright`, on one page per template |
| PERF-02: budgets and Lighthouse scores in CI | Not in the kit: Lighthouse CI assertions, or `size-limit` for bundles |
| LIC-02: dependency licences against an allowlist | Not in the kit: `license-checker` (npm) or `pip-licenses` (Python) in CI, with the project's allowlist |

## Licence

The kit is code, licensed [MIT-0](../LICENSE): copy and change it without credit.
