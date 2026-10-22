---
title: Structured data
description: JSON-LD rules - mark up only visible content, one connected graph per page, common types per page kind, and which markup to avoid given Google's 2023-2024 changes.
lastVerified: 2026-10-22
sidebar:
  order: 2
---

Structured data helps search engines understand a page. It earns rich results only for supported types and only when it matches what users can see.

## Rules

- Use **JSON-LD** in the page head, built from the same data that renders the page, so they cannot drift.
- Mark up **only content that is visible** on the page. Never mark up hidden, invented or aggregated-from-elsewhere content.
- One `@graph` per page with stable `@id`s (`https://example.com/#website`, `…/#person`, `<page-url>#webpage`) so entities connect.
- Use the **same Person or Organization `@id`** across all sites you own so they describe one entity.
- Validate every template with Google's Rich Results Test and the Schema.org validator before merging.
- Re-check Google's supported features at least twice a year; they change.

## Types by page kind

| Page | Types |
|---|---|
| Every page | `WebSite`, `Person` or `Organization` (publisher), `BreadcrumbList` |
| Article, guide, docs page | `Article`, `TechArticle` or `BlogPosting` with `headline`, `description`, `author`, `datePublished`, `dateModified`, `image` |
| Hub or category page | `CollectionPage` + `ItemList` |
| Product | `Product` with real `offers`; reviews only if genuine |
| Software / app | `SoftwareApplication` |
| Video on the page | `VideoObject` (only if the video is really on the page) |
| Event | `Event` |

## What to avoid (as of the verification date)

- **HowTo:** Google stopped showing HowTo rich results in 2023. Write steps as an ordered list in HTML instead.
- **FAQPage:** since 2023 Google shows FAQ rich results only for well-known authoritative government and health sites. Write questions as normal headings; skip the markup.
- **Sitelinks search box (`SearchAction`):** retired by Google; do not rely on it.
- **Review / AggregateRating:** only for genuine reviews you collect and display; never fabricate or import ratings.
- Any markup describing content that is not on the page.

## Example (docs page)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://devbook.raturi.in/#website", "url": "https://devbook.raturi.in/", "name": "Devbook", "publisher": { "@id": "https://raturi.in/#person" } },
    { "@type": "Person", "@id": "https://raturi.in/#person", "name": "Nitin Raturi", "url": "https://raturi.in/" },
    { "@type": "TechArticle", "@id": "https://devbook.raturi.in/web/structured-data/#article",
      "headline": "Structured data", "author": { "@id": "https://raturi.in/#person" },
      "dateModified": "2026-10-22", "isPartOf": { "@id": "https://devbook.raturi.in/#website" } },
    { "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Web & content", "item": "https://devbook.raturi.in/web/technical-seo/" },
      { "@type": "ListItem", "position": 2, "name": "Structured data" } ] }
  ]
}
```

## Checklist
- [ ] JSON-LD from the same data as the page
- [ ] Only visible content marked up
- [ ] Stable, shared `@id`s
- [ ] No HowTo/FAQ/SearchAction; no fake reviews
- [ ] Validated in both tools
