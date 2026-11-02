Set up Devbook instructions in this project. Do the setup; don't just describe it.
Method: submodule
(Method: "submodule" adds Devbook as a git submodule that tracks main,
"copy" commits plain files. Either way you get the latest main, and
.devbook/VERSION records its version number.)

1. Add Devbook to .devbook/
- If .devbook/ already exists, keep its method (a submodule has a
  .devbook/.git file). For a submodule, run:
  git submodule update --init .devbook
  Then do steps 1 to 3 of .devbook/skills/devbook-upgrade/SKILL.md, so
  setup runs on the newest version, and go to step 2.
- Submodule: run:
  git submodule add -b main https://github.com/nitinraturi/devbook.raturi.in .devbook && git add .devbook
- Copy: from the repository root, run:
  P=devbook.raturi.in-main && rm -rf .devbook && mkdir -p .devbook && curl -fsSL https://codeload.github.com/nitinraturi/devbook.raturi.in/tar.gz/main | tar -xz --strip-components=1 -C .devbook $P/instructions $P/stacks $P/templates $P/skills $P/kit $P/LICENSE-CC-BY-4.0 $P/VERSION $P/CHANGELOG.md
  On Windows PowerShell, use the PowerShell command from
  https://devbook.raturi.in/start-here/setup/ instead.
  Don't edit the copied files. Put project rules in AGENTS.md instead.
- If a command fails or there is no network, stop and tell me.

2. Connect it
- Read .devbook/skills/devbook-setup/SKILL.md and follow it. It chooses
  the instruction files, writes AGENTS.md, CLAUDE.md and the Copilot file,
  links path rules and skills, and asks me about the optional enforcement
  kit. Do not install the kit unless I say yes. Do not commit, push or
  deploy.
