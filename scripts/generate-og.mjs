#!/usr/bin/env node
// Generates public/og-default.png (1200×630) from an inline SVG. The text is the site
// description in astro.config.mjs. Run `npm run og:image` after changing either; the
// output is committed.
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#181513"/>
  <rect x="0" y="0" width="16" height="630" fill="#f18154"/>
  <g transform="translate(96 120) scale(4)">
    <rect width="32" height="32" rx="7" fill="#b63613"/>
    <path d="M10 8h6.5a8 8 0 0 1 0 16H10z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <path d="M15 13.5l-2.5 2.5 2.5 2.5M18 13.5l2.5 2.5-2.5 2.5" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="96" y="340" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="700" fill="#f5f1ee">Devbook</text>
  <text x="96" y="410" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#dcd6d2">A few short instruction files that make Claude and</text>
  <text x="96" y="458" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#dcd6d2">Copilot build like a senior engineer: workflow,</text>
  <text x="96" y="506" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#dcd6d2">engineering, security, design, SEO and content.</text>
  <text x="96" y="572" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#f8a87e">devbook.raturi.in</text>
</svg>`;

await sharp(Buffer.from(svg))
	.png({ compressionLevel: 9 })
	.toFile(new URL('../public/og-default.png', import.meta.url).pathname);
console.log('wrote public/og-default.png');
