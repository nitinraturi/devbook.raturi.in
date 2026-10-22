---
title: CI/CD and deployment
description: Pipeline stages in order, preview deployments, environments, secrets in CI, release tagging, rollback and post-deploy checks for any stack.
sidebar:
  order: 4
---

## Rules

### Pipeline (runs on every PR and on main)
Stages in this order, failing fast:

1. Install from lockfile
2. Format and lint
3. Type check
4. Unit tests
5. Content/data validation (schemas, references)
6. Build
7. Link check on the build output
8. Integration and end-to-end tests with accessibility checks
9. Performance budgets (Lighthouse CI, bundle size)
10. Dependency audit

- A red pipeline blocks merge. No "merge and fix later".
- Pipeline duration **SHOULD** stay under about 10 minutes for PRs; move slow suites to nightly if needed.

### Environments
- At least: local, preview (per PR), production. Add staging when there is a database or integrations worth testing before production.
- Each environment has its own secrets and credentials. Previews never use production data or production analytics IDs.
- Preview URLs **SHOULD** be `noindex` and not publicly linked.

### Secrets in CI
- Stored in the CI or hosting platform's secret store, scoped to the environments that need them.
- Never echoed in logs; masked by the platform.

### Releases
- Production deploys come only from `main` (or release tags) through CI, never from a laptop.
- Every release is tagged and has a changelog entry.
- Database migrations run as an explicit, reviewed step before or with the release, following the [data rules](/engineering/data-and-database/).

### Rollback
- Every deploy can be rolled back in minutes (platform rollback or redeploy of the previous tag). Test the rollback once before launch.
- Migrations that cannot be rolled back are called out in the PR with a recovery plan.

### After deploy
- Smoke check the key pages or endpoints automatically.
- Watch error rate and latency for the first hour after significant releases.

## Checklist
- [ ] Pipeline stages in order; red blocks merge
- [ ] Preview per PR, noindex, no production data
- [ ] Secrets per environment
- [ ] Tagged releases with changelog
- [ ] Rollback tested
- [ ] Post-deploy smoke check
