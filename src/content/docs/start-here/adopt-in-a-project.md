---
title: Adopt it in a project
description: Pin a devbook version in a project repo, write AGENTS.md as the router, keep project docs thin, and upgrade or feed rules back over time.
sidebar:
  order: 2
---

A project consumes the devbook by pinning a version and pointing its agent instructions at the pages that apply.

## Rules

- A project **MUST** pin an exact devbook tag (for example `v1.2.0`), never track `main`.
- A project **MUST** have an `AGENTS.md` at its root built from the [template](/templates/agents-md/). `CLAUDE.md` and `.github/copilot-instructions.md` only point to it.
- `AGENTS.md` **MUST** list only the devbook pages the project uses (usually 6–12), not the whole devbook. Irrelevant context makes agents worse.
- Project docs **MUST NOT** copy devbook text. Link to it, and write down only what differs or is unique.
- Upgrading the devbook version **MUST** be its own pull request with a changelog entry in the project.
- A rule a project discovers that would apply elsewhere **SHOULD** be proposed back to the devbook, then removed from the project docs once released.

## Setup steps

```bash
# 1. Add the devbook as a pinned submodule
git submodule add https://github.com/<owner>/devbook.raturi.in docs/devbook
git -C docs/devbook checkout v1.0.0
git add .gitmodules docs/devbook && git commit -m "docs: pin devbook v1.0.0"

# 2. Copy the agent files and fill them in
cp docs/devbook/templates/AGENTS.md ./AGENTS.md
cp docs/devbook/templates/CLAUDE.md ./CLAUDE.md
mkdir -p .github && cp docs/devbook/templates/copilot-instructions.md .github/

# 3. Start the project docs
mkdir -p docs/adr
cp docs/devbook/templates/project-brief.md docs/
cp docs/devbook/templates/technical-spec.md docs/
cp docs/devbook/templates/project-readme.md docs/README.md
```

Clone with submodules: `git clone --recurse-submodules <repo>`. In CI, enable submodule checkout.

**Alternative:** if submodules are awkward for a project, a small script may copy a tagged release into `docs/devbook/` and record the version in `docs/devbook/VERSION`. The copy MUST be treated as read-only.

## Typical project `docs/` layout

```
docs/
├── README.md              # how to use these docs, file map, pipeline
├── CHANGELOG.md
├── devbook/               # pinned devbook (read-only)
├── adr/                   # decisions, including any loosened rule
├── project-brief.md       # problem, users, scope, success measures
├── technical-spec.md      # architecture, data, interfaces, acceptance criteria
├── design-system.md       # tokens, components (if UI)
├── domain-rules.md        # content and safety rules specific to the domain
└── …                      # anything unique: research docs, motion specs, taxonomies
```

## Upgrading

1. Read the devbook `CHANGELOG.md` between your version and the new one.
2. Bump the submodule, run the project's checks, fix what fails.
3. Update `AGENTS.md` if pages were added, renamed or split.
4. Record the upgrade in the project changelog.

A **major** devbook version means some rule changed in a way that can fail existing checks. Read those entries carefully.
