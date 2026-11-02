---
name: devbook-release-check
description: "Checks a project is ready to release and reports go or no-go: checks green, changelog, migrations, rollback, headers and accessibility. Use when asked if something is ready to ship, release or deploy, or to prepare release notes."
license: CC-BY-4.0
---

# Release check

Check and report; don't tag, push or deploy unless asked (CORE-05).

1. Run the project's format, lint, typecheck, tests and build, and show the real output (CORE-01). Stop at the first failure and report it.
2. Run the dependency audit and the secret scanner if the project has them (SEC-03, SEC-19).
3. Compare the release with the last tag (`git log <tag>..HEAD`): every user-visible change is in the changelog and docs (CORE-18), and the version follows the project's scheme.
4. Migrations: each is reviewed, ordered for expand and contract, and has a rollback or forward-fix plan (DB-03, DB-04, DB-31). Deploys run them as an explicit step (PERF-14).
5. Web projects: security headers and CSP (SEC-05, SEC-18), Core Web Vitals or Lighthouse budgets (PERF-01, PERF-02), axe with zero serious issues (DES-05), and for public sites the launch checks (SEO-25).
6. Monitoring and rollback: error tracking with the new release version, uptime checks, and how to roll back in minutes (PERF-13, PERF-14).
7. Report in the shape of [references/report-template.md](references/report-template.md): a go or no-go with every blocking item, the non-blocking items, and draft release notes from the changelog.
