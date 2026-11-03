---
title: Use Devbook day to day
description: How to ask for work once Devbook is set up, add your own rules and skills, use the built-in reviews, and know when to re-run the prompt.
sidebar:
  order: 3
---

After setup you work as before. The core block loads in every session, and skills load only when a request matches them.

## Ask for work

Say what you want, the scope, and how you'll know it's done: "Fix the rounding bug in `src/cart.js`. Done means a test that reproduced it passes." You don't need to repeat Devbook's rules. Expect the agent to run your commands and show their output, to stop and ask before risky changes, and to leave the commit to you.

## Add your own rules

Put them under "## Project rules" in `AGENTS.md`, outside the Devbook markers. They win over the Devbook block. Keep each rule to one line and add the reason when it isn't obvious: "Use `pnpm`, never `npm`; the lockfile is pnpm's." If the agent keeps getting the same thing wrong, that is a project rule worth adding.

Your own skills go in `.claude/skills/` or `.agents/skills/`. Devbook never renames or overwrites them.

## Use the built-in reviews

Claude Code has review commands built in, so Devbook doesn't add its own:

- `/code-review`: correctness bugs in the current diff or a pull request.
- `/security-review`: vulnerabilities on the current branch.
- `/verify`: builds, runs and observes the change in the real app.
- `/simplify`: cleans up the changed code.

## Re-run the prompt when

- you add a stack, such as Supabase or Expo, and want its vendor skills;
- you switch or add an agent;
- a month or two has passed: Update mode shows which pinned sources moved and why.

## When something goes wrong

If the agent ignores a line of the core block, [report it](https://github.com/nitinraturi/devbook.raturi.in/issues/new/choose): reports become measured eval cases. If a catalog source misbehaves, uninstall it with the tool that installed it, and tell the maintainer so the catalog can retire it.
