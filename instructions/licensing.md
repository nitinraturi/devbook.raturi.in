---
title: Licensing
description: Licence rules for any project - choosing a licence, SPDX identifiers, dependency and asset licences, notices, attribution, and copied or generated code.
sidebar:
  order: 11
sources:
  - SPDX specification
  - REUSE specification (FSFE)
  - Open Source Initiative licence list
  - choosealicense.com (GitHub)
  - Creative Commons guidance
---

Load for published or distributed projects, or any project using third-party code or assets. This is not legal advice: a human decides on licences, and a lawyer reviews anything unclear or high-stakes.

## First
- LIC-01: A human chooses or changes the project's licence. Never add, switch or remove one on your own; propose options with their trade-offs (permissive, weak copyleft, strong copyleft, proprietary) and wait.
- LIC-02: Check the licence of every dependency, font, icon set, image, video, dataset and model before adding it, against an allowlist in the project docs. Unknown, missing or custom licences need human approval. Scan dependency licences from the lockfile in CI.
- LIC-03: Never paste code from websites, answers or other repositories without checking its licence and recording the source in a comment. Stack Overflow content, for example, is licensed CC BY-SA.
- LIC-04: Don't reproduce large blocks of recognisable third-party code from memory. Use the dependency, or write the code fresh.

## The project's licence
- LIC-05: Every repository has a `LICENSE` file at the root, or states clearly that it is proprietary. Code without a licence is all rights reserved, so nobody may legally reuse it.
- LIC-06: Use standard licences, never custom wording: software licences for code, and Creative Commons or similar for text, docs and media. Creative Commons advises against its licences for software.
- LIC-07: Name licences by SPDX identifier (`MIT`, `Apache-2.0`, `CC-BY-4.0`) in the package manifest, README and file headers, with an SPDX expression (`MIT-0 AND CC-BY-4.0`) when parts differ.
- LIC-08: When paths use different licences, the README says which paths each covers, and the repo holds each full text.
- LIC-09: Copy licence texts unchanged from the official source. Fill in only the year and the copyright holder.

## Dependencies, assets and notices
- LIC-10: Know the copyleft triggers: GPL obligations apply when you distribute the software, and AGPL also when users interact with a modified version over a network. Flag either in a proprietary or permissively licensed project.
- LIC-11: Record the source, author and licence of every third-party asset, next to the file or in one credits file.
- LIC-12: When you distribute code or a build, include the notices its dependencies require, including Apache-2.0 `NOTICE` files, generated from the lockfile, not by hand.
- LIC-13: Give the credit attribution licences require: title, author, source link, licence link, and whether you changed the work.
- LIC-14: Keep copyright headers, licence files and attribution intact when you copy or modify third-party code, because removing them breaks most licences.
- LIC-15: A licence to use code does not grant the right to use its name or logo. Trademarks need separate permission.
