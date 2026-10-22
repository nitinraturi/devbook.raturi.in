---
title: Supply chain security
description: Lockfiles, pinned versions, automated updates and audits, licence checks, CI permissions, and the hallucinated-package risk when AI agents suggest dependencies.
sidebar:
  order: 2
---

Most of the code you ship is code you did not write. AI agents add a new risk: they sometimes suggest packages that do not exist, and attackers can register those names with malicious code (sometimes called "slopsquatting").

## Rules

### Adding a dependency
- Every new dependency **MUST** be approved by a human. The agent states why it is needed and what the alternative is.
- Before adding, check: the package exists under the exact name in the official registry, it is actively maintained, it has meaningful usage, its repository matches the package, and its licence is on the allowlist.
- Prefer the platform's standard library or an existing dependency over a new one for small tasks.

### Pinning and updates
- Lockfiles **MUST** be committed; CI installs from the lockfile only (`npm ci`, `pip install --require-hashes` or equivalent).
- Automated update PRs (Dependabot or Renovate) run at least weekly; security updates are merged promptly after CI passes.
- CI runs a dependency audit and fails on high or critical known vulnerabilities, with a documented exception process.

### Licences
- Keep a licence allowlist per project (commonly MIT, BSD, Apache-2.0, ISC, CC0 for code and assets). Copyleft licences need an explicit decision.
- Record the licence of every bundled asset (fonts, icons, 3D models, images) in the repo.

### Build and CI
- CI tokens have the least permissions needed; read-only by default.
- Third-party CI actions **SHOULD** be pinned to a commit SHA, not a moving tag.
- Release artefacts are built in CI from a tagged commit, not on a laptop.
- Never pipe a remote script straight into a shell in CI without pinning and checksum verification.

### Scripts and CDNs
- Front-end code loads libraries from the project's own bundle. If a third-party CDN is unavoidable, pin the version and use Subresource Integrity.

## Checklist
- [ ] New package verified to exist, maintained, licence allowed
- [ ] Lockfile committed; CI installs from it
- [ ] Automated update PRs on
- [ ] Audit step in CI
- [ ] CI actions pinned; token permissions minimal
