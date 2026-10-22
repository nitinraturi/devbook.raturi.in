---
title: Information architecture
description: How to organise, name and link content - site maps, canonical names, controlled vocabularies, up-across-down internal linking, breadcrumbs and no orphan pages.
sidebar:
  order: 3
---

## Rules

### Structure
- Write the site map before building pages. Every page has one parent (for breadcrumbs) even if it belongs to many categories (through tags or taxonomies).
- Every page is reachable within **three clicks** of the home page.
- Hubs (category or family pages) exist before or with their children, so they are never half-empty.

### Naming
- Each thing has one **canonical name**: the most widely used, plain name. Other names are listed as aliases and mentioned naturally in the copy.
- Slugs come from the canonical name: lowercase, hyphenated.
- Names follow a consistent pattern within a collection (for example `<qualifier> <thing>`).

### Taxonomy
- Categories, tags and relationships use **controlled vocabularies** defined in code (enums or reference collections), validated at build time.
- A tag page is indexed only when it has enough items to be useful (default: 3 or more); otherwise `noindex`.
- Relationships between items (related, prerequisite, next step, alternative) are stored as data and **derived** onto pages, never hand-maintained in two places.
- Reciprocal relationships are checked automatically.

### Internal linking: up, across, down
| Direction | Meaning | Example |
|---|---|---|
| **Up** | To the parent hub | Breadcrumb + "See all …" link |
| **Across** | To siblings | Related items grid |
| **Down** | To details | Links to specific sub-pages, glossary terms |

- Link the **first** mention of another page in the body, not every mention.
- Anchor text is the target's name or a natural phrase containing it.
- **No orphans:** every page has at least one internal link pointing to it; a build check reports orphans.
- Footer links to the main hubs and trust pages (about, contact, privacy, editorial policy).

### Breadcrumbs
- Visible breadcrumbs mirror the parent chain and match the `BreadcrumbList` structured data exactly.

### Filters and search
- Listing pages render all items as crawlable HTML; client-side filters only show and hide. Filter state lives in query parameters that are not indexed.

## Checklist
- [ ] Site map written; three-click rule holds
- [ ] Canonical names + aliases
- [ ] Controlled vocabularies validated at build
- [ ] Up/across/down links on each template
- [ ] Orphan check in CI
