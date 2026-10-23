---
title: SEO
description: Technical SEO rules for any public website, docs site or blog - rendering, URLs, metadata, site structure, structured data and launch checks.
sidebar:
  order: 7
---

## Rendering and URLs
- Public content is in server-rendered or pre-rendered HTML and readable without JavaScript.
- URLs are lowercase, hyphenated, readable and stable. Use one trailing-slash style and one host, with 301 redirects for the other.
- When a URL changes, 301-redirect the old one permanently.
- Every indexable page has one absolute, self-referencing canonical URL.
- Previews, staging, internal search and thin tag pages are `noindex`. Use `noindex` for de-indexing, not `robots.txt`.
- `robots.txt` allows public content and links the XML sitemap. The sitemap lists only canonical, indexable URLs with accurate `lastmod`.

## Every page
- A unique `<title>` (about 50–60 characters, main topic first) and a unique meta description (about 120–160 characters).
- Exactly one H1. Headings form a logical outline, worded the way people search.
- The first one or two sentences answer the page's main question.
- Descriptive link text, never "click here". Link the first mention of related pages.
- Images have descriptive alt text. Meet the Core Web Vitals budgets in the performance instructions.
- Open Graph tags: `og:title`, `og:description`, a 1200×630 `og:image`, `og:url` and `twitter:card`.
- Articles show visible published and updated dates and an author linked to an author page.

## Site structure
- Plan the site map first. Every page is within 3 clicks of home and has one parent for breadcrumbs.
- No orphan pages. Link up to the hub, across to siblings and down to details.
- Categories and tags come from a fixed list defined in code. Index tag pages only once they have 3 or more items.
- Listing pages render every item as crawlable HTML. Client-side filters only show or hide.

## Structured data
- Use JSON-LD built from the same data that renders the page. Mark up only visible content.
- One `@graph` per page with stable `@id`s. Use `WebSite`, `Person` or `Organization`, and `BreadcrumbList`, plus `Article`, `BlogPosting`, `Product` or `SoftwareApplication` where they fit.
- Do not add HowTo or FAQPage markup expecting rich results. Never fabricate reviews or ratings.
- Check Google's currently supported features, then validate with the Rich Results Test.

## Launch
- Verify the site in Google Search Console and Bing Webmaster Tools, and submit the sitemap.
- Check indexing and Core Web Vitals reports monthly.
