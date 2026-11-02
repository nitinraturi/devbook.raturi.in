# Contributing to Devbook

Devbook's files ship into every chat of every project that uses it, so each rule has to earn its place. Before you start, read [`AGENTS.md`](AGENTS.md) (how this repository works) and the [writing guide](https://devbook.raturi.in/start-here/writing-instructions/).

## Report first

Use an issue form for a [rule that is wrong](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=rule-wrong.yml), an [assistant that ignored a rule](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=rule-ignored.yml), or a [source to add](https://github.com/nitinraturi/devbook.raturi.in/issues/new?template=suggest-source.yml). Report security problems privately ([SECURITY.md](SECURITY.md)).

## How a rule earns its place

1. **A primary source.** Official docs, a standard or a recognised guideline, added with its URL to [`sources.json`](sources.json). Never invented facts, standards or numbers.
2. **The deletion test.** A capable model would get it wrong without the rule. Rules that models follow by default don't belong.
3. **Eval evidence.** Add or update a task in [`evals/`](evals/README.md) that tests the rule, and commit the modelled results (`npm run evals:model -- --variant main,local`). No task may get worse than `main`.

## The rules for changes

- **Rule IDs** are stable (`CORE-02`). Never reuse one; a removed rule's ID goes into `retiredRuleIds` in `devbook.manifest.json`.
- **Budgets only go down.** The always-loaded tier is 9 KB. `npm run check` fails a raised budget unless the change also commits eval results with no pass-rate loss.
- **Never rename or delete** a file in `instructions/`, `stacks/`, `skills/` or `templates/`; projects load them by path.
- **Licences:** `instructions/`, `stacks/`, `skills/` and the guides are CC BY 4.0; `templates/`, `kit/`, the skills' scripts and the code are MIT-0. Contributions are accepted under the licence of the path they change.
- **Changelog:** add a dated `CHANGELOG.md` entry for any change to shipped files, with an **Upgrade** note when projects must act. Don't edit `VERSION`; releases do.

## Before you open a pull request

```sh
npm ci
npm run check          # format, lint, types, budgets, rule IDs, sources, skills, scripts, build, Playwright + axe
npm run evals:model -- --variant main,local --no-save
```

Small Conventional Commits, one change per pull request. The owner reviews every pull request; automation never merges shipped files.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
