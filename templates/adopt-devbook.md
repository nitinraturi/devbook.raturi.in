Adopt Devbook in this project. Perform the setup, not just a plan.

1. Inspect first
- Read existing repository instructions, README, docs, manifests, lockfiles,
  build/test scripts, source structure, CI and hosting configuration.
- Check git status. Preserve unrelated work, existing instructions and docs.
- Do not read secrets, .env values or credentials. Do not change app code,
  install dependencies, deploy, migrate hosting, commit or push.
- If this is an empty/new project, ask for its purpose, users, scope and
  intended stack/hosting before drafting project-specific documents.

2. Make the rules available locally
- Use https://github.com/nitinraturi/devbook.raturi.in, pinned to v1.0.0.
- In an existing Git repo, add it as a submodule at docs/devbook and check
  out v1.0.0. Do not run install/build commands inside Devbook.
- If docs/devbook already exists, inspect its origin, pin and worktree first.
  Reuse a clean matching v1.0.0 checkout. Do not replace a directory, discard
  changes or switch an existing pin without approval.
- If there is no Git repo, or submodules/network access are unavailable,
  explain the blocker and ask before choosing another installation method.
  Stop on failed commands; never claim setup succeeded without local rules.
- Treat docs/devbook as read-only. Do not paste its rule text into project
  docs; the sync tool in step 3 is the only way rules enter the project.

3. Install the mandatory baseline (not optional, not selected by you)
- Choose profiles from evidence: core always; web if it serves HTML or
  a web UI; mobile for iOS/Android/React Native/Flutter apps; llm-features
  if it calls a language model at runtime. Ask if the evidence is unclear.
- From the project root run:
  node docs/devbook/bin/devbook-sync.mjs --profiles <web,mobile,llm-features>
  It writes devbook.json, .claude/rules/devbook-*.md and
  .github/instructions/devbook-*.instructions.md. Never edit those files.
  If Node 18+ is unavailable, stop and ask; do not hand-copy the rules.
- If CI is GitHub Actions, copy docs/devbook/templates/devbook-check.yml to
  .github/workflows/devbook.yml. Otherwise add the same step to existing CI:
  node docs/devbook/bin/devbook-sync.mjs --check (with submodules checked out).

4. Connect Claude, Copilot and other agents
- Use docs/devbook/templates/AGENTS.md as a structure, not a file to copy
  unchanged. Create or merge the root AGENTS.md with real project commands,
  conventions and links to existing project docs. Keep its baseline section.
- Record Devbook v1.0.0, the chosen profiles, and only the relevant stack
  pages under docs/devbook/src/content/docs/stacks/ as exact local paths.
- Create or merge CLAUDE.md from docs/devbook/templates/CLAUDE.md (it imports
  @AGENTS.md) and .github/copilot-instructions.md from its template.
- Preserve existing tool-specific instructions. If one contradicts the
  baseline, list the conflict and ask; never weaken the baseline silently.
  Fill all placeholders with verified facts or labelled open questions.
- Preserve the existing platform. For Cloudflare Pages, read the Cloudflare
  stack page but document the actual Pages build/output settings.
  Do not migrate to Workers or assume a framework, output directory or command.

5. Draft only the missing project context
- Reuse existing docs and link to them; do not create parallel competing specs.
- Use the project-brief, technical-spec and project-readme templates in
  docs/devbook/templates/ as outlines for missing project docs.
- For an existing app, describe the current implementation with source-file
  evidence for stack, commands, architecture, routes, data and integrations.
  Distinguish observed behavior from proposed acceptance criteria.
- Product goals, target users, success measures, privacy policies and historical
  decisions cannot be assumed from code. Mark unknowns as TODO/open questions
  and keep drafts unapproved; ask only the questions needed to proceed.
- Link a docs index to the brief, spec and existing docs; create docs/adr/ for
  future decisions without inventing retrospective ADRs. Add conditional docs
  such as a design system only when useful and supported by evidence.

6. Verify and hand off
- Run node docs/devbook/bin/devbook-sync.mjs --check and show its output.
  Check every instruction link exists, all agent entry files route
  consistently, and the submodule is on v1.0.0.
- Run relevant available project checks when safe; report missing or failing
  checks explicitly. Do not install tooling or claim unrun checks passed.
- Report the pin, profiles, changed/reused files, checks and open questions.
  Remind me to review drafts, commit the setup (including .gitmodules, the
  pin and generated rule files) and make the devbook CI check required on
  main. Future clones need git clone --recurse-submodules.
- Give me one ready-to-use next task prompt for this project. After reviewing
  setup, I will start a new Claude/Copilot chat so it loads the new instructions.
