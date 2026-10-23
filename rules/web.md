---
profile: web
title: Devbook web baseline
description: Mandatory Devbook rules for websites and web apps - design system, accessibility, performance budgets, technical SEO and web security headers.
---

# Devbook web baseline (mandatory for web projects)

Applies alongside the core baseline. The project's look lives in `docs/design-system.md`. These rules apply to every design system.

## Design system
- Define colours, type sizes, spacing, radii, shadows and durations once as tokens (CSS custom properties). Components use tokens, never raw values.
- Light and dark themes are token sets. Check both for contrast.
- Components use semantic tokens (`--accent`, `--danger`), not literal ones (`--blue-500`).
- Content first. Use one accent colour, with intent. Design mobile first at 360–400 px.
- Honest UI: label illustrations and estimates. Never imitate live data, system dialogs or official seals.
- Every component documents its states: default, hover, focus-visible, active, disabled, loading, error, empty.
- Layout uses flex or grid with `gap`. No fixed heights on text containers.
- Buttons say what happens. Errors say what went wrong and what to do next. No hype or exclamation marks.
- Transitions are about 200 ms or less and never shift layout. `prefers-reduced-motion` disables non-essential motion.
- No dark patterns, fake social proof, carousels for core content, unnecessary modals or auto-playing sound.

## Accessibility (WCAG 2.2 AA)
- Use semantic elements first, and ARIA only when no native element fits. One `h1`, headings in order, `lang` set, a skip link.
- Everything interactive works by keyboard in a logical order with visible focus. Dialogs trap focus, close with Escape and return focus.
- Text contrast is at least 4.5:1, and 3:1 for large text, icons and UI boundaries, in every theme. Colour is never the only signal.
- Pages work at 200% zoom and at 320 px width without horizontal scrolling. Touch targets are at least 24×24 px; aim for 44×44.
- Meaningful images have alt text; decorative images have empty alt. Every input has a visible label. Error messages name the field.
- Announce status updates through a live region. Nothing flashes more than three times per second.
- e2e tests run axe with zero serious or critical issues.

## Performance
- Set budgets before building and enforce them in CI. Loosening a budget needs an ADR.
- Defaults (mobile, throttled):
  - LCP ≤ 2.0 s for content sites, ≤ 2.5 s for apps.
  - CLS ≤ 0.05 for content sites, ≤ 0.1 for apps.
  - JS: ≤ 20 KB gzip for content sites without islands; ≤ 170 KB for the initial route of an app.
- Render HTML on the server or at build time. Ship JavaScript only for interactive parts.
- The LCP element is in the initial HTML with `fetchpriority="high"` and is never lazy-loaded.
- Set `width` and `height` (or `aspect-ratio`) on every image, video and embed. Use modern formats and `srcset`.
- Self-host and subset fonts with `font-display: swap`. Every third-party script needs a written reason.

## Technical SEO (public pages)
- Public content is in server-rendered or pre-rendered HTML and readable without JavaScript.
- URLs are lowercase, hyphenated and stable. A changed URL 301-redirects from the old one.
- One absolute, self-referencing canonical per indexable page. Previews, staging, internal search and thin tag pages are `noindex`.
- Each page has a unique title (about 50–60 characters), a unique meta description (about 120–160 characters) and one H1.
- `robots.txt` points to a sitemap that lists only canonical, indexable URLs.

## Web security
- HTTPS everywhere with HSTS.
- Set a CSP without `'unsafe-inline'` or `'unsafe-eval'` for scripts.
- Also set `nosniff`, `Referrer-Policy`, a restrictive `Permissions-Policy`, and `frame-ancestors`.
- Session cookies are `Secure`, `HttpOnly` and `SameSite`. Every state-changing request has CSRF protection.
- CORS allows only named origins, never `*` with credentials.
- Load libraries from your own bundle. If a CDN is unavoidable, pin the version and use Subresource Integrity.
- Previews never use production data or analytics IDs.

## Definition of done (UI work)
- Works at about 360 px and 1440 px widths, in light and dark themes, by keyboard only, and with reduced motion.
- No new console errors or warnings. Accessibility and performance budgets hold.

## Detail
- UI and design systems: `{{devbook}}/src/content/docs/web/ui-and-design-systems.md`
- Accessibility: `{{devbook}}/src/content/docs/quality/accessibility.md`
- Performance budgets: `{{devbook}}/src/content/docs/quality/performance-budgets.md`
- Technical SEO: `{{devbook}}/src/content/docs/web/technical-seo.md`
- Security baseline: `{{devbook}}/src/content/docs/security/security-baseline.md`
