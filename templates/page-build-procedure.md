# Page Build Procedure (source doc → published page)

Follow the steps in order. Each step lists inputs, outputs and the check that must pass before moving on. An AI agent reports the result of each check.

**Precondition:** the source doc `<path>/<slug>.md` exists with `status: reviewed`. If not, stop.

---

## Step 1 — Load context
Read: the source doc, its parent/family doc, related docs, the content standards and any domain rules.
**Check:** list contradictions between the doc and related docs. If any, stop and fix the docs first.

## Step 2 — Register sources
Confirm every source ID in the doc exists in the sources registry with a publishable status.
**Check:** zero "To verify" sources behind claims that will appear on the page.

## Step 3 — Create the content entry
Create `<content path>/<slug>.<ext>` with frontmatter from the doc plus `sourceDoc`, `sourceVersion`, SEO title and description. Relationship fields include only items that already have published pages.
**Check:** schema validation passes; body length within the project's range; voice matches the content standards.

## Step 4 — Assets
Create or render images, diagrams, posters and the Open Graph image.
**Check:** alt text describes each image; dimensions set; budgets met.

## Step 5 — Relationships and taxonomy
Confirm the page appears in its hub, categories and related lists; reciprocal links updated.
**Check:** content check reports no missing reciprocals and no orphans.

## Step 6 — Internal links
Add contextual links (first mention only) to the hub, related items and relevant guides.
**Check:** ≥ 3 contextual internal links; link checker passes.

## Step 7 — SEO and structured data
Title, description, canonical, Open Graph, JSON-LD (only visible content), visible dates and author/reviewer.
**Check:** Rich Results Test and Schema validator pass on the preview URL.

## Step 8 — Quality gates
- [ ] Lint, types, tests, content check, build, link check
- [ ] e2e for the page; axe: no serious/critical issues
- [ ] Lighthouse mobile within budgets
- [ ] Screenshots at small and large widths, light and dark
- [ ] Fact audit: pick 5 random sentences; trace each to the source doc and a source

## Step 9 — Publish
Set `status: published`; open a PR with the checklists; add a changelog entry.

## Step 10 — Maintain
When the source doc changes: bump its version → update `sourceVersion` → rerun Steps 3–8 for affected parts. Material changes get a visible "Updated" note.
