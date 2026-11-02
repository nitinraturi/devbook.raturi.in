# Devbook evals

Measures whether a Devbook version changes what an AI coding agent does, before rule text is changed. Each task asks Claude Code to do a small job in a fixture project and then checks the result automatically: the files it left and the commands it ran.

Nothing here ships to projects. The fixtures contain no `AGENTS.md` or `CLAUDE.md` (the project section lives in `AGENTS.project.md`), so a project that embeds Devbook as a submodule never loads them.

## What's here

| Path | What it is |
|---|---|
| `fixtures/astro-site/` | A small static Astro site: blog, contact page, CSP in `public/_headers`, helpers tested with `node --test`. |
| `fixtures/django-api/` | A small Django JSON API for notes, with migrations and Django tests. |
| `fixtures/*/fixture.json` | Setup commands, the test command, which Devbook files and stack notes the project would load, and the tools the agent may use. |
| `fixtures/*/AGENTS.project.md` | The project section of the fixture's `AGENTS.md`. Every variant gets it. |
| `tasks/*.yaml` | One task each: `prompt`, `fixture`, the `behaviour` it tests, optional `files` that change the fixture first (for example, a bug), and `checks`. |
| `checks/*.mjs` | One check each. Every check reads the final files and/or the transcript and returns pass or fail with a reason. |
| `run.mjs` | The runner. `lib.mjs` has the shared helpers. |

The 17 tasks cover: keeping the CSP strict, fixing code instead of weakening a failing test, adding tests and running them before reporting done, not inventing packages, not committing or pushing unasked, reporting missing information instead of inventing it, validating input at the boundary, keeping secrets out of source, image alt text and dimensions, and adding migrations. `node evals/run.mjs --list` prints them.

## How a run works

For each task, variant and repeat, `run.mjs`:

1. Copies the fixture into a temporary directory. Setup (`npm install`, or a Python venv and `pip install`) runs once per fixture and runs reuse it.
2. Writes the task's `files`, then installs the variant:
   - `none`: `AGENTS.md` with only the project section, and `CLAUDE.md` with `@AGENTS.md`.
   - `main`, `ref:<git-ref>` or `local` (the working tree): `.devbook/` from that version, plus `AGENTS.md` built from that version's own `templates/AGENTS.md`, keeping the `@` lines this fixture uses.
3. Commits that state, so checks can diff against it.
4. Runs `claude -p` headless with `--output-format stream-json --verbose`, `--permission-mode acceptEdits`, the fixture's `allowedTools`, `--setting-sources project,local` and `--max-budget-usd`. Each run gets an empty `CLAUDE_CONFIG_DIR`, so your own `~/.claude` memory, settings, plugins and hooks stay out of the result. Auto memory and non-essential traffic are off.
5. Runs the task's checks and saves `transcript.jsonl`, `diff.patch` and `result.json` for the run.

The agent may edit files and run the tests and builds. It may not commit, push or install packages: those calls are denied, but the attempt is in the transcript, so the commit and push checks still see it. A task passes only if every one of its checks passes.

## Run it

Dry runs never call a model and cost nothing:

```bash
node evals/run.mjs --validate                                  # tasks, fixtures and checks load
node evals/run.mjs --list                                      # list tasks
node evals/run.mjs --dry-run --task astro-add-helper --variant main --repeat 1 --keep
```

A dry run does everything except call Claude: setup, variant install, an empty transcript, checks and the report. The report says DRY RUN. Most checks fail, because nothing was changed. `command.txt` in each run's folder has the exact `claude` command that would have run.

Real runs need Python 3.12 or later, network access for setup, the `claude` CLI, and `ANTHROPIC_API_KEY`, because the empty config directory has no saved login. They spend API credits, so `run.mjs` refuses to start without `--yes`:

```bash
export ANTHROPIC_API_KEY=...
node evals/run.mjs --variant none,main --repeat 3 --yes          # full baseline
node evals/run.mjs --task django-search --variant main,local --repeat 3 --yes
```

Options: `--model` (default `claude-sonnet-5-5`), `--max-budget-usd` per run (default 2), `--timeout-min` per run (default 20), `--keep` to keep the run directories. Runs execute one at a time.

The agent runs commands on your machine inside the temporary directory, limited to the allowed tools. For extra isolation, run the evals in a container or a disposable VM.

## What it costs

This hasn't been measured yet. The estimate below models it; replace it with measured numbers after the first paid run. Assumptions: about 15 model requests per run, Claude Code's own system prompt and tools at about 20,000 tokens, the fixture files read at about 8,000 tokens, Devbook adding about 9,700 tokens (Astro fixture) or 8,300 (Django fixture), most input served from the prompt cache, and about 6,000 output tokens. Prices: Sonnet 5.5 at $2 per million input tokens, $10 output and $0.20 cache read; Opus 5.5 at $4, $20 and $0.20.

| Model | Per run, `none` | Per run, `main` | Full baseline (17 tasks × 3 runs × 2 variants = 102 runs) |
|---|---|---|---|
| Sonnet 5.5 | about $0.28 | about $0.33 | about $31 |
| Opus 5.5 | about $0.48 | about $0.55 | about $52 |

Treat these as ±50%. Each run is also capped by `--max-budget-usd`. A full baseline takes several hours at 2–4 minutes a run.

## Read the report

Each run writes `evals/results/<timestamp>/report.md` and `report.json` (git-ignored):

- **Overall**, per variant: pass rate, mean input tokens (uncached + cache writes + cache reads), mean output tokens, mean and total cost. Input tokens show what the instructions cost in context; pass rate shows whether they helped.
- **Per task**: pass rate per variant. Compare variants task by task, not only overall. With 3 runs, one run is 33 points, so only treat a difference as real if it repeats.
- **Failed checks**: every failing check with its reason. Open that run's `transcript.jsonl` and `diff.patch` to see what happened.

Some checks are heuristics, such as the regular expression over the final report in the "missing information" tasks. Read their failures before trusting a pass-rate drop.

## Add a task

1. Add `tasks/<id>.yaml` with `id` (same as the file name), `fixture`, `behaviour`, `prompt` and at least one check. Use `files` to put the fixture in a specific state first.
2. Prefer checks that test behaviour (run the code, call the endpoint) over checks that match text. Include a check that the work was done, so an agent that does nothing can't pass.
3. Add a check in `checks/` only if none fits. It exports a default async function that takes `{ dir, fixture, transcript, params, initialCommit }` and returns `{ pass, detail }`.
4. Run `node evals/run.mjs --validate` and a dry run of the task.
