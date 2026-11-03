# Design system

**Status:** approved by Nitin Raturi, 2026-11-02 · decision record: ADR-0006

The site stays on Starlight (ADR-0001) and is themed through tokens in `src/styles/custom.css`. Every later choice traces back to this direction.

## Direction

- **Audience:** developers and tech leads connecting AI assistants to real repositories. They arrive to copy the setup prompt, look up a rule by its ID, or check what changed, often with an editor open beside the browser.
- **Tone:** exact, plain, durable.
- **Reference from outside software:** printed engineering standards and building codes. Clause numbers sit in the margin, thin ruled lines separate sections, the ink is quiet, and one marker colour flags amendments.
- **Signature element:** small monospaced labels in the accent colour: section eyebrows, step numbers and tier labels on the homepage, and file names and dates elsewhere.

## Type

- The system sans (Starlight's stack) for text and headings, and IBM Plex Mono for labels, dates and code (SIL Open Font License 1.1). The mono face carries the technical-manual voice.
- Plex Mono is self-hosted WOFF2 from `@fontsource/ibm-plex-mono` (pinned), Latin subset, regular only, `font-display: swap`, preloaded: one file of about 15 KB.
- IBM Plex Sans was the approved text face, but it pushed the setup page's mobile LCP to about 2,105 ms against the 2,000 ms budget. On 2026-11-02 the maintainer chose Plex Mono only over raising the budget; see ADR-0006 for the measurements.
- Modular scale 1.2, fluid with `clamp()`; body 17 px, line height 1.6; headings 1.15 with tighter tracking at large sizes.

## Colour

Built in OKLCH and named by role. Neutrals are tinted slightly toward the accent hue. The accent marks links, the current page, focus, the primary button and the signature labels only. The values live once, in `src/styles/custom.css`; Starlight's `--sl-color-*` tokens are mapped to these roles there.

| Role | Used for |
|---|---|
| `--dvb-surface` | Page, header and sidebar background: warm paper (light), graphite (dark) |
| `--dvb-surface-raised` | Inline code, buttons, tab bar, consent banner |
| `--dvb-surface-sunken` | The setup band on the homepage |
| `--dvb-ink-strong`, `--dvb-ink`, `--dvb-ink-muted`, `--dvb-ink-faint` | Headings, body text, secondary text, decorative text only |
| `--dvb-rule` | Ruled lines between rules, index rows and sections |
| `--dvb-accent` | Vermilion marker: primary button, focus ring, current-page bar |
| `--dvb-accent-text` | Accent as text: links, labels, dates |
| `--dvb-accent-wash` | Quiet accent background for hover |

`npm run contrast` converts every token to sRGB and checks each text pair in both themes against WCAG AA (4.5:1); `node scripts/check-contrast.mjs --hex <role>` prints a role's hex value for assets such as the logo and the social image.

## Other tokens

Spacing on an 8 px scale (`--dvb-space-*`), two radii (`--dvb-radius-sm`, `--dvb-radius`), one shadow for the floating consent banner (`--dvb-shadow`) and one transition duration (`--dvb-duration`, 180 ms, ease-out, off under `prefers-reduced-motion`).

## Layout

- Remove the gradient hero box and the rounded, shadowed cards. Separate sections with spacing, a background shift and thin rules.
- Homepage: a left-aligned opening with the setup prompt directly below it, then the instructions as a ruled index (ID prefix, name, when it loads) instead of 13 identical cards, then the history timeline.
- Reading width stays about 70 characters. Checked at 360 px and 1440 px, light and dark, by keyboard, with axe on every template.
