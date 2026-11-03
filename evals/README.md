# Devbook evals

These evals measure whether Devbook changes what an agent does. They don't model what it could see. Each case runs with `claude plugin eval` in two arms, with Devbook and without it, three times each, and reports the with-arm score and `Δ` (with minus without). Results are published at https://devbook.raturi.in/evals/.

## What is measured

| Suite | Target | With arm | Without arm |
|---|---|---|---|
| `core` | `evals/` (the `devbook-core-eval` plugin) | The core block and the fixture's Commands, injected at session start by `hooks/inject.mjs`, because eval runs load no `AGENTS.md` | Nothing |
| One per optional skill | `optional/plugins/<skill>` | That skill installed | Nothing |

The core suite has 10 cases on three dependency-free fixtures in `fixtures/` (a Node library, a Python service on sqlite and a static site). Each case checks one core rule with graders that cost nothing where possible (`tool_used`, `tool_order`, `regex`, `file_exists`), plus an `llm` grader where only judgement works. The vendor plugins in the catalog are not measured here: `claude plugin eval` loads only the plugin under test.

## Commands

```bash
node evals/validate.mjs          # free: case structure, graders, fixtures (part of npm run check)
node evals/run.mjs               # free: prints the commands a measured run would use
node evals/run.mjs --yes         # spends model usage: runs every suite and writes evals/results/<date>.json
```

Never run `node evals/run.mjs --yes` unless the owner has approved the spend. The monthly `eval.yml` workflow runs it when the `MEASURED_EVALS` variable is `true`.

## Add a case

1. Make a directory under `evals/cases/` (or `optional/plugins/<skill>/evals/`) with `prompt.md`. Its frontmatter takes `description`, `tags`, `max_turns`, `timeout_seconds` and `allowed_tools`, and its body is the prompt, phrased the way a user would type it.
2. For a fixture, add `case.yaml` with `context.scaffold_script: scaffold.sh`, and a `scaffold.sh` that sources one of `fixtures/*.sh` and then `fixtures/_commit.sh`.
3. Add one grader on the result and one on the steps in `graders/`. Use `arm: both` on "must not" graders.
4. Run `node evals/validate.mjs`, and run the new case once with `claude plugin eval evals --case <name> --runs 1 --scaffold` when the owner approves the spend.

## Licence

MIT-0, like the rest of the code.
