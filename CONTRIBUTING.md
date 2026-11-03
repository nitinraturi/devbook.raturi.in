# Contributing to Devbook

Devbook's core block ships into every session of every project that uses it, and its catalog decides what gets installed there, so each line and each source has to earn its place. Before you start, read [`AGENTS.md`](AGENTS.md) (how this repository works) and the [writing guide](https://devbook.raturi.in/start-here/writing-instructions/).

## Report first

Use an issue form for [something that is wrong](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=rule-wrong.yml), an [agent that ignored a core rule](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=rule-ignored.yml), or a [catalog source to add or retire](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=suggest-source.yml). Report security problems privately ([SECURITY.md](SECURITY.md)).

## How a change earns its place

1. **A primary source.** Official docs, a standard or the vendor's own page. Never invent facts, install ids or flags; check them against the live docs or CLI.
2. **The deletion test.** A core line stays only if a capable agent would otherwise get it wrong. The core block stays under 2 KB.
3. **Evidence.** Add or update a measured case in [`evals/`](evals/README.md) that tests the line or skill. Running it spends model usage, so it runs only with the owner's approval or in the monthly workflow.

- **Catalog sources** are vendor-maintained, cover code quality, and never manage deploys or CI. Pin them to a tag or full commit SHA, read every file at that ref, and give `suggested` or `retired` entries a specific `reason`.
- **Never rename or remove** an optional skill or its plugin without an **Upgrade** note in the changelog: projects install them by name.
- **Licences:** `optional/` and the guides are CC BY 4.0; the prompt, core block, catalog and code are MIT-0. Contributions are accepted under the licence of the path they change.
- **Changelog:** add a dated `CHANGELOG.md` entry for any change to shipped files, with an **Upgrade** note when projects must act. Don't edit `VERSION`; releases do.

## Before you open a pull request

```sh
npm ci
npm run prompt         # regenerate prompt/bootstrap.md after changing core/, catalog/ or the template
npm run check          # format, lint, types, prompt and catalog, eval cases, skills, scripts, build, Playwright + axe
```

Small Conventional Commits, one change per pull request. The owner reviews every pull request; automation never merges shipped files.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
