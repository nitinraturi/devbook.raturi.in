---
title: GA4 and consent
description: Google Analytics 4 with Consent Mode v2 - production-only loading, region-based defaults, a minimal consent banner, event naming, view transitions and privacy rules.
lastVerified: 2026-10-22
sidebar:
  order: 6
---

Check Google's current Consent Mode documentation before implementing; parameters and regional requirements change.

## Rules

### Loading
- Load GA4 only in production builds with a measurement ID: `import.meta.env.PROD && PUBLIC_GA_ID` (or the stack's equivalent). Local and preview builds send nothing.
- Load after the main content; never block rendering.
- Add GA hosts to the CSP (`script-src`, `connect-src`, `img-src`).

### Consent Mode v2 defaults
```html
<script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
<script is:inline define:vars={{ GA_ID }}>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  // Denied by default where consent is required (EEA, UK, CH)
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']
  });
  // Elsewhere: analytics only, no ads signals
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_ID);
</script>
```
- Review the regional default against your own legal advice and the laws where your users are (including India's DPDP; see [privacy](/security/privacy-compliance/)).

### Banner
- Shown where consent is required. "Accept analytics" and "Decline" are equally prominent. No pre-ticked boxes.
- On accept: `gtag('consent', 'update', { analytics_storage: 'granted' })`; store the choice; offer a way to change it (footer link).
- Static sites cannot read the visitor's country header; a timezone check (`Europe/*`) is a pragmatic approximation. Document the approach in the privacy notice.

### Events
- Names in `snake_case`; at most a handful of parameters each; use GA4 recommended event names where one exists (`search`, `sign_up`, `purchase`).
- **MUST NOT** send personal data (names, emails, phone numbers, user IDs that identify a person) in events or page URLs.
- Mark only the few events that represent real success as key events.

### View transitions / SPAs
- With client-side navigation, set `send_page_view: false` and send `page_view` on each navigation event (for Astro: `astro:page-load`) to avoid double or missing counts.

### Settings
- Data retention set deliberately (for example 14 months) and stated in the privacy notice.
- Separate data streams or properties for each site, or one property with a hostname dimension; decide once and record it.

## Checklist
- [ ] Production only; previews untracked
- [ ] Consent defaults and banner where required
- [ ] CSP updated
- [ ] No personal data in events or URLs
- [ ] Page views correct with client-side navigation
- [ ] Privacy notice describes GA4 use
