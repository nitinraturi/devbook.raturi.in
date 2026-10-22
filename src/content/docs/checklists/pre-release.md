---
title: Pre-release
description: Checklist before tagging and deploying a release - green pipeline, migrations reviewed, rollback ready, monitoring on, changelog written and owners on watch.
sidebar:
  order: 2
---

- [ ] `main` pipeline fully green, including e2e, accessibility and performance budgets
- [ ] Dependency audit clean or exceptions documented
- [ ] Migrations reviewed by a human; backup taken; rollback or recovery plan written
- [ ] Environment variables and secrets set for production; previews still isolated
- [ ] Feature flags in the intended state
- [ ] Changelog entry and version tag ready
- [ ] Rollback path tested (platform rollback or previous tag)
- [ ] Error tracking, uptime checks and alerts active for this release
- [ ] Post-deploy smoke test defined; someone watching errors and latency for the first hour
- [ ] User-facing docs or notes updated
