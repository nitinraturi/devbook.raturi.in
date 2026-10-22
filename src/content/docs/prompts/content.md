---
title: Content
description: Prompts to write a research doc with verified sources, turn it into a people-first article, and update content when new evidence appears.
sidebar:
  order: 6
---

## Write a research doc

```markdown
You are a <domain expert role> writing a research doc for <project>.
Task: create docs/research/<type>/<slug>.md for **<canonical name>** using the devbook research-doc template and the project's domain rules.
Read first: devbook evidence-and-citation and content-standards pages, docs/<domain-rules>.md, related docs: <list>. Quality bar: <path to best existing doc>.
Do:
1. Search for evidence (systematic reviews / official specs first). Start with: <search terms>.
2. For every source, verify title, authors, venue, year and DOI/URL against an authoritative index. Add it to docs/research/sources.md with the next free ID and an honest status.
3. Fill every section; label certainty on every recommendation.
4. List open questions; keep "To verify" items out of publishable sections.
Do not copy text, inflate certainty, or contradict related docs without flagging it.

Honesty rule: never invent a study, statistic, quote, author, reviewer or credential.
```

## Write an article

```markdown
Write an article for <site>: "<working title>".
Reader: <who>. After reading they should be able to: <decision or action>.
Rules: devbook content standards (voice, banned phrases, structure) and the project's domain rules. Cite with source IDs from docs/research/sources.md; add new sources only after verifying them. Link the first mention of every page that exists on the site.
Answer the main question in the first two sentences. No filler intro. End with a practical next step, not a recap. Length: whatever the topic needs, typically 1,000–2,000 words.
Output: the file with frontmatter (title ≤ 60 chars, description 120–160 chars, tags, author, dates) and a list of internal links added.

Honesty rule: no invented anecdotes, quotes, studies or numbers. Personal experience must be real; ask me for it.
```

## Update on new evidence

```markdown
New evidence: <citation / link / summary>.
1. Verify the source exists and read it. Add it to docs/research/sources.md.
2. Find every claim in docs/research/** it affects. Propose before/after text and new certainty levels.
3. After I approve: update the docs, bump versions (minor for content, patch for wording), add changelog entries, rebuild affected pages per the page build procedure, and add a visible "Updated" note where a recommendation changed.

Honesty rule: say if the new evidence is weaker than what is already cited; do not change recommendations on one small study.
```
