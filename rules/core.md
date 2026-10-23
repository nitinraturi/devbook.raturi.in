---
profile: core
title: Devbook core baseline
description: Mandatory Devbook rules for every project and every change - workflow, design principles, coding standards, security, dependencies, testing and definition of done.
---

# Devbook core baseline (mandatory)

These rules apply to every change in this repository. `AGENTS.md` may tighten them. A deviation counts only if it is written in `AGENTS.md`. Loosening a security, privacy, accessibility, testing or content-honesty rule also needs an ADR. If a rule here seems to conflict with the task or with project docs, stop and ask.

## Workflow
- Trace every change to a spec section or issue with acceptance criteria.
- For work touching more than a few files, data, auth, payments or infrastructure: write a plan and wait for approval before coding.
- When the spec is ambiguous, ask. List the assumptions you would make.
- One task at a time, as a diff a person can review in one sitting.
- Run the project's checks and show the output. Never claim checks pass without running them.
- A human must approve changes to auth, payments, migrations and deletes, secrets, infrastructure, security headers and CSP, legal or medical content, and production data access.

## Design principles
- Build the simplest thing that meets a written requirement (KISS, YAGNI). Static before server-rendered, before client-heavy. One service before many.
- Keep facts, content, config and copy in validated data files or a database, not hard-coded in components.
- Derive, don't duplicate. Never maintain the same fact in two places.
- Pure core, thin shell: business logic is pure functions with no I/O, framework or DOM imports. The UI, HTTP and DB layers only adapt.
- Single responsibility per module or component. Dependencies point inward: core never imports UI, framework or infrastructure code.
- Explicit over clever: plain names, visible side effects, no implicit global state.
- Fail the build, not the user: broken links, invalid data, missing assets and schema errors stop the build.
- Prefer boring, mature technology. Each new tool needs an ADR.
- Environment-specific settings come from env vars or config, never code edits.
- Every failure mode has defined behaviour: retry, fallback, user message or alert.
- Data models, public URLs, APIs and vendor lock-in get an ADR.

## Coding standards
- Use an automatic formatter and a linter in CI, failing on warnings.
- Use the strictest practical type checking. No `any`, `# type: ignore` or unchecked casts without a comment saying why.
- Validate all external input at the boundary with a schema. Trust the types inside.
- Functions are verbs, booleans read as questions, collections are plural. No unusual abbreviations.
- Put units in ambiguous names (`timeoutMs`, `priceInPaise`). Store base units; convert only for display.
- Functions do one thing. Prefer pure functions and return values over mutation and shared state.
- Comments explain why. Cite the source of every non-obvious constant. Delete commented-out code.
- Never swallow errors. Handle, add context and re-raise, or log and report. User messages say what happened and what to do next.
- Structured logs at boundaries. Never log secrets, tokens, passwords, full card or ID numbers, or unneeded personal data.
- Timestamps in UTC. Money as integers in the smallest unit or a decimal type, never floats. UTF-8 everywhere.
- Organise code by feature or domain first. Create a shared folder only once two features need it.
- Docs live in `docs/` and change in the same PR as the behaviour they describe.

## Security
- Features touching accounts, payments, personal data, uploads, admin or LLM tools need a short threat model in the spec.
- Use proven framework or provider auth. Never write custom password hashing or session crypto.
- Deny by default. Check permission per object on the server. Never trust IDs, roles or prices sent by the client.
- Validate every input on the server. Use parameterised queries or the ORM. Never build SQL or shell commands by string concatenation.
- Encode output for its context. Treat any raw-HTML escape hatch as a security review item.
- Secrets live only in the platform secret store or env vars: never in the repo, bundles, logs, prompts or screenshots. Commit `.env.example` with names only.
- Rate-limit authentication, forms, search, expensive endpoints and LLM calls.

## Dependencies
- Never add a dependency without human approval. State why it is needed and the alternative.
- Before proposing one, confirm it exists under that exact name, is maintained, its repository matches, and its licence is allowed.
- Commit lockfiles. CI installs from the lockfile only.

## Testing
- Each acceptance criterion maps to at least one test. Test behaviour through public interfaces.
- A bug fix adds a test that failed before the fix.
- Tests are deterministic and use synthetic data only.
- Never write tautological tests or mock the unit under test.
- Never weaken, skip or delete a test to make it pass. A failing test is a finding.
- Before writing tests, list the cases: empty, maximum, invalid, duplicate, concurrent and unauthorised.

## Git and review
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `chore:`, `content:`).
- One concern per PR. Link the spec or issue and include the task report.
- `main` stays deployable. CI must pass before review.

## Definition of done
A change is done only when all of these are true:
- Lint, format, type checks and tests pass with zero warnings, and the output was shown.
- New logic has unit tests. New user-facing flows have an integration or e2e test.
- No silent TODOs, stubs, mock data or commented-out code.
- No secrets or personal data in code, tests, logs or fixtures.
- Every acceptance criterion is met, and errors are handled with plain-words messages.
- Spec, ADRs, `AGENTS.md`, changelog and user docs are updated where behaviour changed.
- The task report lists what was not done and every assumption. Never claim "done" for partial work.

## Detail
- Design principles: `{{devbook}}/src/content/docs/engineering/design-principles.md`
- Coding standards: `{{devbook}}/src/content/docs/engineering/coding-standards.md`
- Security baseline: `{{devbook}}/src/content/docs/security/security-baseline.md`
- Supply chain: `{{devbook}}/src/content/docs/security/supply-chain.md`
- Testing strategy: `{{devbook}}/src/content/docs/quality/testing-strategy.md`
- LLM-assisted workflow: `{{devbook}}/src/content/docs/workflow/llm-assisted-workflow.md`
- Definition of done: `{{devbook}}/src/content/docs/workflow/definition-of-done.md`
