---
title: SEO and web performance
description: Technical SEO, structured data, site structure and Core Web Vitals rules an assistant follows for any public website, docs site or blog.
sidebar:
  order: 5
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
- Images have descriptive alt text, explicit dimensions and modern formats (AVIF or WebP).
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

## Core Web Vitals
- Targets at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Aim for LCP ≤ 2.0 s on content sites.
- Lab budgets on mobile: Lighthouse performance 90+ for content sites (85+ for apps), accessibility 95+, SEO 100. Enforce them in CI.
- Ship JavaScript only for interactive parts. Content sites need no JS for reading.
- The LCP element is in the initial HTML with `fetchpriority="high"` and is never lazy-loaded.
- Set `width` and `height` (or `aspect-ratio`) on images, video and embeds. Use `srcset` and `sizes`.
- Self-host and subset fonts with `font-display: swap`; use at most 3 font files.
- Every third-party script needs a written reason. Load analytics after the content, and only after consent where required.

## Launch
- Verify the site in Google Search Console and Bing Webmaster Tools, and submit the sitemap.
- Check indexing and Core Web Vitals reports monthly.
