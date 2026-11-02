// Small site behaviours, bundled into one hashed file under /_astro/:
// staleness notice, copy-as-Markdown, consent banner, and GA4 events (search, copy_code, outbound_click).
// All analytics calls are no-ops when GA is not loaded.

type Gtag = (...args: unknown[]) => void;
const gtag = (...args: unknown[]) => (window as unknown as { gtag?: Gtag }).gtag?.(...args);
const KEY = 'dvb-consent';

// Staleness notice: decided at view time, because the site is only rebuilt on deploy.
document.querySelectorAll<HTMLElement>('[data-stale-notice]').forEach((el) => {
	const verified = Date.parse(el.dataset.verified ?? '');
	const days = Number(el.dataset.staleDays);
	if (!Number.isNaN(verified) && days > 0) el.hidden = Date.now() - verified <= days * 864e5;
});

// Copy page as Markdown.
document.querySelectorAll<HTMLButtonElement>('[data-copy-md]').forEach((btn) => {
	btn.addEventListener('click', async () => {
		const label = btn.textContent;
		try {
			const res = await fetch(btn.dataset.copyMd!);
			if (!res.ok) throw new Error(String(res.status));
			await navigator.clipboard.writeText(await res.text());
			btn.textContent = 'Copied';
		} catch {
			btn.textContent = 'Copy failed';
		}
		setTimeout(() => (btn.textContent = label), 2000);
	});
});

// Consent banner: shown where consent is required. A static site cannot read the
// visitor's country, so the timezone is used as the approximation: Europe/*, plus the
// IANA Atlantic/* zones in EEA countries (Canary Islands, Madeira, Azores, Iceland).
const EEA_ATLANTIC = new Set(['Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores', 'Atlantic/Reykjavik']);
const banner = document.querySelector<HTMLElement>('[data-consent]');
if (banner) {
	let stored: string | null = null;
	try {
		stored = localStorage.getItem(KEY);
	} catch {}
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
	if (!stored && (tz.startsWith('Europe/') || EEA_ATLANTIC.has(tz))) banner.hidden = false;
	banner.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((b) =>
		b.addEventListener('click', () => {
			const choice = b.dataset.consentChoice!;
			try {
				localStorage.setItem(KEY, choice);
			} catch {}
			gtag('consent', 'update', { analytics_storage: choice });
			banner.hidden = true;
		}),
	);
	document.querySelector('[data-consent-open]')?.addEventListener('click', () => {
		banner.hidden = false;
		banner.querySelector('button')?.focus();
	});
}

// GA4 events. Debounced Pagefind search query (no personal data expected in a docs search).
let searchTimer: ReturnType<typeof setTimeout> | undefined;
document.addEventListener('input', (e) => {
	const el = e.target as HTMLElement;
	if (!(el instanceof HTMLInputElement) || !el.closest('site-search')) return;
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		const q = el.value.trim();
		if (q.length >= 3) gtag('event', 'search', { search_term: q.slice(0, 100) });
	}, 1500);
});

document.addEventListener('click', (e) => {
	const target = e.target as HTMLElement;
	// Expressive Code copy button.
	if (target.closest('.expressive-code .copy button')) gtag('event', 'copy_code', { page_path: location.pathname });
	const a = target.closest<HTMLAnchorElement>('a[href]');
	if (a && a.host && a.host !== location.host) gtag('event', 'outbound_click', { link_domain: a.hostname });
});
