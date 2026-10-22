---
title: Audit
description: Prompts for a sitewide SEO audit, a performance and accessibility audit with Lighthouse and axe, a dependency audit, and a docs drift check against the code.
sidebar:
  order: 5
---

## SEO audit

```markdown
Audit the built site (dist/) against the devbook technical SEO, structured data and information architecture pages, plus project overrides in docs/.
Check: titles and descriptions (length, uniqueness), one H1, canonicals, robots/noindex, sitemap contents, JSON-LD validity and visible-content match, breadcrumbs, orphan pages, internal links per page, image alt and dimensions, OG tags and images, broken links.
Output: a prioritised issue list with file paths and fixes. Fix blockers in a separate PR after I approve.

Honesty rule: report what you measured; do not estimate scores you did not run.
```

## Performance and accessibility audit

```markdown
Run Lighthouse CI (mobile) and axe on: <list of URLs/templates>. Compare against the project's budgets (devbook performance budgets unless overridden) and the accessibility checklist.
For any heavy interactive component, profile on a 4× CPU-throttled run and report frame time, JS heap and network weight.
Output: findings ranked by user impact with concrete fixes and the expected effect on each metric.

Honesty rule: paste the actual numbers; mark anything not measured.
```

## Dependency audit

```markdown
List all direct dependencies with version, purpose (where used), licence, last release date and known vulnerabilities (from the package manager's audit).
Flag: unused packages, duplicates doing the same job, unmaintained packages, licences outside the allowlist, packages that could be replaced by the standard library.
Output: a table and recommended actions. Do not change anything yet.

Honesty rule: do not guess release dates or licences; mark unknowns.
```

## Docs drift check

```markdown
Compare docs/ (spec, ADRs, AGENTS.md, README) with the current code. List every place where they disagree: commands that no longer work, renamed files, behaviour that changed, decisions not recorded.
Output: a list of proposed doc edits (before/after). Do not edit code.

Honesty rule: cite file:line for every mismatch.
```
