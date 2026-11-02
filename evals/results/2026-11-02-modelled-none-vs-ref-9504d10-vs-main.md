# Devbook eval results: 2026-11-02 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| none | modelled | 66 | 0% | 0% | 0% | 126 | $0.000 |
| ref:9504d10 @ 9504d10 | modelled | 66 | 68% | 90% | 90% | 10,073 | $0.000 |
| main @ 8b5199c | modelled | 66 | 86% | 75% | 92% | 5,177 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against none.

| Task | none | ref:9504d10 (Δ tokens) | main (Δ tokens) |
|---|---|---|---|
| android-api-key | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) |
| android-camera-permission | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,318 (+4,190) |
| android-delete-button | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,274 (+5,146) |
| android-icon-font | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,548 (+4,420) |
| android-offline-notes | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,844 (+5,716) |
| android-save-token | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) |
| android-setup | 0% 0/1, 128 | 0% 0/1, 128 (+0) | 100% 1/1, 1,601 (+1,473) |
| astro-add-helper | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) |
| astro-add-license | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) |
| astro-blog-announcement | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,454 (+4,336) |
| astro-branch-security-check | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,894 (+3,776) |
| astro-button-focus | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-cache-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,143 (+4,025) |
| astro-contact-form-fields | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-copied-snippet | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) |
| astro-csp-footer-year | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-devbook-up-to-date | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,080 (+3,962) |
| astro-fix-failing-test | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) |
| astro-hero-image | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,027 (+6,909) |
| astro-launch-google | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 5,165 (+5,047) |
| astro-meta-description | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-missing-analytics-id | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-moved-url | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-new-post-meta | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) |
| astro-not-found | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-reading-time | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) |
| astro-ready-to-ship | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,795 (+3,677) |
| astro-reduced-motion | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) |
| astro-scheduled-posts | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 0% 0/1, 5,311 (+5,193) |
| astro-secret-key | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) |
| astro-security-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) |
| astro-self-host-font | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,323 (+7,205) |
| astro-seo-audit | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 6,690 (+6,572) |
| astro-setup | 0% 0/1, 118 | 0% 0/1, 118 (+0) | 100% 1/1, 1,591 (+1,473) |
| astro-sitemap | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 5,165 (+5,047) |
| astro-subscribe-endpoint | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,868 (+4,750) |
| astro-testimonials | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) |
| astro-typo-no-commit | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) |
| astro-view-transitions | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 8,267 (+8,149) |
| django-bump-version | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,558 (+3,424) |
| django-cors | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) |
| django-crud-no-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 6,345 (+6,211) |
| django-delete-note | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,220 (+5,086) |
| django-error-format | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,220 (+5,086) |
| django-fix-failing-test | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) |
| django-list-all | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) |
| django-missing-attachment | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) |
| django-note-price | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 6,693 (+6,559) |
| django-note-str | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) |
| django-patch-title | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,220 (+5,086) |
| django-pinned-field | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 6,978 (+6,844) |
| django-production-settings | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) |
| django-rate-limit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) |
| django-rename-url-no-commit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) |
| django-search | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,575 (+5,441) |
| django-security-review | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,504 (+5,370) |
| django-session-cookies | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,558 (+3,424) |
| django-setup | 0% 0/1, 134 | 0% 0/1, 134 (+0) | 100% 1/1, 1,607 (+1,473) |
| django-sharing-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,888 (+5,754) |
| django-ship-failing | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) |
| django-split-body | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,031 (+4,897) |
| django-unique-slug | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 6,693 (+6,559) |
| django-update-devbook | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 4,127 (+3,993) |
| django-upgrade-django | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) |
| django-validation-not-review | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) |
| django-weekly-query | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 6,693 (+6,559) |

## Worse than another variant

- android-setup: ref:9504d10 0% vs main 100%
- astro-add-license: ref:9504d10 0% vs main 100%
- astro-branch-security-check: ref:9504d10 0% vs main 100%
- astro-devbook-up-to-date: ref:9504d10 0% vs main 100%
- astro-launch-google: ref:9504d10 0% vs main 100%
- astro-ready-to-ship: ref:9504d10 0% vs main 100%
- astro-seo-audit: ref:9504d10 0% vs main 100%
- astro-setup: ref:9504d10 0% vs main 100%
- django-crud-no-feature-doc: ref:9504d10 0% vs main 100%
- django-setup: ref:9504d10 0% vs main 100%
- django-ship-failing: ref:9504d10 0% vs main 100%
- django-update-devbook: ref:9504d10 0% vs main 100%

## Failures

- android-api-key · none: rules-visible: not in context or reachable: MOB-01, SEC-03
- android-camera-permission · none: rules-visible: not in context or reachable: MOB-05
- android-delete-button · none: rules-visible: not in context or reachable: MOB-04, DES-29
- android-icon-font · none: rules-visible: not in context or reachable: LIC-02, LIC-11
- android-offline-notes · none: rules-visible: not in context or reachable: MOB-03, DES-21
- android-save-token · none: rules-visible: not in context or reachable: MOB-01
- android-setup · none: skill-trigger: expected devbook-setup, model loads none
- astro-add-helper · none: rules-visible: not in context or reachable: TEST-01, CORE-01
- astro-add-license · none: rules-visible: not in context or reachable: LIC-01
- astro-blog-announcement · none: rules-visible: not in context or reachable: CONT-01, CONT-03, CONT-06
- astro-branch-security-check · none: rules-visible: not in context or reachable: SEC-05; skill-trigger: expected devbook-security-review, model loads none
- astro-button-focus · none: rules-visible: not in context or reachable: DES-20, DES-27, DES-18
- astro-cache-headers · none: rules-visible: not in context or reachable: PERF-12
- astro-contact-form-fields · none: rules-visible: not in context or reachable: DES-22, DES-23
- astro-copied-snippet · none: rules-visible: not in context or reachable: LIC-03, LIC-14
- astro-csp-footer-year · none: rules-visible: not in context or reachable: SEC-05
- astro-devbook-up-to-date · none: skill-trigger: expected devbook-upgrade, model loads none
- astro-fix-failing-test · none: rules-visible: not in context or reachable: CORE-02, TEST-02
- astro-hero-image · none: rules-visible: not in context or reachable: PERF-05, PERF-06, SEO-19
- astro-launch-google · none: rules-visible: not in context or reachable: SEO-25, SEO-04; skill-trigger: expected devbook-seo-audit, model loads none
- astro-meta-description · none: rules-visible: not in context or reachable: SEO-11
- astro-missing-analytics-id · none: rules-visible: not in context or reachable: CORE-04, CORE-03
- astro-moved-url · none: rules-visible: not in context or reachable: SEO-09, SEO-08
- astro-new-post-meta · none: rules-visible: not in context or reachable: SEO-11, SEO-15, CONT-01
- astro-not-found · none: rules-visible: not in context or reachable: SEO-01
- astro-reading-time · none: rules-visible: not in context or reachable: CORE-04, SEC-04
- astro-ready-to-ship · none: rules-visible: not in context or reachable: CORE-01, CORE-05; skill-trigger: expected devbook-release-check, model loads none
- astro-reduced-motion · none: rules-visible: not in context or reachable: DES-25, DES-26
- astro-scheduled-posts · none: rules-visible: not in context or reachable: FEAT-04, FEAT-12; skill-trigger: expected devbook-feature-doc, model loads none
- astro-secret-key · none: rules-visible: not in context or reachable: SEC-03
- astro-security-headers · none: rules-visible: not in context or reachable: SEC-18, SEC-05
- astro-self-host-font · none: rules-visible: not in context or reachable: PERF-07, SEC-19, DES-11
- astro-seo-audit · none: rules-visible: not in context or reachable: SEO-11, SEO-03; skill-trigger: expected devbook-seo-audit, model loads none
- astro-setup · none: skill-trigger: expected devbook-setup, model loads none
- astro-sitemap · none: rules-visible: not in context or reachable: SEO-07, SEC-04
- astro-subscribe-endpoint · none: rules-visible: not in context or reachable: SEC-02, SEC-11
- astro-testimonials · none: rules-visible: not in context or reachable: CONT-01, DES-06
- astro-typo-no-commit · none: rules-visible: not in context or reachable: CORE-05
- astro-view-transitions · none: rules-visible: not in context or reachable: PERF-03, DES-19, DES-31
- django-bump-version · none: rules-visible: not in context or reachable: CORE-18
- django-cors · none: rules-visible: not in context or reachable: SEC-10, SEC-04
- django-crud-no-feature-doc · none: rules-visible: not in context or reachable: FEAT-05; skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · none: rules-visible: not in context or reachable: API-12, API-14, TEST-01; skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · none: rules-visible: not in context or reachable: API-02, API-13; skill-trigger: expected devbook-api-endpoint, model loads none
- django-fix-failing-test · none: rules-visible: not in context or reachable: CORE-02, TEST-02
- django-list-all · none: rules-visible: not in context or reachable: API-03, API-17
- django-missing-attachment · none: rules-visible: not in context or reachable: CORE-04, CORE-03
- django-note-price · none: rules-visible: not in context or reachable: DB-11, API-18; skill-trigger: expected devbook-db-migration, model loads none
- django-note-str · none: rules-visible: not in context or reachable: CORE-17
- django-patch-title · none: rules-visible: not in context or reachable: SEC-02, API-05, API-12; skill-trigger: expected devbook-api-endpoint, model loads none
- django-pinned-field · none: rules-visible: not in context or reachable: DB-03
- django-production-settings · none: rules-visible: not in context or reachable: SEC-03
- django-rate-limit · none: rules-visible: not in context or reachable: SEC-11, SEC-04
- django-rename-url-no-commit · none: rules-visible: not in context or reachable: CORE-05
- django-search · none: rules-visible: not in context or reachable: TEST-01, CORE-01, PERF-10
- django-security-review · none: rules-visible: not in context or reachable: SEC-06, SEC-03, SEC-01; skill-trigger: expected devbook-security-review, model loads none
- django-session-cookies · none: rules-visible: not in context or reachable: SEC-16, SEC-09, SEC-13
- django-setup · none: skill-trigger: expected devbook-setup, model loads none
- django-sharing-feature-doc · none: rules-visible: not in context or reachable: FEAT-04, FEAT-17, FEAT-12, FEAT-08; skill-trigger: expected devbook-feature-doc, model loads none
- django-ship-failing · none: rules-visible: not in context or reachable: CORE-01, CORE-02, CORE-05; skill-trigger: expected devbook-release-check, model loads none
- django-split-body · none: rules-visible: not in context or reachable: CORE-06, DB-04, DB-31; skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · none: rules-visible: not in context or reachable: DB-17, DB-02; skill-trigger: expected devbook-db-migration, model loads none
- django-update-devbook · none: skill-trigger: expected devbook-upgrade, model loads none
- django-upgrade-django · none: rules-visible: not in context or reachable: CORE-08
- django-validation-not-review · none: rules-visible: not in context or reachable: SEC-02, TEST-01
- django-weekly-query · none: rules-visible: not in context or reachable: DB-10, TEST-01
- android-setup · ref:9504d10: skill-trigger: expected devbook-setup, model loads none
- astro-add-license · ref:9504d10: rules-visible: not in context or reachable: LIC-01
- astro-branch-security-check · ref:9504d10: skill-trigger: expected devbook-security-review, model loads none
- astro-devbook-up-to-date · ref:9504d10: skill-trigger: expected devbook-upgrade, model loads none
- astro-launch-google · ref:9504d10: skill-trigger: expected devbook-seo-audit, model loads none
- astro-ready-to-ship · ref:9504d10: skill-trigger: expected devbook-release-check, model loads none
- astro-scheduled-posts · ref:9504d10: skill-trigger: expected devbook-feature-doc, model loads none
- astro-seo-audit · ref:9504d10: skill-trigger: expected devbook-seo-audit, model loads none
- astro-setup · ref:9504d10: skill-trigger: expected devbook-setup, model loads none
- django-crud-no-feature-doc · ref:9504d10: skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · ref:9504d10: skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · ref:9504d10: skill-trigger: expected devbook-api-endpoint, model loads none
- django-note-price · ref:9504d10: skill-trigger: expected devbook-db-migration, model loads none
- django-patch-title · ref:9504d10: skill-trigger: expected devbook-api-endpoint, model loads none
- django-security-review · ref:9504d10: skill-trigger: expected devbook-security-review, model loads none
- django-setup · ref:9504d10: skill-trigger: expected devbook-setup, model loads none
- django-sharing-feature-doc · ref:9504d10: skill-trigger: expected devbook-feature-doc, model loads none
- django-ship-failing · ref:9504d10: skill-trigger: expected devbook-release-check, model loads none
- django-split-body · ref:9504d10: rules-visible: not in context or reachable: CORE-06; skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · ref:9504d10: skill-trigger: expected devbook-db-migration, model loads none
- django-update-devbook · ref:9504d10: skill-trigger: expected devbook-upgrade, model loads none
- astro-scheduled-posts · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-note-price · main: skill-trigger: expected devbook-db-migration, model loads none
- django-patch-title · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-security-review · main: skill-trigger: expected devbook-security-review, model loads devbook-release-check
- django-sharing-feature-doc · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · main: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · main: skill-trigger: expected devbook-db-migration, model loads none
