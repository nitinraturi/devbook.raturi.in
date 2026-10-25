---
title: Licensing
description: Licence rules for any project - choosing a licence, SPDX identifiers, dependency and asset licences, notices, attribution, and copied or generated code.
sidebar:
  order: 11
---

Based on the SPDX specification, the REUSE specification (FSFE), the Open Source Initiative's licence list, GitHub's choosealicense.com and Creative Commons guidance. This is not legal advice: a human decides on licences, and a lawyer reviews anything unclear or high-stakes.

## The project's licence
- Every repository has a `LICENSE` file at the root, or states clearly that it is proprietary. Code without a licence is all rights reserved by default, so nobody may legally reuse it.
- A human chooses or changes the licence. Never add, switch or remove one on your own. Propose options with their trade-offs (permissive, weak copyleft, strong copyleft, proprietary) and wait.
- Use standard licences, never custom wording. Use software licences for code, and Creative Commons or similar licences for text, docs and media. Creative Commons advises against its licences for software.
- Name licences by SPDX identifier (`MIT`, `Apache-2.0`, `CC-BY-4.0`) in the package manifest, README and file headers. Use an SPDX expression (`MIT-0 AND CC-BY-4.0`) when parts differ.
- When paths use different licences, the README says which paths each covers, and the repo holds each full text.
- Copy licence texts unchanged from the official source. Fill in only the year and the copyright holder.

## Dependencies and assets
- Check the licence of every dependency, font, icon set, image, video, dataset and model before adding it, against an allowlist in the project docs. Unknown, missing or custom licences need human approval.
- Know the copyleft triggers: GPL obligations apply when you distribute the software, and AGPL also when users interact with a modified version over a network. Flag either in a proprietary or permissively licensed project.
- Scan dependency licences in CI from the lockfile and fail on any outside the allowlist.
- Record the source, author and licence of every third-party asset, next to the file or in one credits file.

## Notices and attribution
- When you distribute code or a build, include the copyright and licence notices its dependencies require, including Apache-2.0 `NOTICE` files. Generate the third-party notices from the lockfile, not by hand.
- Give the credit that attribution licences require: title, author, source link, licence link, and whether you changed the work.
- Keep copyright headers, licence files and attribution intact when you copy or modify third-party code, because removing them breaks most licences.
- A licence to use code does not grant the right to use its name or logo. Trademarks need separate permission.

## Copied and generated code
- Never paste code from websites, answers or other repositories without checking its licence and recording the source in a comment. Stack Overflow content, for example, is licensed CC BY-SA.
- Don't reproduce large blocks of recognisable third-party code from memory. Use the dependency, or write the code fresh.
- Contributions come under the project's licence. Follow the project's DCO sign-off or CLA if it has one.
