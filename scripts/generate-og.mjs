#!/usr/bin/env node
// Generates public/og-default.png (1200×630) from an inline SVG. Run once after
// changing the design: `node scripts/generate-og.mjs`. Output is committed.
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#17191e"/>
  <rect x="0" y="0" width="16" height="630" fill="#4d8dff"/>
  <g transform="translate(96 120) scale(4)">
    <rect width="32" height="32" rx="7" fill="#1d4ed8"/>
    <path d="M10 8h6.5a8 8 0 0 1 0 16H10z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <path d="M15 13.5l-2.5 2.5 2.5 2.5M18 13.5l2.5 2.5-2.5 2.5" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="96" y="360" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="700" fill="#ffffff">Devbook</text>
  <text x="96" y="430" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#c3c6cc">Rules, templates and prompts for building</text>
  <text x="96" y="480" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#c3c6cc">software with AI coding assistants.</text>
  <text x="96" y="560" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#bcd4ff">devbook.raturi.in</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(new URL('../public/og-default.png', import.meta.url).pathname);
console.log('wrote public/og-default.png');
