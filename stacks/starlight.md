---
title: Starlight
description: Starlight stack notes for documentation sites - content layout, frontmatter, sidebar, components, overrides and plugins. Verify against current Starlight docs.
lastVerified: 2026-10-22
---

Check the current Starlight docs for exact APIs.

- Pages live in `src/content/docs/`; the path is the URL. Every page has a `title` and a 120–160 character `description`.
- Add custom frontmatter by extending `docsSchema({ extend: ... })`, not with ad-hoc fields.
- Use Starlight components (`Aside`, `Tabs`, `Steps`, `Card`, `LinkCard`, `Code`) instead of custom HTML. Show file contents with a `?raw` import and `<Code>`.
- Sidebar groups use `{ label, items: [{ autogenerate: { directory } }] }`, ordered with `sidebar.order`. Keep them two levels deep at most.
- Theme with CSS custom properties in `customCss`. Change behaviour through component overrides that wrap the default component.
- Use `starlight-links-validator` to fail on broken links. Add other plugins only with a written reason.
- Set `site`, and add JSON-LD through a `Head` override.
