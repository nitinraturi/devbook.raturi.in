Set up Devbook instructions in this project. Do the setup; don't just describe it.
Method: submodule
(Use "submodule" to track Devbook updates, or "copy" to commit plain files.)

1. Add Devbook to .devbook/
- If .devbook/ already exists, keep its current method (a submodule has a
  .devbook/.git file).
- Submodule: if .devbook/ is missing, run:
  git submodule add -b main https://github.com/nitinraturi/devbook.raturi.in .devbook
  If it exists, run: git submodule update --init --remote .devbook
- Copy: from the repository root, run:
  rm -rf .devbook && mkdir -p .devbook && curl -fsSL https://codeload.github.com/nitinraturi/devbook.raturi.in/tar.gz/main | tar -xz --strip-components=1 -C .devbook devbook.raturi.in-main/instructions devbook.raturi.in-main/stacks devbook.raturi.in-main/templates devbook.raturi.in-main/skills devbook.raturi.in-main/LICENSE-CC-BY-4.0
  On Windows PowerShell, use the PowerShell command from
  https://devbook.raturi.in/start-here/setup/ instead.
  Don't edit the copied files. Put project rules in AGENTS.md instead.
- If the command fails or there is no network, stop and tell me.

2. Connect it
- Read .devbook/skills/devbook-setup/SKILL.md and follow it. It chooses
  the instruction files, writes AGENTS.md, CLAUDE.md and the Copilot file,
  and links path rules and skills. Do not commit, push or deploy.
