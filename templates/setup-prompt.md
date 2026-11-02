Set up Devbook instructions in this project. Do the setup; don't just describe it.
Method: submodule
Version: latest
(Method: "submodule" adds Devbook as a git submodule, "copy" commits plain
files. Version: "latest" pins the newest release tag, a tag such as
v2026.11.02 pins that one, and "main" follows every change.)

1. Add Devbook to .devbook/
- If .devbook/ already exists, keep its method and version (a submodule has
  a .devbook/.git file). For a submodule, run:
  git submodule update --init .devbook
  Then go to step 2.
- For "latest", find the newest tag:
  git ls-remote --tags --refs --sort=-version:refname https://github.com/nitinraturi/devbook.raturi.in 'v*' | head -n1 | cut -d/ -f3
  If it prints nothing, use main and tell me.
- Submodule: run, with <tag> replaced by the tag:
  git submodule add https://github.com/nitinraturi/devbook.raturi.in .devbook && git -C .devbook checkout -q <tag> && git add .devbook
  For main, run instead:
  git submodule add -b main https://github.com/nitinraturi/devbook.raturi.in .devbook
- Copy: from the repository root, run, with <tag> replaced by the tag or main:
  REF=<tag> && P=devbook.raturi.in-${REF#v} && rm -rf .devbook && mkdir -p .devbook && curl -fsSL https://codeload.github.com/nitinraturi/devbook.raturi.in/tar.gz/$REF | tar -xz --strip-components=1 -C .devbook $P/instructions $P/stacks $P/templates $P/skills $P/kit $P/LICENSE-CC-BY-4.0 && echo $REF > .devbook/VERSION
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
