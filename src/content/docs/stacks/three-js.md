---
title: three.js and WebGL
description: Rules for 3D on the web - lazy islands with a poster, pure maths apart from rendering, allocation-free frame loops, low-end mode and accessibility.
sidebar:
  order: 8
---

For interactive 3D (product viewers, demos, visualisations) inside an otherwise fast page.

## Rules

### Loading
- three.js from npm, pinned, imported as ES modules; no CDN script tags.
- The 3D view is a **lazy island**: the page renders a static poster image (pre-rendered at build) as the LCP element; the canvas replaces it only after the first frame is ready.
- Load model data only for the selected variant; prefetch others on idle.
- Models as glTF/GLB with mesh compression (for example meshopt or Draco); set a per-asset size budget.

### Architecture
- Maths (IK, interpolation, timing, layout) is **pure TypeScript** with no three.js or DOM imports, unit-tested.
- The renderer module only uploads transforms and draws.
- Animation and scene descriptions are **data** (JSON validated by a schema), so new content needs no engine changes.

### Frame loop
- Allocation-free: reuse vectors, matrices and typed arrays; no object creation per frame.
- Stop rendering when off-screen (IntersectionObserver) or when the tab is hidden.
- Cap device pixel ratio at 2; drop to 1–1.5, disable shadows and environment maps on low-end devices (few cores or `saveData`).
- Prefer GPU skinning and morph targets over CPU updates.

### Fallbacks
- Detect missing WebGL and show the poster plus a one-line message; the page's text content still teaches everything.

### Accessibility
- `prefers-reduced-motion` starts paused at the most informative frame.
- All controls are real buttons with labels; keyboard operable.
- The canvas has a text alternative (`role="img"` + `aria-label`) and the same information exists in page text.
- Never convey meaning by colour alone; label highlighted regions.
- Any illustrative visualisation is labelled as illustrative.

### Licensing
- Record the licence of every model, texture and font in the repo.

## Checklist
- [ ] Poster as LCP; canvas lazy
- [ ] Pure maths module with tests
- [ ] Allocation-free loop; pauses off-screen
- [ ] DPR cap and low-end mode
- [ ] WebGL fallback; reduced-motion; text alternative
