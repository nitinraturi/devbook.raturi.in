---
title: Accessibility
description: WCAG 2.2 level AA rules for every interface - semantic structure, keyboard use, focus, contrast, text alternatives, motion, forms and testing.
lastVerified: 2026-10-22
sidebar:
  order: 3
---

Target: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA for every page and screen. Accessibility is part of the definition of done, not a later pass.

## Rules

### Structure
- Use semantic elements first (`header`, `nav`, `main`, `footer`, `button`, `a`, lists, tables). Use ARIA only when no native element fits.
- Exactly one `h1`; headings in order without skipping levels for styling.
- `lang` set on the document.
- A skip link to the main content.

### Keyboard and focus
- Everything interactive is reachable and operable by keyboard in a logical order.
- Focus is always visible (a clear outline with enough contrast); never remove it without a replacement.
- Dialogs and sheets trap focus while open, close with Escape, and return focus to the trigger.
- No keyboard traps.

### Visual
- Text contrast at least 4.5:1 (normal) and 3:1 (large text, icons and UI boundaries), checked in every theme.
- Colour is never the only way to convey meaning; add text, icons or patterns.
- Content works at 200% zoom and at 320 CSS px width without horizontal scrolling (except data tables and maps).
- Touch targets at least 24×24 CSS px (WCAG 2.2 AA minimum); aim for 44×44.

### Content
- Every meaningful image has alt text describing its purpose; decorative images have empty alt.
- Video has captions; audio has transcripts.
- Links and buttons say what they do ("Download the report", not "Click here").
- Error messages identify the field and explain how to fix it.

### Forms
- Every input has a visible label tied to it.
- Required fields and formats are stated before submission.
- Do not rely on placeholder text as the label.

### Motion and media
- Respect `prefers-reduced-motion`: no auto-playing animation, parallax or large motion.
- Nothing flashes more than three times per second.
- No auto-playing sound.
- Moving, blinking or auto-updating content can be paused.

### Dynamic content
- Status updates that appear without a page change are announced through a live region.

## Testing
- Automated: axe (or equivalent) in end-to-end tests; zero serious or critical issues.
- Manual per release: keyboard-only pass, screen reader spot check (VoiceOver or NVDA), 200% zoom, reduced motion.

## Checklist
- [ ] Semantic landmarks; one h1
- [ ] Full keyboard use with visible focus
- [ ] Contrast checked in all themes
- [ ] Alt text, labels, captions
- [ ] Reduced motion respected
- [ ] axe clean; manual pass done
