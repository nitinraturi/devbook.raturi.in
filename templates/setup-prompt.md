Set up Devbook instructions in this project. Do the setup; don't just describe it.
Method: submodule
(Use "submodule" to track Devbook updates, or "copy" to commit plain files.)

1. Inspect
- Read the existing README, agent instruction files (AGENTS.md, CLAUDE.md,
  .github/copilot-instructions.md), manifests, scripts, source layout and CI.
- Do not read secrets or .env values. Do not change app code, install
  packages, commit, push or deploy.
- If the project is empty, ask me what it is, who it is for and which stack
  and hosting to use before step 3.

2. Add Devbook to .devbook/
- If .devbook/ already exists, keep its current method (a submodule has a
  .devbook/.git file).
- Submodule: if .devbook/ is missing, run:
  git submodule add -b main https://github.com/nitinraturi/devbook.raturi.in .devbook
  If it exists, run: git submodule update --init --remote .devbook
- Copy: from the repository root, run:
  rm -rf .devbook && mkdir -p .devbook && curl -fsSL https://codeload.github.com/nitinraturi/devbook.raturi.in/tar.gz/main | tar -xz --strip-components=1 -C .devbook devbook.raturi.in-main/instructions devbook.raturi.in-main/stacks devbook.raturi.in-main/templates
  Don't edit the copied files. Put project rules in AGENTS.md instead.
- If the command fails or there is no network, stop and tell me.

3. Choose the instruction files
- Always (mandatory): core, security, testing.
- performance, for any app, site or service (skip for libraries and scripts).
- api-data, if it has a backend, API or database.
- design, if the project has any user interface.
- seo and content, if it is a public website, docs site or blog.
- mobile, if it is an iOS, Android, React Native or Flutter app.
- A stack note from .devbook/stacks/ for each technology the project
  actually uses. Skip the ones it doesn't use.

4. Write the agent files
- AGENTS.md: start from .devbook/templates/AGENTS.md, or merge it into the
  existing file without losing content. Fill the Project section with facts
  you verified from the repo: real commands from package.json or equivalent,
  stack and layout. Mark unknowns as TODO. In the Devbook section, keep only
  the @ lines for the files chosen in step 3, and remove the template comments.
- CLAUDE.md: must contain the line @AGENTS.md. Keep any existing content.
- .github/copilot-instructions.md: copy .devbook/templates/copilot-instructions.md,
  or add its sentence to the existing file.
- If existing project rules conflict with Devbook, list the conflicts and
  ask me. Don't silently drop either side.

5. Verify and report
- Confirm every @ path in AGENTS.md exists.
- Report the files you changed, the instruction files you chose and why,
  and any TODOs or questions.
- Remind me to:
  - commit .devbook, AGENTS.md, CLAUDE.md and
    .github/copilot-instructions.md, plus .gitmodules for a submodule;
  - for a submodule, clone with --recurse-submodules;
  - update Devbook later by rerunning the step 2 command for the method
    used.
- Then tell me to start a new chat so the instructions load.
