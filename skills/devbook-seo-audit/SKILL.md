---
name: devbook-seo-audit
description: "Audits a built website's technical SEO against Google Search Central: status codes, canonicals, robots, sitemap, titles, descriptions, links, images, structured data. Use when asked for an SEO audit, or if a site is ready for Google or launch."
license: CC-BY-4.0
---

# SEO audit

Audit only; don't change code unless asked.

1. Read `.devbook/instructions/seo.md`.
2. Build the site with the project's build command and serve the output locally, or use the URL the user gives. Audit the built HTML, not the source templates.
3. Fetch `/robots.txt`, the sitemap and a sample of pages: the home page, one page per template, a paginated list and a missing URL. For each, record the status code and the final URL after redirects.
4. Check each page:
   - status codes and soft 404s (SEO-01), redirects and host variants (SEO-08, SEO-09)
   - canonical and `noindex` (SEO-03, SEO-04, SEO-06), sitemap entries (SEO-07)
   - unique `<title>` and meta description, social tags (SEO-11, SEO-12)
   - crawlable `<a href>` links and no orphan pages (SEO-02, SEO-15)
   - image `<img>` alt text (SEO-19)
   - JSON-LD that parses, matches the visible content and uses supported types (SEO-21 to SEO-23)
5. Use the Rich Results Test and Search Console only if the user has access; otherwise list them as manual checks.
6. Report in the shape of [references/report-template.md](references/report-template.md): findings by template with the rule ID, the URL, what is wrong and the fix, most impactful first. List what you checked and found clean.
