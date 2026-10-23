Set up Devbook instructions in this project. Do the setup; don't just describe it.

1. Inspect
- Read the existing README, agent instruction files (AGENTS.md, CLAUDE.md,
  .github/copilot-instructions.md), manifests, scripts, source layout and CI.
- Do not read secrets or .env values. Do not change app code, install
  packages, commit, push or deploy.
- If the project is empty, ask me what it is, who it is for and which stack
  and hosting to use before step 3.

2. Add Devbook
- If .devbook/ is missing, run:
  git submodule add -b main https://github.com/nitinraturi/devbook.raturi.in .devbook
- If it exists, run: git submodule update --init --remote .devbook
- If git or the network is unavailable, stop and tell me.

3. Choose the instruction files
- Always: workflow, engineering, security.
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
  - commit .gitmodules, .devbook, AGENTS.md, CLAUDE.md and
    .github/copilot-instructions.md;
  - clone with --recurse-submodules;
  - update Devbook later with: git submodule update --remote .devbook
- Then tell me to start a new chat so the instructions load.
