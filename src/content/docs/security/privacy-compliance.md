---
title: Privacy and compliance
description: Data minimisation, consent, cookies and analytics, retention, user rights and breach handling, with pointers for India's DPDP Act and the EU GDPR.
lastVerified: 2026-10-22
sidebar:
  order: 4
---

This page is engineering guidance, not legal advice. For anything beyond a simple site, have the privacy notice and processing reviewed by a qualified professional.

## Rules

### Collect less
- Collect only the personal data a feature needs; write the purpose next to each field in the spec.
- Prefer aggregate or anonymous analytics. Do not send personal data (names, emails, phone numbers, IDs) in analytics events or URLs.

### Consent and notice
- A plain-language privacy notice explains what is collected, why, for how long, who processes it, and how to exercise rights.
- Where consent is the legal basis (for example non-essential cookies or analytics in the EU/UK), ask before collecting, make declining as easy as accepting, and remember the choice.
- Load non-essential trackers only after consent where consent is required.

### Retention and deletion
- Each personal-data store has a retention period and an automated deletion or anonymisation job.
- Users can request access, correction and deletion; there is a documented process that covers backups and third-party processors.

### Processors
- List every third party that receives personal data (hosting, email, analytics, payments, LLM providers) and keep the list current.

### Security of personal data
- Encrypt in transit and at rest; restrict access by role; log access to sensitive data.
- Have a written breach response: who decides, who is notified, within what time.

### Children
- If the product may be used by people under 18, apply the stricter rules your jurisdictions require (for example verifiable parental consent) before launch.

## Jurisdiction pointers (verify current status before relying on these)

- **India — Digital Personal Data Protection Act, 2023 (DPDP).** Consent-based processing with notice, purpose limitation, rights to access, correction and erasure, breach reporting, and extra obligations for children's data. Implementing rules were notified with phased timelines; check the current official text from MeitY before launch.
- **EU / UK — GDPR / UK GDPR.** Lawful basis for each purpose, consent for non-essential cookies under ePrivacy rules, data subject rights, records of processing, and breach notification within 72 hours to the regulator where required.
- **Other regions:** check the laws where your users are, not only where you are.

## Checklist
- [ ] Purpose written for each personal-data field
- [ ] Privacy notice published and linked in the footer
- [ ] Consent before non-essential tracking where required
- [ ] Retention periods and deletion jobs
- [ ] Processor list current
- [ ] Breach response written
