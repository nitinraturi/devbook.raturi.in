---
title: GA4 and consent
description: Google Analytics 4 notes - production-only loading, Consent Mode v2 defaults, consent banner, events without personal data and SPA page views.
lastVerified: 2026-10-22
---

Check Google's current Consent Mode docs before implementing.

- Load GA4 only in production builds that have a measurement ID, after the main content. Add GA hosts to the CSP.
- Set Consent Mode v2 defaults before `config`. Deny all storage where consent is required (EEA, UK, Switzerland). Elsewhere, deny ads signals.
- Show the banner where consent is required, with "Accept" and "Decline" equally prominent and no pre-ticked boxes. Store the choice, and add a footer link to change it.
- Event names are `snake_case`. Prefer GA4's recommended events, and mark only real successes as key events.
- Strip personal data from events and page URLs before sending, for example by removing email or token query parameters.
- With client-side navigation, set `send_page_view: false` and send `page_view` on each navigation, or GA4 counts only the first page.
- Set data retention deliberately and state it in the privacy notice.
