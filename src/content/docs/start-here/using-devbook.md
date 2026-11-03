---
title: Use Devbook day to day
description: 'How to work with Devbook after setup: the plan, build and verify loop, which skills fit common tasks, example prompts, and when to re-run the prompt.'
sidebar:
  order: 3
---

After setup you work as before. The core block loads in every session, and each skill loads only when a request matches its description or when you name it.

## Ask for work

Say what you want, the scope, and how you'll know it's done: "Fix the rounding bug in `src/cart.js`. Done means a test that reproduced it passes." You don't need to repeat Devbook's rules. Expect the agent to run your commands and show their output, to stop and ask before risky changes, and to leave the commit to you.

Give the agent what it can't read from the repository: who the feature is for, the rules it must follow, real copy or data, and a screenshot or mockup if you have one. Paste the image instead of describing it.

## Name a skill when it matters

Agents pick a skill by matching your request to its description. When several skills could match, or one doesn't load, name it.

| Agent | Name a skill | See installed skills |
|---|---|---|
| Claude Code | `/skill-name`; plugin skills are `/plugin:skill` | `/skills`, or type `/` |
| Codex | `$skill-name`, or pick it from `/skills` | `/skills` |
| Cursor | type `/` in Agent chat and pick it | Customize, then Skills |
| GitHub Copilot CLI | `/skill-name` in your prompt | `/skills list` |
| Gemini CLI | ask for it, then approve the activation prompt | `/skills list` |

[Setup](/start-here/setup/) lists where each agent keeps skills.

To check a skill was used, ask "which skills did you use, and what did each one change?" and look for its usual output, such as `api-design` editing the OpenAPI document before any handler. A skill loading only shows the agent found it. In Claude Code, `/skill-doctor` shows how often each skill runs; after a long session is compacted, name the skill again so its full text reloads.

Devbook installs only a few skills per project, because a long skill list crowds out the descriptions agents match on. Choose them per project, not per task: re-run the prompt to swap one.

## Plan, build, verify

Most work follows the same loop. The core block already asks for a plan before multi-file changes, a failing test before a bug fix, real command output before "done", and no commits unless you ask.

1. **Shape.** If you haven't decided what you want, say: "Interview me until you could write the spec, then write it to `SPEC.md`." For a feature with business rules, ask for a feature doc instead; the `feature-doc` skill writes `FEATURE.md`.
2. **Plan.** Start a fresh session from the spec, so the build begins with a clean context and a written definition of done. Use plan mode for anything that touches several files: Shift+Tab in Claude Code, Codex and Cursor, or `/plan` in Claude Code and Codex. Approve or edit the plan before any file changes.
3. **Build.** Name the skill for the area, such as `api-design` or `frontend-design`. Ask for one step at a time when the plan is long.
4. **Verify.** Ask for evidence: the commands it ran and their output, and a screenshot for anything visual. In Claude Code, `/verify` builds and runs the app and looks at the result.
5. **Review.** Use a context that didn't write the code. In Claude Code, run `/code-review` and, for anything touching input, auth or data, `/security-review`. In other agents, start a new session and ask it to review the diff against the spec. Add "report gaps that affect correctness and skip style", or the review adds layers you don't need.
6. **Commit.** You review the diff and commit.

Run `/clear` (Claude Code) or start a new chat between unrelated tasks. If you've corrected the agent twice on the same thing, start over with a better prompt instead of a third correction.

If you turned on Superpowers, it runs this loop for you, but some of its steps commit a design doc and offer to merge, push or open a pull request. Say "don't commit; I'll commit" when you start, and choose to keep the branch at the end. Outside Claude Code, Devbook installs only its test-driven-development skill.

## Recipes

Each recipe names the catalog skills to use if your project has them. The [catalog](/catalog/) lists every skill, its pinned version and how it installs.

### Design a home page

Skills: `frontend-design` (turn it on in the practice group), plus `react-best-practices` in a React or Next.js project.

`frontend-design` drafts a token plan (colours, type, layout wireframes) and critiques it before building. Give it the subject, the audience, the page's one job and real copy, and it will avoid generic defaults where you leave it free.

> Design the home page for <product>, a <one line> for <audience>. Its one job is to get visitors to <action>. Use the copy in `@docs/copy.md`. Brand: <colours and fonts, or "your choice">. Reference: [pasted screenshot]. No new dependencies. Show me your token plan and a wireframe first, and build only after I confirm. Done means the build passes and you show screenshots at 360 px and at desktop width, with keyboard focus visible and text contrast meeting WCAG AA.

Then iterate: "Compare your screenshot to the reference, list the three biggest differences, fix them and screenshot again." In Claude Code, `/verify` and Claude in Chrome can take and compare the screenshots.

The catalog has no adopted UI review skill yet. Your project's accessibility and contrast checks, if it has them, are the review.

### Plan or change code structure

Skills: none needed. Use plan mode and ask for options before any edit.

> In plan mode: propose how to split `src/server/` into modules by domain. Give two or three options with trade-offs and an order of steps that keeps the tests passing after each one. List the files you would create, move and delete. Don't edit yet.

Then: "Do step 1 only. Run the tests before and after and show both outputs." If the code has no tests, ask for tests that pin the current behaviour first. For a change that should look identical, compare screenshots before and after. In Claude Code, `/simplify` and `/code-review` clean up and check the result.

Add the structure you settle on as a one-line project rule, such as "API handlers live in `src/api/handlers/`, one file per resource", so later sessions follow it.

### Write an API endpoint

Skills: `api-design`, plus `db-migration` if the endpoint needs a new table or column.

`api-design` updates the OpenAPI document before the code and stops to ask before a breaking change. `db-migration` shows the schema plan and waits for your approval. Tell the agent what it can't infer: the resource and fields, who may do what, validation rules, pagination, and whether creates must be idempotent.

> Add `GET /invoices` and `POST /invoices`. Invoices belong to an organisation; members can list and create them, and only admins can void one. Validate with the existing schemas, use cursor pagination and our existing error format. Update `openapi.yaml` first. Done means contract tests for success, 422, 401, 403 and 404 pass and the project's checks pass.

Expect it to ask before adding the table, before adding a new role or changing auth middleware, and before adding a secret.

### Build a fullstack feature

Skills: `feature-doc` for the rules, `api-design` for the contract, `db-migration` for the schema, and your stack's skill, such as `supabase`, `cloudflare` or `react-best-practices`.

Keep one contract between the two halves. Make the OpenAPI document the source of truth and generate the frontend's client types from it, so the typecheck fails wherever the frontend and the API disagree.

> Here is `FEATURE.md` for team invites. Plan the feature in plan mode: the API contract first, then the migration, then the backend with a failing contract test for each rule, then the frontend using a client generated from the contract. Wait for my approval at the plan and at the migration. Done means the typecheck, unit and contract tests and an end-to-end test of the invite flow against the real backend pass, and you show their output.

A small feature fits one session. For a larger one, build and review the API in one session, then build the frontend in a fresh session once the contract is stable.

### Design an iOS screen

Skills: the catalog has none for SwiftUI yet. In Claude Code, the `lsp` entry adds Swift diagnostics. Not in the catalog: [Apple's Xcode MCP server](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode) lets Claude Code and Codex build the project, render previews and, in recent Xcode versions, run the app in a simulator and take screenshots. Approve agents one at a time; leave Xcode's option to approve every agent up front turned off.

Agents often write SwiftUI APIs that still compile but are deprecated. Add a project rule for it: "Target iOS <version>; use `NavigationStack`, `foregroundStyle` and `@Observable`; use text styles, never fixed font sizes; give every icon-only button an `accessibilityLabel`."

> Plan a SwiftUI settings screen in `SettingsView.swift` with Account, Notifications and About sections. System colours and text styles only. Show the plan and wait.

> Implement the plan. Add previews for light mode, dark mode and the largest accessibility text size, and for the empty and error states. Done means the scheme builds, the previews render, you show me the preview images, and a UI test that runs `performAccessibilityAudit()` on the screen passes. Hit targets are at least 44x44 pt.

Expect the agent to ask before it changes signing, entitlements, privacy keys in `Info.plist` or build settings.

### Create an Astro static site

Skills: the catalog has none for Astro; `frontend-design` helps with the design. Astro publishes `llms.txt` files and a docs MCP server; the catalog lists the server as suggested only.

Ask the agent to use Astro's own tools rather than writing config by hand, and to check the current docs for content collections, which have changed.

> Create an Astro static site in `./site` with `npm create astro@latest` and the template I choose; ask me which. Add integrations only with `astro add`, never by editing `package.json`. Put posts in a content collection defined in `src/content.config.ts`, and check the current Astro docs before you write it. Done means `npx astro check` and `npm run build` exit 0 and you show their output, then a screenshot of `npm run preview`.

For a documentation site, the template is `starlight`. On macOS and Linux, recent Astro versions run the dev server in the background when they detect an agent, so the agent's terminal stays free.

## When no skill fits

For work the catalog doesn't cover, add what you need yourself:

- A repeated mistake: a one-line project rule (below).
- A repeated procedure: your own skill in `.claude/skills/` or `.agents/skills/`. Devbook never renames or overwrites it.
- A vendor skill you think belongs in the catalog: [suggest it](https://github.com/nitinraturi/devbook.raturi.in/issues/new/choose). Devbook adds a source only after reading every file at a pinned version.

## Add your own rules

Put them under "## Project rules" in `AGENTS.md`, outside the Devbook markers. They win over the Devbook block. Keep each rule to one line and add the reason when it isn't obvious: "Use `pnpm`, never `npm`; the lockfile is pnpm's." If the agent keeps getting the same thing wrong, that is a project rule worth adding.

## Use the built-in reviews

Claude Code has review commands built in, so Devbook doesn't add its own:

- `/code-review`: correctness bugs in the current diff or a pull request.
- `/security-review`: vulnerabilities on the current branch.
- `/verify`: builds, runs and observes the change in the real app.
- `/simplify`: cleans up the changed code.

## Re-run the prompt when

- you add a stack, such as Supabase or Expo, and want its vendor skills;
- you want to swap which skills are on;
- you switch or add an agent;
- a month or two has passed: Update mode shows which pinned sources moved and why.

Move pinned skills by re-running the prompt, not with `gh skill update --unpin`, which drops the pin your lock file records. `gh skill update --dry-run` is a safe way to see whether a source has moved.

## When something goes wrong

If the agent ignores a line of the core block, [report it](https://github.com/nitinraturi/devbook.raturi.in/issues/new/choose): reports become measured eval cases. If a catalog source misbehaves, remove it and tell the maintainer so the catalog can retire it. For a Claude Code plugin, run `claude plugin uninstall <name> --scope project`. For a skill installed with `gh skill`, delete its folder in `.claude/skills/` or `.agents/skills/`, since `gh skill` has no remove command. Then re-run the prompt so `devbook.lock.json` matches.
