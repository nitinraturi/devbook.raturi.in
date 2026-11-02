# Devbook evals

Measures whether a Devbook version changes what an AI coding agent sees and does, before rule text is changed. There are two ways to run the same tasks:

- **Modelled** (`model.mjs`, free, deterministic, the default for gates and the site): installs each variant exactly as a project would have it, works out what Claude Code loads for each task from its documented loading rules, and reports Devbook's token cost and whether every rule the task tests is in front of the assistant.
- **Measured** (`run.mjs --yes`, spends model usage): runs Claude Code headless on each task and checks the files it left and the commands it ran.

Nothing here ships to projects. The fixtures contain no `AGENTS.md` or `CLAUDE.md` (the project section lives in `AGENTS.project.md`), so a project that embeds Devbook as a submodule never loads them.

## What's here

| Path | What it is |
|---|---|
| `fixtures/astro-site/` | A small static Astro site: blog, contact page, CSP in `public/_headers`, helpers tested with `node --test`. |
| `fixtures/django-api/` | A small Django JSON API for notes, with migrations and Django tests. |
| `fixtures/android-app/` | A small Kotlin and Compose Android app, sources only (checks read the code; nothing is built). |
| `fixtures/*/fixture.json` | Setup commands, the test command, which Devbook files and stack notes the project would load, and the tools the agent may use. |
| `fixtures/*/AGENTS.project.md` | The project section of the fixture's `AGENTS.md`. Every variant gets it. |
| `tasks/*.yaml` | One task each (see [Add a task](#add-a-task)). |
| `checks/*.mjs` | One check each. Every check reads the final files and/or the transcript and returns pass or fail with a reason. |
| `rules.json` | A content signal (a regular expression) per rule, so the modelled run can find a rule in any version, including those from before rule IDs. |
| `rubrics/*.md` | Fixed rubrics for the few model-graded checks. |
| `install.mjs`, `validate.mjs`, `lib.mjs` | Shared helpers: installing a variant, validating definitions, transcripts and files. |
| `model.mjs`, `run.mjs`, `report.mjs` | The modelled runner, the measured runner, and the results writer. |
| `results/` | Committed results: `<date>-<variant>-<model>.json` per variant and a Markdown comparison per run. The site's `/evals/` page and the release gate read them. |
| `runs/` | Raw transcripts, diffs and per-run results (git-ignored). |

`node evals/run.mjs --list` prints the tasks. They cover every instruction file, every stack note a fixture loads and every skill with at least three tasks each, and `--validate` fails if one drops below that. Skill tasks include trigger tests (prompts that should load the skill) and near misses (prompts that shouldn't).

## Variants

`none` (only the project section), `main`, `stable` (the release branch, once it exists), `local` (the working tree) and `ref:<git-ref>` (any commit, such as `ref:9504d10`, the last commit before the prune). Each Devbook variant gets `.devbook/` from that version, an `AGENTS.md` built from that version's own template with the lines this fixture uses, and the links the setup skill makes. A task with `install: bare` gets `.devbook/` only, as a project looks before setup.

## Modelled runs

```bash
node evals/model.mjs --variant none,ref:9504d10,main      # writes evals/results/
node evals/model.mjs --variant main,local --no-save       # compare without writing
node evals/model.mjs --count-tokens claude-sonnet-5-5     # exact tokens (needs ANTHROPIC_API_KEY; the endpoint is free)
```

For each task and variant, the model follows Claude Code's documented loading:

- **Loaded:** `CLAUDE.md` with its `@` imports expanded (relative to the importing file, up to five hops, not inside code); `.claude/rules/` files without `paths:`, and those whose globs match a file in the task's `touches`; each linked skill's name and description; any `.devbook/` file the prompt names; and the body of the skill the trigger model fires.
- **Reachable:** `.devbook/` files the loaded text points to by path, such as the "read when" list or a skill's "Read …" step. The assistant has to decide to open them.
- **Trigger model:** content-word overlap between the prompt and each skill's name and description, firing the best skill above a fixed threshold. It is lexical, so it misses synonyms; a trigger failure says the description lacks the words a user would type.

A task passes when every rule it tests is loaded or reachable and the skill expectation holds. Mean input tokens are what Devbook adds for the task: the loaded text plus the smallest reachable file for each rule that isn't loaded. Tokens are estimated as bytes / 4, like the budgets, unless `--count-tokens` is given.

What it can't tell you: whether the assistant follows a rule it can see. Read a modelled pass as "the rule is there, at this cost"; measured runs answer the rest.

## Measured runs

Dry runs never call a model and cost nothing:

```bash
node evals/run.mjs --validate                                  # tasks, fixtures, checks, signals and coverage
node evals/run.mjs --dry-run --task astro-add-helper --variant main --repeat 1 --keep
```

A dry run does everything except call Claude: setup, variant install, an empty transcript, checks and a report in `runs/`. It never writes to `results/`. Most checks fail, because nothing was changed. `command.txt` in each run's folder has the exact `claude` command that would have run.

Real runs need Python 3.12 or later, network access for setup, the `claude` CLI, and a credential, because each run uses an empty config directory with no saved login:

- `CLAUDE_CODE_OAUTH_TOKEN`, from `claude setup-token`, uses your Claude subscription and shares its usage limits.
- `ANTHROPIC_API_KEY` bills the API.

With both set, `--credential auto` uses the subscription token and removes the API key from the run's environment, because Claude Code would otherwise prefer the key. `--credential api-key` chooses the key. The credential used is recorded in each `result.json`. Runs refuse to start without `--yes`:

```bash
node evals/run.mjs --task django-search --variant main,local --repeat 3 --yes
node evals/run.mjs --variant none,main --models claude-haiku-5-5,claude-sonnet-5-5,claude-opus-5-5 --repeat 3 --yes
```

Options: `--models` (comma-separated; default `claude-sonnet-5-5`), `--max-budget-usd` per run (default 2), `--timeout-min` per run (default 20), `--keep` to keep the run directories. Runs execute one at a time. Release gates use Sonnet; the quarterly matrix uses Haiku, Sonnet and Opus, because what works for one model may need more detail for another.

The agent runs commands on your machine inside the temporary directory, limited to the allowed tools. For extra isolation, run the evals in a container or a disposable VM. The upgrade tasks fetch from GitHub.

Model-graded checks (`checks/model-graded.mjs`) are used only where no deterministic check can judge, with a fixed rubric in `rubrics/` and a pinned grader, `claude-opus-5-5`, the most accurate model available. They run only in measured runs.

## What it costs

Modelled runs cost nothing. Measured runs haven't been run yet; the estimate below models them. Assumptions: about 15 model requests per run, Claude Code's own system prompt and tools at about 20,000 tokens, the fixture files read at about 8,000 tokens, Devbook adding what the modelled run reports (about 5,200 tokens per task on `main`), most input served from the prompt cache, and about 6,000 output tokens. Check current prices before relying on it.

| Model | Per run | 66 tasks × 3 runs × 2 variants (396 runs) |
|---|---|---|
| Sonnet 5.5 | about $0.30 | about $120 |
| Opus 5.5 | about $0.50 | about $200 |

Treat these as ±50%. Each run is also capped by `--max-budget-usd`. On a subscription token, the same runs count against your usage limits instead.

## Read the results

Each run writes, per variant and model, `results/<date>-<variant>-<model>.json` (`model` is `modelled` for modelled runs) and one `results/<date>-<model>-<variants>.md`:

- **Overall:** pass rate, mean input tokens and cost per variant; for modelled runs, the share of tested rules loaded and reachable.
- **Per task:** pass rate with passes/runs (the spread across repeats) and mean input tokens, with the token delta against the first variant.
- **Worse than another variant:** every task where a Devbook variant passes less often than another one. Fix these before shipping.
- **Failures:** the failing checks with their reasons. For measured runs, open that run's `transcript.jsonl` and `diff.patch` in `runs/`.

`node evals/report.mjs --compare <base.json> <next.json>` lists tasks whose pass rate fell, and exits 1 if any did. With 3 runs, one run is 33 points, so only treat a measured difference as real if it repeats.

## Add a task

1. Add `tasks/<id>.yaml` with:
   - `id` (same as the file name), `fixture`, `behaviour` and `prompt`;
   - `rules`: the rule IDs it tests (`[]` for a skill-only task), each with a signal in `rules.json`;
   - `touches`: the files the task reads or edits, which decide which path rules load;
   - optionally `covers` (stack notes, as `stacks/<file>.md#<topic>`), `skill` (should load) or `skillNot` (a near miss), `files` (put the fixture in a state first) and `install: bare`;
   - at least one check.
   Write a made-up key as `{{FAKE_SECRET}}`; the runner swaps in a random one, so secret scanners have nothing to flag.
2. Prefer checks that test behaviour (run the code, call the endpoint) over checks that match text. Include a check that the work was done, so an agent that does nothing can't pass. Use `any-of` when there is more than one right answer, such as "made the change" or "stopped to ask".
3. Add a check in `checks/` only if none fits. It exports a default async function that takes `{ dir, fixture, transcript, params, initialCommit }` and returns `{ pass, detail }`.
4. Run `node evals/run.mjs --validate`, `node evals/model.mjs --task <id> --variant main --no-save` and a dry run of the task.
