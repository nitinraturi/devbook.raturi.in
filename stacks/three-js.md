---
title: three.js
description: three.js notes for fast, accessible 3D on web pages - lazy islands with poster images, pure maths core, allocation-free frame loops and fallbacks.
lastVerified: 2026-10-22
---

- Install three.js from npm, pinned, as ES modules. No CDN script tags.
- Make the 3D view a lazy island. A static poster image is the LCP element; the canvas replaces it after the first frame.
- Use glTF or GLB models with mesh compression and a size budget. Load only the selected variant.
- Keep maths (timing, interpolation, layout) in pure, unit-tested TypeScript with no three.js or DOM imports. Scenes and animations are schema-validated data.
- Allocate nothing per frame. Pause rendering when off-screen or the tab is hidden. Cap the pixel ratio at 2, and lower quality on low-end devices.
- Without WebGL, show the poster and a message. The page text still carries all the information.
- With reduced motion, start paused. Controls are labelled buttons. The canvas has `role="img"` and an `aria-label`.
- Record the licence of every model, texture and font.
