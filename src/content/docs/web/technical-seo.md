---
title: Technical SEO
description: Crawlable rendering, URL and canonical rules, indexation, titles and descriptions, headings, images, Open Graph, sitemaps, robots.txt, llms.txt and search console setup.
lastVerified: 2026-10-22
sidebar:
  order: 1
---

Technical SEO makes good content findable. It cannot rescue weak content; see [content standards](/web/content-standards/).

## Rules

### Rendering
- Public content **MUST** be in the server-rendered or pre-rendered HTML, not injected by client JavaScript.
- Core text, links and headings are visible without JavaScript.

### URLs
- Lowercase, hyphenated, readable, stable: `/guides/api-design/`. No IDs, dates or session parameters in content URLs.
- Pick one trailing-slash style and redirect the other with a 301.
- Flat URLs **SHOULD** be preferred when a page can belong to several categories, so reclassification never changes the URL.
- A changed URL **MUST** 301-redirect from the old one, permanently.

### Canonicals and duplicates
- Every indexable page has one absolute, self-referencing canonical URL.
- Alternative names for the same thing are handled in the copy, not with duplicate pages.
- Filter, sort and tracking parameters do not create indexable pages; canonical points to the clean URL.
- Paginated pages are self-canonical (do not canonicalise page 2 to page 1).

### Indexation
- `noindex, follow` for internal search results, thin tag pages, previews and staging.
- Previews and staging are also blocked from being linked publicly.
- `robots.txt` allows crawling of public content and points to the sitemap. Do not use `robots.txt` to hide pages you want de-indexed; use `noindex`.
- XML sitemap lists only canonical, indexable URLs, with accurate `lastmod`.

### On-page
| Element | Rule |
|---|---|
| `<title>` | Unique; about 50–60 characters; primary topic first; brand suffix trimmed if it overflows |
| Meta description | Unique; about 120–160 characters; says what the reader gets; no keyword stuffing |
| H1 | Exactly one; matches the page's main topic |
| Headings | Logical outline; phrased the way people search |
| Intro | First one or two sentences answer the core question plainly |
| Links | Descriptive anchor text; never "click here" |
| Images | Descriptive `alt`, explicit dimensions, modern formats, descriptive filenames |
| Dates | Visible published/updated dates on articles, matching structured data |
| Author | Visible byline linking to an author page |

### Social previews
- `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`; `twitter:card` set to `summary_large_image`.

### International
- Use `hreflang` only when you publish real translated or regional versions.

### AI search and llms.txt
- AI answer engines read the same HTML as search engines; clear headings, direct answers and accurate facts serve both.
- `llms.txt` is an emerging convention for giving language models a curated map of a site. It is optional and not a ranking factor. Add it for documentation-heavy sites where it is cheap to generate; do not maintain it by hand.

### Discovery
- Verify the site in Google Search Console and Bing Webmaster Tools; submit the sitemap.
- Watch indexing coverage, Core Web Vitals and enhancement reports monthly.

## Checklist
- [ ] Content in HTML without JS
- [ ] One canonical per page; redirects for changed URLs
- [ ] noindex on search, thin tags, previews
- [ ] Unique title and description per page
- [ ] One H1; alt text; dimensions on images
- [ ] OG tags and image
- [ ] Sitemap + robots.txt; search consoles verified
