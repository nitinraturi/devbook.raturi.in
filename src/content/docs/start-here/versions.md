---
title: Versions and changelog
description: See Devbook releases, understand semantic versioning, and find the exact release tag and notes to pin in your project.
sidebar:
  order: 5
---

Devbook is versioned so projects can adopt a stable set of rules and upgrade deliberately. The repository's root [`CHANGELOG.md`](https://github.com/nitinraturi/devbook.raturi.in/blob/main/CHANGELOG.md) is the canonical release history; this page links to it rather than keeping a second copy.

## Current release

**v1.0.0** — October 23, 2026. This is the first versioned release.

- [Read the v1.0.0 changelog](https://github.com/nitinraturi/devbook.raturi.in/blob/v1.0.0/CHANGELOG.md).
- [Browse the v1.0.0 source](https://github.com/nitinraturi/devbook.raturi.in/tree/v1.0.0).
- [Browse the full changelog](https://github.com/nitinraturi/devbook.raturi.in/blob/main/CHANGELOG.md), including unreleased changes.

Pin the exact release in a project:

```bash
git submodule add https://github.com/nitinraturi/devbook.raturi.in docs/devbook
git -C docs/devbook checkout v1.0.0
```

## Versioning policy

- **Major** versions can change a rule in a way that may fail an existing project's checks.
- **Minor** versions add a rule, page, stack profile or template.
- **Patch** versions cover wording, links and re-verification dates.
- Changes awaiting a release are listed under `[Unreleased]` in the canonical changelog. Unreleased changes do not have a pin-able version tag.

Each release moves its completed notes into a dated version section and creates a matching `vX.Y.Z` tag on the release commit. Projects upgrade that pin in a deliberate pull request after reviewing the changelog.

New to Devbook? Start with the [introduction](/start-here/introduction/) or follow the [adoption guide](/start-here/adopt-in-a-project/).
