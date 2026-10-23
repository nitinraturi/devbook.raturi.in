---
title: SEO
description: Technical SEO from Google Search Central guidance - crawling, indexing, titles, links, images, structured data, spam policies and launch checks.
sidebar:
  order: 7
lastVerified: 2026-10-23
---

Based on Google Search Essentials and the Search Central docs. No trick replaces a fast, crawlable site with genuinely useful pages. Check the docs before using any feature with a date or "supported" status.

## Crawling and indexing
- Public content is in the server or pre-rendered HTML with a 200 status. Missing pages return a real 404 or 410, never a 200 "not found" page.
- Links are real `<a href>` elements with resolvable URLs. Google does not click buttons, run `onclick` navigation or follow `#fragment` routes.
- Don't block CSS, JS or images that are needed to render the page in `robots.txt`. `robots.txt` controls crawling, not indexing: use `noindex` to keep a page out, and don't block that page in `robots.txt` or Google never sees the `noindex`.
- Previews, staging, internal search results, thin tag pages and account pages are `noindex`. Protect private content with authentication, not `noindex`.
- The mobile page has the same content, links, metadata and structured data as desktop (mobile-first indexing).
- XML sitemap lists only canonical, indexable 200 URLs, with `lastmod` only when it is accurate (Google ignores `priority` and `changefreq`). Link it from `robots.txt` and submit it.

## URLs and duplicates
- URLs are readable words in lowercase, separated by hyphens, in a logical hierarchy. No session IDs or tracking parameters in internal links.
- One host, one protocol (HTTPS) and one trailing-slash style. Redirect every variant with a 301 to it.
- When a URL changes, 301-redirect the old one permanently, update internal links and the sitemap. Avoid redirect chains.
- Every indexable page has an absolute, self-referencing `rel="canonical"`. Duplicates point to the preferred URL. Paginated pages each get their own canonical; never canonicalise page 2 to page 1.
- Multilingual sites use `hreflang` on every version, including a self-reference and `x-default`. Never auto-redirect by IP or browser language.

## Titles, snippets and headings
- Each page has a unique, concise, descriptive `<title>` that leads with the page's topic and adds the site name briefly. No keyword stuffing or boilerplate titles. Google may rewrite poor titles.
- Each page has a unique meta description that summarises it, with the most important information first. Google sets no character limit and may show other text instead; about 50–60 characters for titles and 120–160 for descriptions is a house heuristic that limits truncation, not a Google rule.
- One visible main heading that matches the title's intent. Headings form a logical outline.
- Use `data-nosnippet`, `max-snippet` or `nosnippet` only when you need to limit what search and AI features quote.
- Social previews: `og:title`, `og:description`, `og:url`, a 1200×630 `og:image` with alt, and `twitter:card`.
- Articles show a visible author (linked to an author page) and published and updated dates that match `datePublished` and `dateModified`.
- Set the site name with `WebSite` structured data on the home page. The favicon is square, at least 48×48 px, at a stable crawlable URL.

## Links and structure
- Plan the site map first. Every important page is reachable through crawlable internal links within a few clicks of home. Breadcrumbs show typical user paths; a page in several hierarchies may have several trails.
- No orphan pages. Link up to the hub, across to siblings and down to details. Link text describes the target ("pricing for teams", not "click here").
- Categories and tags come from a fixed list in code. Index a tag page only once it has real content (3 or more items).
- Listing and pagination pages link each page with plain `<a href>` links. Client-side filters only show or hide items; filter combinations that are not real landing pages are `noindex` or not linked.
- Mark paid, sponsored or user-generated outbound links with `rel="sponsored"` or `rel="ugc"` (`nofollow` when neither applies).

## Images and video
- Important images are `<img>` elements (not CSS backgrounds) with descriptive `alt`, a descriptive filename and nearby relevant text.
- Use responsive images in modern formats (see performance). Add `max-image-preview:large` where large previews are wanted.
- Video has a dedicated watch page, a thumbnail, and `VideoObject` structured data.

## Structured data
- Use JSON-LD, generated from the same data that renders the page. Mark up only content visible on the page; never invent reviews, ratings or prices.
- One `@graph` per page with stable `@id`s: `WebSite` and `Organization` or `Person` site-wide; `BreadcrumbList`; then the page type (`Article`/`BlogPosting`, `Product`, `SoftwareApplication`, `Event`, `LocalBusiness`, `Recipe`, `JobPosting`, `VideoObject`) where it fits.
- Only features in Google's current Search Gallery can produce rich results. Google no longer shows FAQ or HowTo rich results, so don't add that markup for Google Search.
- Validate with the Rich Results Test and the Schema Markup Validator. Check the Search Console enhancement reports after release.

## Spam policies (never)
- Cloaking, sneaky redirects, hidden text or links, keyword stuffing, doorway pages, or link schemes (bought, exchanged or automated links).
- Scaled content abuse: mass-producing pages (by AI or otherwise) mainly to rank, without real value for readers.
- Site reputation abuse (hosting third-party pages to exploit the site's ranking) and expired-domain abuse.

## Launch and monitoring
- Verify Google Search Console and Bing Webmaster Tools, and submit the sitemap. Check the page indexing, Core Web Vitals and manual actions reports.
- Before launch: no `noindex` or `Disallow: /` left over from staging, canonicals point to production URLs, redirects for any old URLs, and every template passes the Rich Results Test.
- Review indexing and performance reports monthly. Investigate sudden drops by page type and query.
