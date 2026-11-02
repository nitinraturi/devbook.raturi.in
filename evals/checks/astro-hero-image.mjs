// The homepage shows /hero.jpg with non-empty alt text and explicit dimensions (or Astro's <Image>, which sets them).
import { join } from 'node:path';
import { fail, pass, readText } from '../lib.mjs';

export default async function astroHeroImage({ dir }) {
	const page = (await readText(join(dir, 'src/pages/index.astro'))) ?? '';
	const tags = page.match(/<(img|Image|Picture)\b[^>]*>/gs) ?? [];
	const hero = tags.find((t) => /hero/i.test(t)) ?? (tags.length === 1 ? tags[0] : undefined);
	if (!hero) return fail('no hero image on the homepage');
	if (!/\balt=(["'])\s*[^"'\s][^"']*\1|\balt=\{/.test(hero)) return fail(`no alt text: ${hero}`);
	if (/^<img/.test(hero) && !(/\bwidth=/.test(hero) && /\bheight=/.test(hero))) return fail(`no width/height: ${hero}`);
	return pass(hero.replace(/\s+/g, ' '));
}
