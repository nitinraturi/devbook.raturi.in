// Small site behaviours, bundled into one hashed file under /_astro/:
// staleness notice, copy-as-Markdown, copy-prompt, tabs, catalog filter, dismissible banner, consent banner, and
// GA4 events (search, copy_code, outbound_click).
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

// Copy an element's text, such as the bootstrap prompt.
document.querySelectorAll<HTMLButtonElement>('[data-copy-target]').forEach((btn) => {
	const label = btn.querySelector<HTMLElement>('[data-copy-label]') ?? btn;
	const text = label.textContent;
	btn.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(document.getElementById(btn.dataset.copyTarget!)?.textContent ?? '');
			label.textContent = 'Copied. Paste it into your agent';
			gtag('event', 'copy_code', { page_path: location.pathname, item: btn.dataset.copyTarget });
		} catch {
			label.textContent = 'Copy failed: select the text above';
		}
		setTimeout(() => (label.textContent = text), 2500);
	});
});

// Tabs (WAI-ARIA tabs pattern): click or arrow keys select a tab and show its panel.
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((list) => {
	const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
	const select = (tab: HTMLButtonElement) => {
		for (const t of tabs) {
			const on = t === tab;
			t.setAttribute('aria-selected', String(on));
			t.tabIndex = on ? 0 : -1;
			const panel = document.getElementById(t.getAttribute('aria-controls')!);
			if (panel) panel.hidden = !on;
		}
	};
	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => select(tab));
		tab.addEventListener('keydown', (e) => {
			const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
			if (next === undefined) return;
			e.preventDefault();
			const t = tabs[(next + tabs.length) % tabs.length]!;
			select(t);
			t.focus();
		});
	});
});

// Catalog filter: show the sources one kind of agent can install.
document.querySelectorAll<HTMLElement>('[data-catalog-filter]').forEach((filter) => {
	const rows = [...document.querySelectorAll<HTMLElement>('tr[data-hosts]')];
	const count = filter.querySelector<HTMLElement>('[data-filter-count]');
	filter.querySelectorAll<HTMLButtonElement>('button[data-host]').forEach((btn, _, all) =>
		btn.addEventListener('click', () => {
			const host = btn.dataset.host!;
			all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
			let shown = 0;
			for (const row of rows) {
				row.hidden = host !== 'all' && !row.dataset.hosts!.split(' ').includes(host);
				if (!row.hidden) shown++;
			}
			// Hide a group whose rows are all hidden.
			document.querySelectorAll<HTMLElement>('.dvb-catalog-group').forEach((g) => {
				g.hidden = !g.querySelector('tr[data-hosts]:not([hidden])');
			});
			if (count) count.textContent = `${shown} of ${rows.length} sources`;
		}),
	);
});

// Dismissible banner, remembered per visitor.
const BANNER_KEY = 'dvb-banner-dismissed';
document.querySelectorAll<HTMLElement>('[data-banner]').forEach((banner) => {
	try {
		if (localStorage.getItem(BANNER_KEY)) banner.hidden = true;
	} catch {}
	banner.querySelector('[data-banner-dismiss]')?.addEventListener('click', () => {
		banner.hidden = true;
		try {
			localStorage.setItem(BANNER_KEY, '1');
		} catch {}
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
