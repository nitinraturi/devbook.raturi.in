# Prune audit (Phase 3)

One row per bullet in `instructions/*.md`, at commit `b2b6391`. **Line** is the line number in that file. Rule text is shortened; the line number points to the full text. Status: **approved and applied** on 2026-11-02, with the verdicts as written. The always tier's remaining gap was closed by rewording; moving the LLM and privacy sections to conditional loading is left for Phase 4.

Verdicts, from `docs/plans/llm-efficiency.md` Phase 3:

- **Delete:** a capable model does this unprompted, or the rule repeats one kept elsewhere (each rule lives in one file). This is the writing guide's deletion test.
- **Keep:** non-standard, opinionated, a specific number or standard, or easy to get wrong. "Merge" means it joins another kept rule in one bullet.
- **Enforce:** a tool does it better than text. One short pointer stays in the file, and the check goes on the Phase 6 list.

The baseline evaluation has not been run; you chose to use the modelled cost. So these verdicts rest on judgement and the writing guide, not measurements. After approval, the pruned text should still be run through the evals before Phase 3 counts as done (plan step 6).

## Summary

| File | Rows | Keep | Merge | Enforce | Delete | Now | Projected |
|---|---|---|---|---|---|---|---|
| core | 57 | 27 | 0 | 2 | 28 | 7.4 KB | ~4.4 KB |
| security | 32 | 27 | 2 | 3 | 0 | 4.9 KB | ~4.6 KB |
| testing | 18 | 7 | 0 | 2 | 9 | 2.3 KB | ~1.5 KB |
| **always tier** | | | | | | **14.6 KB** | **~10.5 KB** (target 6–10) |
| performance | 22 | 15 | 0 | 2 | 5 | 3.0 KB | ~2.5 KB |
| api-data | 48 | 41 | 0 | 0 | 7 | 7.2 KB | ~6.3 KB |
| database | 48 | 35 | 0 | 0 | 13 | 6.8 KB | ~5.2 KB |
| design | 58 | 32 | 3 | 4 | 19 | 8.6 KB | ~6.0 KB |
| seo | 34 | 28 | 1 | 0 | 5 | 6.1 KB | ~5.3 KB |
| content | 27 | 22 | 0 | 0 | 5 | 3.9 KB | ~3.4 KB |
| mobile | 11 | 9 | 0 | 0 | 2 | 1.8 KB | ~1.6 KB |
| licensing | 17 | 15 | 0 | 1 | 1 | 3.2 KB | ~3.1 KB |
| feature-docs | 20 | 19 | 0 | 0 | 1 | 3.4 KB | ~3.3 KB |
| **website set** (always + performance, design, seo, content) | | | | | | **36.3 KB** | **~27.7 KB** (budget 35) |

Rows include the intro sentence (line 8) and "new" rows; ranges such as `24–30` count once per line. Projected sizes are computed from this table: the bytes of kept lines, half of merged lines, about 90 bytes per enforced pointer and about 110 per new rule, plus headings, frontmatter and intros, before any rewording. Moving the "Draws on…" sentences into `sources:` frontmatter does not reduce what an agent loads, because `@` imports include frontmatter. Rule IDs add about 9 bytes per rule.

**The always tier misses its target before rewording** (about 10.5 KB against 6–10), because security passes the deletion test almost line by line. Two ways to close the gap, for you to choose:

1. Reword kept rules to their shortest checkable form (the reasons above flag several "shorten" cases). That is likely worth 1–1.5 KB in core and security.
2. In Phase 4, move security's "LLM features" section (about 0.5 KB) to load only when the product calls a model, and the privacy section to load for apps that store personal data. That is a change in loading, not in content.

What else happens on approval (plan steps 3–5):

- The 3–5 most important rules go first in each file.
- Every kept rule gets a stable ID, such as `CORE-01`, `SEC-07` or `TEST-03`.
- One line is added to core asking the agent to cite rule IDs in its report.
- The "Draws on…" source sentences move into `sources:` frontmatter, which the site renders.

### Enforce list (for Phase 6)

| From | Rule | Tool or check |
|---|---|---|
| core 51 | Formatter, linter, strict types, CI fails on warnings, every escape has a reason | Project lint/type config plus CI; ESLint `ban-ts-comment` with descriptions (or the stack's equivalent) |
| core 77 | Conventional Commits | commitlint in a commit-msg hook, or a CI check |
| core 78 | Commit, push, deploy only when asked (kept as text too) | Claude Code `PreToolUse` hook blocking `git push` (Phase 6 item 1) |
| security 30 | HTTPS + HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors | Header assertion in e2e or a post-deploy check |
| security 39 | Lockfiles, install from them, audit in CI | Starter CI: `npm ci`/`pip install --require-hashes`, `npm audit`/`pip-audit` |
| security 40 | Pin CI actions to commit SHAs | `zizmor` or `pinact` in CI |
| security 34 | Secrets out of the repo (kept as text too) | gitleaks pre-commit hook (Phase 6 item 2) |
| testing 21 | axe on every page template | axe in e2e (as this repo does) |
| testing 32 | Every PR runs all checks; failure blocks merge | Starter CI plus branch protection |
| performance 11 | Budgets enforced in CI | `size-limit` or bundle budgets in CI |
| performance 13 | Lighthouse scores | Lighthouse CI assertions |
| design 62 | Icon-only buttons have an accessible name | axe `button-name` |
| design 82 | Contrast ratios | axe `color-contrast` plus a token contrast script |
| design 79 | Landmarks, `lang`, one `h1`, heading order (semantic-HTML part kept as text) | axe `landmark-*`, `html-has-lang`, `heading-order` |
| licensing 21 | Scan dependency licences against an allowlist | `license-checker`/`pip-licenses` in CI |

---

## core.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 8 | Precedence: project `AGENTS.md` overrides only where it says so; user's request overrides both | Keep | Non-obvious precedence; plan names it. Stays as the intro sentence. |
| 11 | Read relevant code, docs and tests first; match existing patterns | Delete | Claude Code and Copilot do this by default. |
| 12 | Restate goal and criteria; ask if ambiguous; list assumptions | Delete | Asking when unclear is default; listing assumptions is covered by line 85. |
| 13 | Plan and approval for many files, data models, auth, payments, infra, public URLs | Keep | Opinionated approval gate; models start editing without one. |
| 16 | Check versions, APIs, config, prices, limits in official docs; say if unverified | Keep | Models trust stale training data; core Devbook value. |
| 17 | Latest stable release unless pinned; no deprecated APIs | Keep | Merge with 16. Models default to the versions they were trained on. |
| 18 | Never invent packages, APIs, paths, commands, citations or results | Keep | Hallucination guard; eval tasks `astro-reading-time`, `django-rate-limit`. |
| 21 | Simplest thing: static before server-rendered before client-heavy; one service | Keep | Opinionated ordering models don't follow (they reach for SPAs). |
| 22 | Pure core, thin shell | Keep | Opinionated architecture; shorten to one sentence. |
| 23 | One responsibility per module; dependencies point inward | Delete | Generic; the inward-dependency part is implied by 22. |
| 24 | One source for each fact; content and config in validated data | Keep | Models hard-code copy and config into components. |
| 25 | Fail the build, not the user | Keep | Non-default: build-time validation of data, links and assets. |
| 26 | Prefer the platform; every new dependency needs a reason and approval | Keep | Approval gate; models add packages freely. |
| 27 | Per-environment settings from env vars or config | Delete | Twelve-factor is default behaviour. |
| 28 | Decide what happens on every failure | Delete | Too vague to check; retries and fallbacks live in performance. |
| 31 | Follow the framework's documented layout first | Delete | Default behaviour. |
| 32 | `src/`, `tests/`, `docs/`, `scripts/`, `public/` defaults | Delete | Models use the framework's scaffold; the repo shows the layout. |
| 33 | Group by feature, not by type | Keep | Opinionated; models default to type folders. |
| 34 | Move to `src/lib/` or `src/components/` only once two features need it | Keep | Opinionated and checkable. |
| 35 | No catch-all `utils`, `helpers`, `common`, `misc` | Keep | Models create `utils.ts` constantly. |
| 36 | Nesting 3–4 levels; one main export per file | Delete | Generic style advice. |
| 37 | Change generated, build and vendored files through their source | Delete | Default behaviour; rare failure. |
| 40 | Naming: language and framework conventions first | Delete | Default behaviour. |
| 41 | Files `kebab-case`, Python `snake_case`, components match name | Delete | Covered by "conventions first"; the repo shows its style. |
| 42 | Types `PascalCase`, functions `camelCase`, constants `SCREAMING_SNAKE_CASE` | Delete | Language conventions; models follow them. |
| 43 | Tables and columns `snake_case`; URLs and CSS `kebab-case` | Delete | Default; database and api-data keep their own naming where it matters. |
| 44 | Tests mirror the file they test | Delete | Default behaviour. |
| 45 | Domain words, not `data`, `info`, `temp` | Delete | Default good practice. |
| 46 | Functions are verbs; booleans are questions; plurals; `onX` | Delete | Default good practice. |
| 47 | Units in ambiguous names; spell words out | Keep | Units (`timeoutMs`) are often missed; drop the "spell out" half. |
| 48 | Branches `type/short-description` | Keep | Convention a model can't infer in a new repo; merge into Git. |
| 51 | Formatter, linter, strict types, CI fails on warnings; escapes have a reason | Enforce | Lint/type config and CI; keep a one-line pointer. |
| 52 | Validate all external input with a schema at the boundary | Delete | Merged into security 12, so the rule lives once. |
| 53 | Small functions, early returns, return values over mutation | Delete | Plan's own example of a default behaviour. |
| 54 | Comments explain why; cite constants | Delete | Plan's own example of a default behaviour. |
| 55 | Handle every error; users see what to do; details to logs | Delete | Default; leaking details is covered by api-data 45. |
| 56 | Structured logs without secrets or personal data | Delete | Duplicates security 34 (secrets) and security 48 (personal data). |
| 59 | One small reviewable change; no unrelated refactors | Keep | Models make drive-by refactors. |
| 60 | Never weaken, skip or delete a failing check | Keep | Plan names it; eval tasks `*-fix-failing-test`. |
| 61 | Finish what you start; no silent TODOs, stubs or placeholder data | Keep | Eval task `astro-missing-analytics-id`. |
| 62 | Human approves auth, payments, deletion, migrations, secrets, infra, headers, prod data | Keep | Plan names the approval list. |
| 65 | Update docs, examples and changelog in the same change | Keep | Models forget docs. |
| 66 | README gets a new developer from clone to running | Delete | Default when writing a README; rarely the task. |
| 67 | Significant decisions as ADRs in `docs/adr/NNNN-title.md` | Keep | Convention it can't infer; opinionated. |
| 68 | Document public APIs and config next to the code | Delete | Default behaviour. |
| 69 | Keep project facts in `AGENTS.md`, short and current | Keep | Agents rarely update their own instruction file. |
| 72 | Run format, lint, typecheck, tests, build; show real output; never claim a pass | Keep | Eval tasks `astro-add-helper`, `django-search`. Absorbs 82. |
| 73 | UI work: browser at 360 and 1440 px, light and dark, keyboard | Keep | Move to design (UI-only, so it loads by path in Phase 4). |
| 74 | Re-read your diff as a reviewer | Delete | Too vague to check. |
| 77 | Conventional Commits, explain why | Enforce | commitlint; one-line pointer. |
| 78 | Commit, push, deploy or rewrite history only when asked | Keep | Eval task `*-no-commit`; also a Phase 6 hook. |
| 79 | Keep `main` deployable; one concern per PR | Delete | Covered by 59. |
| 82 | Every criterion met; checks pass with zero warnings | Delete | Merge "zero warnings" into 72. |
| 83 | New logic has tests; errors in plain words | Delete | Duplicates testing 11. |
| 84 | No secrets or personal data in code, tests, logs, fixtures | Delete | Duplicates security 34 and testing 27. |
| 85 | Report: changed, verified, not done, assumptions; partial is partial | Keep | Plan names it; eval tasks `*-missing-*`. |
| new | Cite rule IDs when the report mentions a rule | Keep | Plan step 4. |

## security.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | Deny by default; check permissions per object on the server | Keep | OWASP A01 (IDOR); add "and per property" from api-data 73. |
| 12 | Re-check everything the client sends on the server | Keep | Absorbs core 52 (schema validation at every boundary). Eval tasks `*-subscribe-*`, `*-patch-*`. |
| 13 | Parameterised queries; no concatenation into SQL, shell, file paths | Keep | Shell and path concatenation is still common. |
| 14 | Encode output; auto-escaping on; raw HTML reviewed; sanitise with an allowlist | Keep | `set:html`/`dangerouslySetInnerHTML` are common shortcuts. |
| 15 | Fetch user URLs only through an allowlist blocking internal addresses | Keep | SSRF; absorbs api-data 75. |
| 16 | Threat model for accounts, payments, personal data, uploads, admin, LLM tools | Keep | Never done unprompted. |
| 17 | Log security events with who, what, when | Keep | Non-default. |
| 20 | Framework or provider auth, no custom crypto; offer passkeys | Keep | High stakes. |
| 21 | Password rules (NIST 800-63B) | Keep | Plan names it; models add composition rules. |
| 22 | Argon2id, scrypt, PBKDF2 for FIPS, bcrypt legacy | Keep | Plan names it. |
| 23 | Session cookies `Secure`, `HttpOnly`, `SameSite`, `__Host-`, rotate, expire | Keep | `__Host-` and rotation are non-default. |
| 24 | Rate-limit auth; same response either way; MFA for admins | Keep | Account enumeration is easy to get wrong. |
| 25 | CSRF on every cookie-authenticated, state-changing request | Keep | Models add `csrf_exempt` to make JSON APIs work. |
| 28 | HTTPS only, with HSTS | Merge | Into 30's enforced pointer. |
| 29 | CSP by hash or nonce, no `'unsafe-inline'`/`'unsafe-eval'` | Keep | Plan names it; eval task `astro-csp-footer-year`. |
| 30 | nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors | Enforce | Header test; one-line pointer listing the headers. |
| 31 | CORS named origins only | Keep | `*` with credentials is a common mistake. |
| 34 | Secrets in the store or env; out of repo, bundles, logs, prompts | Keep | Eval task `astro-secret-key`; also gitleaks in Phase 6. |
| 35 | `.env.example` names only; per-environment least privilege; rotate exposed | Keep | Non-default. |
| 38 | Confirm a dependency exists, is maintained, repo matches, licence allowed | Keep | Slopsquatting; eval tasks. |
| 39 | Commit lockfiles; install from them; audit in CI | Enforce | Starter CI; one-line pointer. |
| 40 | Pin CI actions to SHAs; no public CDN for front-end libraries | Enforce | zizmor/pinact; keep the CDN clause as text. |
| 43 | Uploads: type, size, rename, outside web root | Keep | Easy to get wrong. |
| 44 | Rate-limit forms, search, expensive endpoints, LLM; cap sizes; bot protection | Keep | Absorbs api-data 74. |
| 47 | Collect only needed personal data; write down why | Keep | Privacy by design. |
| 48 | Personal data out of URLs, analytics, logs | Keep | Absorbs core 56. |
| 49 | Consent before non-essential cookies; declining as easy | Keep | Legal requirement models miss. |
| 50 | Privacy notice; delete at end of retention | Keep | Absorbs database 79. |
| 51 | Users can access, correct, delete their data | Keep | Legal requirement. |
| 54 | LLM: treat input and output as untrusted; enforce in code | Keep | Prompt injection. |
| 55 | Validate model output; parameterise it like user input | Merge | Into 54. |
| 56 | Send only needed data; cap tokens, cost, requests per user | Keep | Cost and data exposure. |

## testing.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | Map each acceptance criterion to a test; test through public interfaces | Keep | Absorbs core 83. |
| 12 | Start a bug fix with a test that fails without the fix | Keep | Non-default. |
| 13 | Edge-case list: empty, boundary, invalid, duplicates, time zones… | Delete | The writing guide cuts long edge-case lists; models cover these when testing. |
| 14 | Test designed failure paths | Delete | Covered by 11. |
| 17 | Unit tests for pure logic | Delete | Default behaviour. |
| 18 | Integration tests with real dependencies where practical | Keep | Opinionated: real database over mocks. |
| 19 | A few end-to-end tests for key journeys | Delete | Default behaviour. |
| 20 | Contract tests for consumed APIs | Delete | Duplicates api-data 11. |
| 21 | axe on every page template | Enforce | axe in e2e; pointer moves to design. |
| 24 | One behaviour per test; arrange-act-assert | Delete | Default behaviour. |
| 25 | Deterministic: control time, randomness, network; no fixed sleeps | Keep | The main source of flaky tests. |
| 26 | Mock only boundaries; assert on results, not mocks | Keep | Models over-mock. |
| 27 | Synthetic data, never production personal data | Keep | Absorbs core 84; privacy. |
| 28 | Any order, in parallel, clean up | Delete | Covered by 25. |
| 29 | Specific assertions over large snapshots | Delete | Low impact. |
| 32 | Every PR runs all checks; failure blocks merge | Enforce | Starter CI plus branch protection. |
| 33 | Fix or quarantine a flaky test; don't re-run until green | Keep | Models re-run until green. |
| 34 | Coverage is a signal, not a target | Delete | Low impact. |

## performance.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | Measure first; budgets enforced in CI | Enforce | size-limit/Lighthouse CI; pointer keeps "measure before optimising". |
| 12 | Core Web Vitals p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | Keep | Specific numbers. |
| 13 | Lighthouse mobile scores | Enforce | Lighthouse CI assertions. |
| 14 | p95 latency targets for APIs | Delete | Models can't set targets without product input; generic. |
| 17 | JavaScript only for interactive parts; split by route | Keep | Models ship client-heavy by default. |
| 18 | LCP element in initial HTML; `fetchpriority="high"`; preload backgrounds | Keep | Specific and often missed. |
| 19 | AVIF/WebP, `srcset`/`sizes`, explicit dimensions | Keep | Eval task `astro-hero-image`. |
| 20 | Self-host and subset fonts; `swap`; ≤3 files; preload main | Keep | Specific. |
| 21 | Lazy-load off-screen media; preconnect only critical origins | Keep | Merge with 18 (lazy below, eager above the fold). |
| 22 | Keep pages bfcache-eligible | Keep | Non-obvious. |
| 23 | Reserve space for late content | Delete | Covered by 19 and the CLS target in 12. |
| 24 | Break up long tasks; debounce input | Delete | Generic. |
| 25 | Third-party scripts need a reason; load after content and consent | Keep | Opinionated. |
| 28 | Avoid N+1; select needed columns | Keep | Frequent ORM mistake. |
| 29 | Slow work to background jobs | Keep | Non-default in request handlers. |
| 30 | Cache key, lifetime, invalidation; immutable assets; compression | Keep | Specific headers. |
| 33 | Timeouts on every call; retry only idempotent operations, with backoff and jitter | Keep | Often missed. |
| 34 | Idempotent jobs with retries and dead-letter | Keep | Often missed. |
| 35 | Stateless servers | Delete | Default in modern hosting. |
| 36 | Degrade gracefully | Delete | Too vague to check. |
| 37 | Error tracking with releases; uptime checks; alert on user symptoms | Keep | Non-default. |
| 38 | Deploy from CI with health checks; migrations as a separate step | Keep | Opinionated. |

## api-data.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | OpenAPI first; generate; lint; contract tests | Keep | Opinionated workflow. |
| 12 | Design from use cases; standard methods before custom | Delete | Generic. |
| 13 | Write API-wide conventions down once | Keep | Prevents inconsistency across endpoints. |
| 16 | Plural kebab-case nouns; no verbs, extensions or trailing slashes | Keep | Specific convention. |
| 17 | Nest one level for ownership only | Keep | Specific. |
| 18 | Custom actions as `POST`, one style | Keep | Specific. |
| 19 | Opaque, non-sequential public IDs | Keep | Absorbs database 26. |
| 22 | RFC 9110 safe/idempotent methods; `GET` never changes state | Delete | Models know HTTP semantics. |
| 23 | 201 + `Location`; `PATCH` merge patch; `PUT`; 204 | Keep | Specific. |
| 24–30 | Status-code list | Keep | Shorten to the non-obvious ones: 400 vs 422, 404 for hidden objects, 409/412, never 2xx for errors. Counted as 7 rows. |
| 31 | 202 + status resource + `Retry-After` | Keep | Specific. |
| 32 | Bulk: max batch, result per item | Keep | Specific. |
| 35 | JSON objects, never bare arrays | Keep | Evolvability. |
| 36 | RFC 3339 UTC; minor-unit money; big integers as strings | Keep | Specific. |
| 37 | Null equals absent; empty arrays; booleans never null | Keep | Specific. |
| 38 | Extensible string enums | Keep | Specific. |
| 39 | Reject unknown fields; expose only allowed fields | Keep | Mass assignment. |
| 40 | Field selection only when measured | Delete | Default (models don't add it unasked). |
| 43 | RFC 9457 problem details with `code` and `errors` | Keep | Specific. |
| 44 | Error codes are part of the contract | Keep | Specific. |
| 45 | Request ID header; no stack traces in responses | Keep | Absorbs core 55. |
| 48 | Paginate every list, with default and maximum | Keep | Often missed. |
| 49 | Opaque cursors for large or changing collections | Keep | Specific. |
| 50 | Filter by field params; one `sort` param; indexed allowlist | Keep | Specific. |
| 51 | No totals on large collections | Keep | Specific. |
| 54 | `Idempotency-Key` on `POST` | Keep | Specific. |
| 55 | `ETag` + `If-Match`, 412 on mismatch | Keep | Specific. |
| 56 | `Cache-Control` on `GET`; 304; `private`/`no-store` | Keep | Specific. |
| 59 | Additive changes need no new version | Delete | Covered by the breaking-change list in 60. |
| 60 | Breaking-change list | Keep | Specific. |
| 68 | One versioning scheme | Keep | Specific. |
| 69 | `Deprecation` and `Sunset` headers | Keep | Specific. |
| 72 | HTTPS; OAuth/OIDC or scoped keys in headers; no credentials in URLs | Keep | Specific. |
| 73 | Authorise every object, property, function | Delete | Merged into security 11. |
| 74 | Limit consumption per client | Delete | Merged into security 44. |
| 75 | Allowlist user-supplied URLs | Delete | Duplicates security 15. |
| 76 | Every endpoint in OpenAPI; remove undocumented ones | Keep | OWASP API9. |
| 79–82 | Standard Webhooks: ID, timestamp, signature; verify; dedupe | Keep | Specific. Counted as 4 rows. |
| 83 | Senders retry with backoff; no ordering promise | Keep | Specific. |

## database.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | Model entities, invariants and queries first; plan for approval | Keep | Opinionated gate. |
| 12 | The database guards integrity; invariants become constraints | Keep | Models rely on app validation. |
| 13 | Third normal form; denormalise only when measured | Delete | Default behaviour. |
| 14 | One column per attribute; no CSV, numbered or EAV columns | Delete | Default behaviour. |
| 15 | ORM declares every constraint and index; read the generated SQL | Keep | Often missed. |
| 18 | `snake_case`; choose plural or singular once | Delete | Default. |
| 19 | `id`, `<singular>_id`, join tables name both sides | Delete | Default. |
| 20 | `is_`/`has_`, `<event>_at`, units in names | Keep | Units and `_at` are specific. |
| 21 | Avoid reserved words; name constraints and indexes | Keep | `user`/`order` break raw SQL. |
| 24 | 64-bit identity, or UUIDv7 when generated outside the database or exposed | Keep | Specific. |
| 25 | Surrogate keys; case-insensitive unique on natural keys | Keep | Often wrong. |
| 26 | Opaque public ID when enumeration matters | Delete | Duplicates api-data 19. |
| 29 | Narrowest correct type | Delete | Default. |
| 30 | UTC instants; future local events with IANA zone | Keep | Easy to get wrong. |
| 31 | Money as decimal or minor units with currency | Keep | Floats round. |
| 32 | Full UTF-8; length by business rule | Keep | `utf8mb4`, `varchar(255)` habits. |
| 33 | Check constraint or lookup table; native enums only for fixed sets | Keep | Opinionated. |
| 34 | JSON columns only for variable payloads | Keep | Common shortcut. |
| 35 | Files in object storage | Keep | Specific. |
| 38 | `NOT NULL` unless unknown is a real state | Keep | Opinionated default. |
| 39 | Check constraints for ranges | Delete | Covered by 12. |
| 40 | "Only one" rules as (partial) unique constraints | Keep | Often missed. |
| 41 | Defaults in the database | Keep | Absorbs 56. |
| 44 | Foreign keys; deliberate `ON DELETE` | Keep | Cascade mistakes are costly. |
| 45 | Index foreign keys | Keep | Not automatic in Postgres. |
| 46 | Many-to-many join table unique on both keys | Delete | Default. |
| 47 | No polymorphic references | Keep | Opinionated. |
| 50 | Index for real queries; confirm with `EXPLAIN` | Keep | Specific. |
| 51 | Composite: equality first, range last | Keep | Specific. |
| 52 | Partial and expression indexes | Keep | Specific. |
| 53 | Drop unused indexes | Delete | Generic. |
| 56 | `created_at`/`updated_at` maintained in one place | Delete | Merged into 41. |
| 57 | Soft delete only when needed; partial uniques | Keep | Often wrong. |
| 58 | History tables where history matters | Keep | Specific. |
| 61 | Short transactions, no network calls inside | Keep | Often wrong. |
| 62 | Prevent lost updates; atomic updates | Keep | Often wrong. |
| 63 | Idempotent inserts with unique keys and upserts | Keep | Retries. |
| 66 | `tenant_id` leading indexes; RLS | Keep | Specific. |
| 67 | Personal data in clearly named columns | Delete | Low impact. |
| 68 | Password hashes; no secrets in tables; field encryption | Delete | Duplicates security 22 and 34. |
| 69 | Least-privilege app user; migrations as a separate role | Keep | Specific. |
| 72 | Committed, reviewed migrations; never edit an applied one | Keep | Eval task `django-pinned-field`. |
| 73 | Expand, migrate, contract | Keep | Specific. |
| 74 | Lock timeouts; concurrent indexes; unvalidated constraints first | Keep | Specific. |
| 75 | Data migrations idempotent, batched, with a rollback plan | Keep | Specific. |
| 78 | Backups with PITR; test restores quarterly | Keep | Specific. |
| 79 | Retention deletion job | Delete | Duplicates security 50. |
| 80 | Anonymise production data before dev or test | Keep | Specific. |

## design.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 12 | Written design direction with approval before the first screen | Keep | Opinionated gate; Devbook's signature. |
| 13 | Distinctive through a few deliberate choices | Keep | Opinionated; shorten. |
| 14 | Avoid the generic template look (list) | Keep | Models default to exactly this look. |
| 15 | Real content, never lorem ipsum | Keep | Often missed. |
| 16 | Less, but better | Delete | Too vague to check. |
| 19 | One primary purpose per screen; hierarchy from size and weight | Delete | Generic design advice. |
| 20 | Consistency; follow platform conventions | Delete | Default. |
| 21 | Feedback within 100 ms; progress over 1 s | Delete | Generic heuristic. |
| 22 | Prevent errors; recognition over recall | Delete | Generic heuristic. |
| 23 | Honest UI; no dark patterns, fake urgency or fake social proof | Keep | Models write fake urgency on request. |
| 24 | Mobile first at 360 px | Keep | Absorbs core 73 (browser check at 360/1440, light/dark, keyboard). |
| 27 | Grid with steady rhythm; break once | Delete | Stylistic; hard to check. |
| 28 | Vary density | Delete | Stylistic. |
| 29 | Spacing and background before borders | Keep | Counters a default (bordered boxes). |
| 30 | Optical alignment; nested radius rule | Delete | Low impact. |
| 31 | One radius and elevation scale; soft tinted shadows | Merge | Into tokens (56). |
| 32 | One icon family; no generic stock | Keep | Often missed. |
| 33 | Squint, greyscale and removal tests | Delete | A model can't squint; it can screenshot, but this is a human review. |
| 36 | 4 or 8 px spacing scale | Merge | Into tokens (56). |
| 37 | Container queries for components | Delete | Niche. |
| 38 | Reading width 65–75 characters | Keep | Specific. |
| 39 | No fixed text heights; `min-width: 0`; `dvh`; safe areas | Keep | Common layout bugs. |
| 40 | Logical properties | Delete | Only matters for right-to-left; add back per project. |
| 43 | At most two families | Keep | Specific. |
| 44 | Modular scale, `clamp()`, 16 px body, line heights | Keep | Specific. |
| 45 | `text-wrap: balance`/`pretty`; tabular numbers | Keep | Non-default. |
| 46 | Ragged-right, sentence case | Delete | Default. |
| 49 | Role-named colour tokens; OKLCH | Keep | Specific. |
| 50 | Tinted neutrals; one sparing accent; status colours mean only that | Keep | Specific. |
| 51 | Light and dark token sets; toggle; `color-scheme`; no flash | Keep | Absorbs 52. |
| 52 | Tune dark mode separately | Merge | Into 51. |
| 53 | Colour paired with text, icon or pattern | Keep | axe doesn't catch it. |
| 56 | Tokens for colour, type, spacing, radii, shadows, z-index, durations | Keep | Absorbs 31 and 36. |
| 57 | Native elements first (`<dialog>`, `popover`, `<details>`) | Keep | Models build custom widgets. |
| 60 | Every interactive state | Keep | Often incomplete. |
| 61 | Buttons say what happens; one primary; destructive looks destructive | Delete | Default. |
| 62 | Icon-only buttons have an accessible name and tooltip | Enforce | axe `button-name`. |
| 63 | Skeletons vs spinners | Delete | Low impact. |
| 64 | Empty and error states with next action; keep input | Keep | Often missed. |
| 65 | Toasts, modals, no autoplay | Delete | Low impact. |
| 68 | Single column; visible labels; placeholders aren't labels | Keep | Common mistake. |
| 69 | `type`, `inputmode`, `autocomplete` on every field | Keep | Often missed. |
| 70 | Validate on blur and submit; focus first error | Keep | Specific. |
| 71 | Ask once; allow paste | Delete | Paste is in security 21. |
| 74 | Motion 150–250 ms; only `transform`/`opacity` | Keep | Specific. |
| 75 | One expressive moment per page | Delete | Stylistic. |
| 76 | `prefers-reduced-motion`; flash limit | Keep | Accessibility. |
| 79 | Semantic HTML first; ARIA only when needed; landmarks, skip link, one `h1` | Enforce | axe covers landmarks and headings; keep "semantic HTML before ARIA" as text. |
| 80 | Keyboard, visible focus, never obscured | Keep | WCAG 2.4.11 is new and missed. |
| 81 | Dialogs trap focus, Escape, return focus | Delete | Native `<dialog>` (57) does this. |
| 82 | Contrast ratios | Enforce | axe and a token contrast script. |
| 83 | 200% zoom, text spacing, 320 px | Keep | Specific. |
| 84 | 24×24 targets; 44×44 on touch; drag alternative | Keep | WCAG 2.2 specifics. |
| 85 | Decorative alt empty; captions and transcripts | Keep | Specific. |
| 86 | No puzzles at sign-in; consistent help | Delete | Niche. |
| 87 | Live regions for async results | Keep | Often missed. |
| 88 | Screen-reader spot-check before release | Keep | Human step; checkable. |
| new | axe on every page template, zero serious or critical (from testing 21) | Enforce | Pointer moves here because it is UI-only. |

## seo.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 12 | Public content in server or pre-rendered HTML; real 404/410 | Keep | Soft-404s are common. |
| 13 | Real `<a href>` links | Keep | SPAs break this. |
| 14 | `robots.txt` controls crawling, not indexing | Keep | Common misconception. |
| 15 | `noindex` previews, internal search, thin tags; auth for private | Keep | Specific. |
| 16 | Mobile has the same content (mobile-first indexing) | Delete | Responsive sites do this by default. |
| 17 | Sitemap: canonical 200 URLs; accurate `lastmod` | Keep | Specific. |
| 20 | Readable lowercase hyphenated URLs | Delete | Default. |
| 21 | One host, protocol and slash style, with 301s | Keep | Specific. |
| 22 | 301 changed URLs; avoid chains | Keep | Specific. |
| 23 | Self-referencing canonicals; paginated pages canonical to themselves | Keep | Common mistake. |
| 24 | `hreflang` with `x-default`; no auto-redirect by language | Keep | Specific. |
| 27 | Unique, descriptive titles | Merge | Into 28 (titles and descriptions in one bullet). |
| 28 | Unique meta descriptions; about 50–60 and 120–160 characters | Keep | Specific numbers. |
| 29 | One visible main heading | Delete | Duplicates design 79. |
| 30 | Open Graph and Twitter card set | Keep | Specific. |
| 31 | Visible author and dates matching structured data | Keep | Specific. |
| 32 | `WebSite` site name; 48 px square favicon | Keep | Specific. |
| 35 | Plan the site map; breadcrumbs | Delete | Generic. |
| 36 | No orphans; descriptive link text | Keep | Common mistake. |
| 37 | Fixed tag list; `noindex` tags under 3 items | Keep | Opinionated. |
| 38 | Pagination with plain links; filter pages `noindex` | Keep | Specific. |
| 39 | `rel="sponsored"`/`ugc` | Keep | Specific. |
| 42 | Important images as `<img>` with alt and descriptive filename | Keep | Specific. |
| 43 | `max-image-preview:large` | Keep | Specific; shorten. |
| 44 | Video watch page and `VideoObject` | Keep | Specific. |
| 47 | JSON-LD from page data; visible content only; nothing invented | Keep | Specific. |
| 48 | One `@graph` with stable `@id`s | Keep | Specific. |
| 49 | Only Search Gallery features; no FAQ/HowTo for Google | Keep | Current and non-obvious. |
| 50 | Validate with Rich Results Test | Keep | Checkable step. |
| 54–56 | Spam policies: cloaking, scaled content abuse, site reputation abuse | Keep | Models will mass-produce pages if asked; merge into one bullet. Counted as 3 rows. |
| 59 | Verify Search Console and Bing | Delete | An owner task, not an agent task. |
| 60 | Pre-launch: no leftover `noindex`, canonicals, redirects | Keep | Common launch mistake. |

## content.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 12 | Defined reader and intent; original value | Keep | Opinionated. |
| 13 | Write for readers, not rankings | Delete | Duplicates seo 54–56. |
| 14 | No cosmetic date changes | Keep | Non-obvious. |
| 17 | Plain, direct, active; grade 8 | Keep | Specific level. |
| 18 | Define terms; concrete examples | Delete | Default. |
| 19 | No hype words, filler intros, recap endings | Keep | Models do this constantly. |
| 20 | UI text in the user's words, sentence case, consistent terms | Keep | Specific. |
| 23 | Answer first | Keep | Counters a default. |
| 24 | Accurate headings, no clickbait | Delete | Default. |
| 25 | Lists, tables, prose; short paragraphs | Delete | Default. |
| 26 | End with a next step, not a summary | Keep | Counters a default. |
| 29 | Only real facts, quotes, testimonials | Keep | Fabrication guard. |
| 30 | Check claims against primary sources; AI citations false until verified | Keep | Fabrication guard. |
| 31 | Cite with author, title, date; state evidence strength | Keep | Specific. |
| 32 | Paraphrase; copy only when the licence allows | Keep | Licensing. |
| 33 | Real experience; YMYL reviewer | Keep | Specific. |
| 36 | Named author with bio; About, contact, privacy pages | Keep | E-E-A-T. |
| 37 | Explain how content was made | Keep | E-E-A-T. |
| 38 | Why: to help readers | Delete | Too vague to check. |
| 39 | Visible dates; dated "Updated" notes | Keep | Specific. |
| 40 | Disclose affiliates and sponsorships | Keep | Legal. |
| 41 | Review fast-changing pages every 6 months | Keep | Specific. |
| 44 | Publish the AI editorial policy | Keep | Opinionated. |
| 45–48 | AI policy: helper only, human checks, disclose, no faking | Keep | Opinionated. Counted as 3 rows; 47 merges with 37. |

## mobile.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 10 | Follow HIG and Material for navigation and gestures | Delete | Default. |
| 11 | Dynamic type, dark mode, screen readers, labels | Keep | Often missed. |
| 12 | Flaky networks: offline states, cache, queued writes | Keep | Often missed. |
| 13 | Slow work off the UI thread | Delete | Default. |
| 14 | Permissions only when needed, with a reason | Keep | Store policy. |
| 15 | Tokens in Keychain/Keystore; no API secrets in the bundle | Keep | Security. |
| 16 | Check store policies before payments, UGC, health, kids, AI | Keep | Changes often. |
| 17 | Privacy labels; in-app account deletion | Keep | Store requirement. |
| 18 | Crash reporting; oldest OS and low-end device | Keep | Specific. |
| 19 | Target API and SDK deadlines; edge-to-edge | Keep | Changes yearly. |
| 20 | Staged rollouts; forced-update path | Keep | Specific. |

## licensing.md

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | `LICENSE` at the root, or state proprietary | Keep | Specific. |
| 12 | A human chooses the licence | Keep | Approval gate. |
| 13 | Standard licences; CC not for software | Keep | Non-obvious. |
| 14 | SPDX identifiers and expressions | Keep | Specific. |
| 15 | Per-path licences documented | Keep | Specific. |
| 16 | Copy licence texts unchanged | Keep | Models paraphrase licences. |
| 19 | Check every dependency and asset licence against an allowlist | Keep | Often skipped. |
| 20 | GPL and AGPL triggers | Keep | Non-obvious. |
| 21 | Scan dependency licences in CI | Enforce | license-checker/pip-licenses. |
| 22 | Record asset source, author, licence | Keep | Often skipped. |
| 25 | Distribute required notices, generated from the lockfile | Keep | Specific. |
| 26 | Attribution credit fields | Keep | Specific. |
| 27 | Keep headers and attribution when copying | Keep | Models strip headers. |
| 28 | Trademarks need separate permission | Keep | Non-obvious. |
| 31 | No pasted code without a licence check and source comment | Keep | Non-obvious. |
| 32 | Don't reproduce large third-party blocks from memory | Keep | Legal risk. |
| 33 | Follow DCO or CLA | Delete | Default when a project has one. |

## feature-docs.md

Mostly a procedure. In Phase 4 it becomes the `feature-doc` skill and this file slims to its trigger rules. Here it is only checked for duplicates.

| Line | Rule (shortened) | Verdict | Reason |
|---|---|---|---|
| 11 | Create one only for rules, states, permissions, money, integrations, spread code | Keep | Trigger rule. |
| 12 | Not for simple CRUD or obvious code; ask when unsure | Keep | Trigger rule. |
| 13 | One per feature, under about 150 lines | Keep | Specific. |
| 16 | `FEATURE.md` in the feature folder, or `docs/features/` | Keep | Convention. |
| 17 | List each in `AGENTS.md`, one line | Keep | Routing. |
| 18 | Start from the template | Keep | Specific. |
| 21 | Purpose | Keep | Template guidance (moves to the skill in Phase 4). |
| 22 | Map | Keep | Same. |
| 23 | EARS rules with stable IDs | Keep | Same. |
| 24 | Flow and states | Keep | Same. |
| 25 | Decisions | Keep | Same. |
| 26 | Out of scope and open questions | Keep | Same. |
| 27 | Never: copied code, history, task lists, secrets | Keep | Same. |
| 30 | Purpose, Rules, Flow first, then approval | Keep | Gate. |
| 31 | Read the doc before changing a feature | Keep | Core benefit. |
| 32 | Update the doc in the same change | Keep | Sync rule. |
| 33 | Rule IDs in tests | Keep | Specific. |
| 34 | Code is the truth; report mismatches | Keep | Specific. |
| 35 | Terse facts in domain words | Delete | Covered by the template and the writing guide. |
| 36 | Delete the doc when the feature goes | Keep | Hygiene. |
