# <project> — Docs

This folder is the single source of truth for building and growing **<project>**. It is written so that a person or an AI agent can pick up any task, follow the rules, and produce consistent, verifiable work.

> **Golden rule:** <the one rule that matters most here, e.g. "No page is built until its source doc exists and is reviewed.">

## Standards
Follows **devbook @ v<X.Y.Z>** in `docs/devbook/`. This folder only records what is specific to this project.

## How to use this folder

| You want to… | Read, in this order |
|---|---|
| Understand the project | `project-brief.md` → `technical-spec.md` |
| Scaffold or rebuild | `00-master-build-prompt.md` → … |
| Add a <content item / feature> | `<procedure doc>` |
| Check a decision | `adr/` |
| Copy a prompt | `prompts.md` |

## File map
```
docs/
├── README.md              ← you are here
├── CHANGELOG.md
├── devbook/               ← pinned standards (read-only)
├── adr/
├── project-brief.md
├── technical-spec.md
├── <design-system.md>
├── <domain-rules.md>
├── <procedure docs>
└── <research/ or other project data>
```

## Pipeline
```
1. <step> → 2. <step> → 3. Review gate → 4. Build → 5. QA → 6. Publish → 7. Maintain
```

## Status conventions
- `status: draft | reviewed | published | needs-update`
- Certainty labels (if factual content): High / Moderate / Low / Insufficient.

## Ownership
- Owner: <name>. Reviewer for <sensitive area>: <name, credential> or "none yet" (never claim review that did not happen).
