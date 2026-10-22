#!/usr/bin/env node
// Checks WCAG 2.x contrast for the accent colours in src/styles/custom.css against
// Starlight's default background and text tokens (copied from Starlight 0.42 props.css).
// Fails (exit 1) if any pair is below 4.5:1 (normal text, AA).
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles/custom.css', import.meta.url), 'utf8');
const block = (selector) => {
	const i = css.indexOf(`${selector} {`);
	const body = css.slice(i, css.indexOf('}', i));
	return Object.fromEntries([...body.matchAll(/--sl-color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
};

const hsl = (h, s, l) => {
	s /= 100;
	l /= 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	};
	return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (rgb) => {
	const [r, g, b] = rgb.map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
};

const dark = block(':root');
const light = block(":root[data-theme='light']");
// Starlight defaults the accent is drawn on.
const D = { bg: hsl(224, 10, 10), nav: hsl(224, 14, 16), text: hsl(224, 6, 77) };
const L = { bg: [255, 255, 255], nav: hsl(224, 19, 97), text: hsl(224, 10, 23) };

const pairs = [
	['dark: link text (accent-high) on page bg', hex(dark['accent-high']), D.bg],
	['dark: link text (accent-high) on sidebar/nav bg', hex(dark['accent-high']), D.nav],
	['dark: current sidebar item (accent-low on accent-high)', hex(dark['accent-low']), hex(dark['accent-high'])],
	['dark: primary button (page bg on accent)', D.bg, hex(dark.accent)],
	['dark: body text on accent-low (asides, badges)', D.text, hex(dark['accent-low'])],
	['light: link text (accent) on page bg', hex(light.accent), L.bg],
	['light: link text (accent) on sidebar/nav bg', hex(light.accent), L.nav],
	['light: current sidebar item (white on accent)', L.bg, hex(light.accent)],
	['light: accent-high on accent-low (asides, badges)', hex(light['accent-high']), hex(light['accent-low'])],
];

let failed = 0;
for (const [name, fg, bg] of pairs) {
	const r = ratio(fg, bg);
	const ok = r >= 4.5;
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  ${name}`);
}
if (failed) {
	console.error(`${failed} contrast pair(s) below 4.5:1`);
	process.exit(1);
}
