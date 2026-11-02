#!/usr/bin/env node
// Checks WCAG 2.x contrast for every text and background pair the theme uses, in both themes,
// reading the OKLCH role tokens from src/styles/custom.css (docs/design-system.md).
// Fails (exit 1) if any pair is below 4.5:1 (normal text, AA).
// `--hex <token>` prints a token's sRGB hex in both themes, for assets such as the logo.
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles/custom.css', import.meta.url), 'utf8');
const block = (selector) => {
	const i = css.indexOf(`${selector} {`);
	if (i === -1) throw new Error(`custom.css: no "${selector}" block`);
	const body = css.slice(i, css.indexOf('}', i));
	return Object.fromEntries(
		[...body.matchAll(/--dvb-([\w-]+):\s*oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)].map((m) => [
			m[1],
			[Number(m[2]), Number(m[3]), Number(m[4])],
		]),
	);
};

// OKLCH to sRGB (0–255), clamped to the gamut, following Björn Ottosson's OKLab definition.
const toRgb = ([l, c, h]) => {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const linear = [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
	];
	return linear.map((v) => {
		const x = Math.min(1, Math.max(0, v));
		return Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055));
	});
};
const lum = (rgb) => {
	const [r, g, b] = rgb.map((v) => {
		v /= 255;
		return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
};
const hex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

const themes = { dark: block(':root'), light: block(":root[data-theme='light']") };

const hexArg = process.argv.indexOf('--hex');
if (hexArg !== -1) {
	const token = process.argv[hexArg + 1];
	for (const [name, t] of Object.entries(themes)) console.log(`${name}: --dvb-${token} = ${hex(toRgb(t[token]))}`);
	process.exit(0);
}

// [foreground, background, where it is used]
const PAIRS = [
	['ink', 'surface', 'body text'],
	['ink-strong', 'surface', 'headings'],
	['ink-muted', 'surface', 'secondary text, footer, index summaries'],
	['ink-muted', 'surface-raised', 'secondary text on raised areas'],
	['ink-muted', 'surface-sunken', 'setup notes'],
	['ink', 'surface-sunken', 'setup intro'],
	['ink', 'surface-raised', 'inline code, buttons'],
	['accent-text', 'surface', 'links, rule IDs, labels'],
	['accent-text', 'surface-raised', 'links in raised areas'],
	['accent-text', 'surface-sunken', 'labels in the setup band'],
	['surface', 'accent', 'primary button text'],
	['ink-strong', 'accent-wash', 'text on accent wash (asides, hover)'],
];

let failed = 0;
for (const [theme, t] of Object.entries(themes)) {
	for (const [fg, bg, use] of PAIRS) {
		if (!t[fg] || !t[bg]) throw new Error(`custom.css: ${theme} theme is missing --dvb-${t[fg] ? bg : fg}`);
		const r = ratio(toRgb(t[fg]), toRgb(t[bg]));
		const ok = r >= 4.5;
		if (!ok) failed++;
		console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  ${theme}: ${fg} on ${bg} (${use})`);
	}
}
if (failed) {
	console.error(`${failed} contrast pair(s) below 4.5:1`);
	process.exit(1);
}
