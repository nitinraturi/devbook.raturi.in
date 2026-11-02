# SEO audit report

Use this shape. Group findings by template, most impactful first.

## Findings

### Blog post template (`/blog/<slug>/`)

- **SEO-03** · `/blog/hello-lumen/` · The canonical is `http://localhost:4321/blog/hello-lumen/`, so Google may index the wrong host. **Fix:** set `site` to the production URL so canonicals are absolute production URLs.

## Checked and clean

Status codes (SEO-01), robots.txt (SEO-04), sitemap (SEO-07), …

## Manual checks

Rich Results Test and Search Console, when you have no access to them.
