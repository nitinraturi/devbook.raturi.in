---
title: SEO
description: Technical SEO from Google Search Central guidance - crawling, indexing, canonicals, titles, links, images, structured data, spam policies and launch checks.
sidebar:
  order: 8
sources:
  - Google Search Essentials
  - Google Search Central documentation
---

Load for any public website. Rank with a fast, crawlable site and genuinely useful pages; no trick replaces them. Check the docs before using any feature with a date or "supported" status.

## First
- SEO-01: Public content is in the server or pre-rendered HTML with a 200 status. Missing pages return a real 404 or 410, never a 200 "not found" page.
- SEO-02: Links are real `<a href>` elements with resolvable URLs. Google does not click buttons, run `onclick` navigation or follow `#fragment` routes.
- SEO-03: Every indexable page has an absolute, self-referencing `rel="canonical"`, and duplicates point to the preferred URL. Paginated pages each get their own canonical, not page 1's, or Google may drop the items only page 2 links to.
- SEO-04: `robots.txt` controls crawling, not indexing. Use `noindex` to keep a page out and don't block that page in `robots.txt`, or Google never sees the `noindex`. Don't block CSS, JS or images needed to render.
- SEO-05: Never cloak, use sneaky redirects, hide text or links, stuff keywords, build doorway pages or join link schemes. Don't mass-produce pages, by AI or otherwise, mainly to rank (scaled content abuse), or host third-party pages to exploit the site's ranking. These break Google's spam policies and can remove the site from results.

## Indexing
- SEO-06: Previews, staging, internal search results, thin tag pages and account pages are `noindex`. Protect private content with authentication, not `noindex`.
- SEO-07: The XML sitemap lists only canonical, indexable 200 URLs, with `lastmod` only when it is accurate (Google ignores `priority` and `changefreq`). Link it from `robots.txt`.
- SEO-08: One host, one protocol (HTTPS) and one trailing-slash style; 301-redirect every variant to it.
- SEO-09: When a URL changes, 301-redirect the old one, update internal links and the sitemap, and avoid redirect chains.
- SEO-10: Multilingual sites use `hreflang` on every version, including a self-reference and `x-default`. Let users choose a language instead of auto-redirecting by IP or browser language, which can hide versions from Google.

## Titles and snippets
- SEO-11: Each page has a unique `<title>` that leads with its topic and adds the site name briefly, and a unique meta description that summarises it, most important first. Aim for about 50–60 and 120–160 characters to limit truncation; Google sets no limit and may rewrite poor titles.
- SEO-12: Social previews: `og:title`, `og:description`, `og:url`, a 1200×630 `og:image` with alt, and `twitter:card`.
- SEO-13: Articles show a visible author, linked to an author page, and published and updated dates that match `datePublished` and `dateModified`.
- SEO-14: Set the site name with `WebSite` structured data on the home page. The favicon is square, at least 48×48 px, at a stable crawlable URL.

## Links and structure
- SEO-15: No orphan pages: link up to the hub, across to siblings and down to details. Link text describes the target ("pricing for teams", not "click here").
- SEO-16: Categories and tags come from a fixed list in code. A tag page stays `noindex` until it has 3 or more items, because thin pages hurt the whole site.
- SEO-17: Listing and pagination pages link each page with plain `<a href>` links. Filter combinations that are not real landing pages are `noindex` or not linked.
- SEO-18: Mark paid, sponsored or user-generated outbound links with `rel="sponsored"` or `rel="ugc"` (`nofollow` when neither applies).

## Images and video
- SEO-19: Important images are `<img>` elements, not CSS backgrounds, with descriptive `alt`, a descriptive filename and nearby relevant text. Add `max-image-preview:large` where large previews are wanted.
- SEO-20: Video has a dedicated watch page, a thumbnail and `VideoObject` structured data.

## Structured data
- SEO-21: Use JSON-LD generated from the same data that renders the page. Mark up only visible content; never invent reviews, ratings or prices.
- SEO-22: One `@graph` per page with stable `@id`s: `WebSite` and `Organization` or `Person` site-wide, `BreadcrumbList`, then the page type (`Article`, `Product`, `SoftwareApplication`, `Event`, `LocalBusiness`, `Recipe`, `JobPosting`, `VideoObject`) where it fits.
- SEO-23: Only features in Google's current Search Gallery can produce rich results. Google no longer shows FAQ or HowTo rich results, so don't add that markup for Google Search.
- SEO-24: Validate with the Rich Results Test and the Schema Markup Validator.

## Launch
- SEO-25: Before launch: no `noindex` or `Disallow: /` left over from staging, canonicals point to production URLs, old URLs redirect, and every template passes the Rich Results Test.
