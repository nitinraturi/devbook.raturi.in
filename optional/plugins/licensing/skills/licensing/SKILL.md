---
name: licensing
description: "Checks the licence of a dependency, font, icon set, image, dataset, model or copied snippet before it is added, records sources and SPDX identifiers, and lists required notices. Use when adding third-party code or assets, or when asked about licences, attribution, NOTICE files or licence compatibility."
license: CC-BY-4.0
---

# Licensing

This is not legal advice. A human decides on licences, and a lawyer reviews anything unclear or high-stakes.

## Procedure

1. Identify what is being added and where it comes from: package name and registry, asset URL and author, or the snippet's source.
2. Find its licence from the primary source (the package's licence file or registry metadata, the asset's licence page). Name it by SPDX identifier (`MIT`, `Apache-2.0`, `CC-BY-4.0`).
3. Compare it with the project's licence allowlist, if it has one. Unknown, missing or custom licences need human approval: stop and ask.
4. Flag copyleft triggers: GPL obligations apply when the software is distributed, AGPL also when users interact with a modified version over a network. Flag either in a proprietary or permissively licensed project.
5. Record the source, author and licence of each third-party asset next to the file or in the project's credits file, and the source of any copied code in a comment.
6. Report the licence, whether it is allowed, the attribution or notices it requires, and anything that needs a human decision.

## Rules

- Never add, switch or remove the project's own licence. When asked, propose standard options (permissive, weak copyleft, strong copyleft, proprietary) with their trade-offs and wait.
- Never paste code from websites, answers or other repositories without checking its licence; Stack Overflow content, for example, is CC BY-SA.
- Don't reproduce large blocks of recognisable third-party code from memory. Use the dependency, or write the code fresh.
- Keep copyright headers, licence files and attribution intact when copying or modifying third-party code.
- Give the credit attribution licences require: title, author, source link, licence link, and whether the work was changed.
- When distributing a build, include the notices dependencies require, including Apache-2.0 `NOTICE` files, generated from the lockfile, not by hand.
- Use SPDX expressions (`MIT-0 AND CC-BY-4.0`) where parts differ, and copy licence texts unchanged from the official source.
- A licence to use code does not grant the right to use its name or logo.

Sources: SPDX License List, Open Source Initiative, Creative Commons, choosealicense.com.
