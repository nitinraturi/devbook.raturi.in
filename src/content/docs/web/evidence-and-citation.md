---
title: Evidence and citation
description: Evidence hierarchy, certainty labels, a source registry with verification status, citation and quotation rules, and research docs as the single source for factual pages.
sidebar:
  order: 5
---

For any content that makes factual claims: health, science, finance, technical comparisons, product claims. The pattern: **research doc first, page second.** If a fact is not in the research doc, it is not on the page.

## Evidence hierarchy

Use the strongest available source for each claim (adapt the levels to the domain):

1. Systematic reviews and meta-analyses; official standards and specifications
2. Well-designed primary studies or primary data; official documentation
3. Lab, benchmark or mechanistic studies (good for *how*, weaker for *outcomes*)
4. Position statements and guidelines from recognised bodies
5. Expert consensus in reputable textbooks or references
6. Practical experience (allowed, labelled as such, never presented as research)

## Certainty labels

| Label | Meaning |
|---|---|
| **High** | Unlikely to change; consistent strong evidence or settled fact |
| **Moderate** | Probably right; a few consistent sources or strong reasoning plus some data |
| **Low** | Plausible but uncertain; single small source, reasoning or opinion |
| **Insufficient** | Not known; conflicting or absent evidence. Say so plainly |

- One small study supports at most **Moderate**.
- Do not generalise beyond the population or conditions studied; state them.
- A measured proxy is not the outcome (for example, a benchmark score is not real-world performance). Say what was actually measured.

## Source registry

All sources live once in `docs/research/sources.md` ([template](/templates/sources-registry/)) with an ID, full citation, link (DOI or official URL), status and a one-line note in your own words.

| Status | Meaning | Publishable? |
|---|---|---|
| Verified | Record and finding checked against the primary | Yes |
| Verified (details to confirm) | Finding checked; some bibliographic detail still to confirm | Yes, after details are confirmed |
| Verified via secondary | Finding seen in a reputable secondary source | Yes, never as sole support for High certainty |
| To verify | Not yet checked | **No** |

## Rules

- **MUST NOT** cite a source that has not been verified to exist with the stated title, authors, venue and year. AI-suggested citations are guilty until proven real.
- Read the primary source for any claim that drives a recommendation.
- IDs are never reused or renumbered. Withdrawn sources are marked and every page citing them updated.
- Paraphrase. Quotes are under 15 words and only when exact wording matters. Never reproduce figures or tables; describe them or draw your own.
- Pages render citations as links with author, year, title and venue.
- Research docs carry a version and changelog; pages record which research-doc version they were built from, and the build fails on a mismatch.

## Checklist
- [ ] Every claim has a source ID or is labelled as experience
- [ ] Certainty label on every recommendation
- [ ] No "To verify" sources behind published claims
- [ ] Populations and limits stated
- [ ] No copied text or figures
