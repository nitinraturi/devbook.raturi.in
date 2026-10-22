---
title: Website launch
description: Launch checklist for a public website covering SEO, structured data, content quality, performance, accessibility, security headers, privacy, analytics and search console.
sidebar:
  order: 3
---

## Content
- [ ] Every page answers a real question; no thin, duplicate or placeholder pages
- [ ] Facts checked by a human against sources; no "To verify" sources behind published claims
- [ ] Author byline, author page, visible dates
- [ ] About, contact, privacy, editorial policy (and disclaimers for health, money or legal topics)
- [ ] No invented reviews, testimonials, credentials or statistics

## SEO
- [ ] Unique title (≈50–60 chars) and description (≈120–160 chars) per page
- [ ] One H1 per page; logical headings
- [ ] Absolute self-canonical on every indexable page; redirects for old URLs
- [ ] `noindex` on search, thin tags, previews, staging
- [ ] XML sitemap with only canonical URLs; `robots.txt` points to it
- [ ] Open Graph and Twitter tags; OG images render
- [ ] JSON-LD validated; only visible content; no HowTo/FAQ/SearchAction
- [ ] No orphan pages; ≥ 3 contextual internal links on content pages
- [ ] 404 page with search and helpful links

## Performance and accessibility
- [ ] Lighthouse mobile within budgets on representative pages
- [ ] LCP element in HTML with dimensions; no layout shift from images or fonts
- [ ] axe clean; keyboard-only pass; screen reader spot check; 200% zoom; reduced motion

## Security and privacy
- [ ] HTTPS, HSTS, CSP without unsafe-inline scripts, other security headers
- [ ] No secrets in the client bundle
- [ ] Analytics production-only; consent where required; no personal data in events
- [ ] Privacy notice matches what is actually collected

## Discovery
- [ ] Google Search Console and Bing Webmaster Tools verified; sitemap submitted
- [ ] Analytics receiving data; key events defined
- [ ] Uptime check on home and a key page
