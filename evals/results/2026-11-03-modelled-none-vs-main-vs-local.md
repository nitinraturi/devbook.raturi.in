# Devbook eval results: 2026-11-03 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| none | modelled | 71 | 0% | 0% | 0% | 126 | $0.000 |
| main @ aac2456 | modelled | 71 | 93% | 69% | 93% | 4,935 | $0.000 |
| local @ aac2456+local | modelled | 71 | 93% | 69% | 93% | 4,949 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against none.

| Task | none | main (Δ tokens) | local (Δ tokens) |
|---|---|---|---|
| android-api-key | 0% 0/1, 128 | 100% 1/1, 3,211 (+3,083) | 100% 1/1, 3,212 (+3,084) |
| android-camera-permission | 0% 0/1, 128 | 100% 1/1, 3,605 (+3,477) | 100% 1/1, 3,606 (+3,478) |
| android-delete-button | 0% 0/1, 128 | 100% 1/1, 4,737 (+4,609) | 100% 1/1, 4,741 (+4,613) |
| android-icon-font | 0% 0/1, 128 | 100% 1/1, 4,017 (+3,889) | 100% 1/1, 4,018 (+3,890) |
| android-offline-notes | 0% 0/1, 128 | 100% 1/1, 5,131 (+5,003) | 100% 1/1, 5,135 (+5,007) |
| android-save-token | 0% 0/1, 128 | 100% 1/1, 3,211 (+3,083) | 100% 1/1, 3,212 (+3,084) |
| android-setup | 0% 0/1, 128 | 100% 1/1, 1,740 (+1,612) | 100% 1/1, 2,015 (+1,887) |
| apple-data-race | 0% 0/1, 134 | 100% 1/1, 3,825 (+3,691) | 100% 1/1, 3,826 (+3,692) |
| apple-last-sync | 0% 0/1, 134 | 100% 1/1, 3,825 (+3,691) | 100% 1/1, 3,826 (+3,692) |
| apple-mac-dmg | 0% 0/1, 134 | 100% 1/1, 3,348 (+3,214) | 100% 1/1, 3,349 (+3,215) |
| apple-word-count | 0% 0/1, 134 | 100% 1/1, 3,825 (+3,691) | 100% 1/1, 3,826 (+3,692) |
| astro-add-helper | 0% 0/1, 118 | 100% 1/1, 2,985 (+2,867) | 100% 1/1, 2,986 (+2,868) |
| astro-add-license | 0% 0/1, 118 | 100% 1/1, 3,791 (+3,673) | 100% 1/1, 3,792 (+3,674) |
| astro-blog-announcement | 0% 0/1, 118 | 100% 1/1, 3,935 (+3,817) | 100% 1/1, 3,936 (+3,818) |
| astro-branch-security-check | 0% 0/1, 118 | 100% 1/1, 4,050 (+3,932) | 100% 1/1, 4,051 (+3,933) |
| astro-button-focus | 0% 0/1, 118 | 100% 1/1, 6,510 (+6,392) | 100% 1/1, 6,515 (+6,397) |
| astro-cache-headers | 0% 0/1, 118 | 100% 1/1, 4,685 (+4,567) | 100% 1/1, 4,704 (+4,586) |
| astro-contact-form-fields | 0% 0/1, 118 | 100% 1/1, 6,510 (+6,392) | 100% 1/1, 6,515 (+6,397) |
| astro-copied-snippet | 0% 0/1, 118 | 100% 1/1, 3,791 (+3,673) | 100% 1/1, 3,792 (+3,674) |
| astro-csp-footer-year | 0% 0/1, 118 | 100% 1/1, 7,283 (+7,165) | 100% 1/1, 7,288 (+7,170) |
| astro-devbook-up-to-date | 0% 0/1, 118 | 100% 1/1, 3,379 (+3,261) | 100% 1/1, 3,380 (+3,262) |
| astro-fix-failing-test | 0% 0/1, 118 | 100% 1/1, 2,985 (+2,867) | 100% 1/1, 2,986 (+2,868) |
| astro-hero-image | 0% 0/1, 118 | 100% 1/1, 7,498 (+7,380) | 100% 1/1, 7,521 (+7,403) |
| astro-launch-google | 0% 0/1, 118 | 100% 1/1, 5,301 (+5,183) | 100% 1/1, 5,302 (+5,184) |
| astro-load-probe | 0% 0/1, 118 | 100% 1/1, 4,511 (+4,393) | 100% 1/1, 4,515 (+4,397) |
| astro-meta-description | 0% 0/1, 118 | 100% 1/1, 6,510 (+6,392) | 100% 1/1, 6,515 (+6,397) |
| astro-missing-analytics-id | 0% 0/1, 118 | 100% 1/1, 6,510 (+6,392) | 100% 1/1, 6,515 (+6,397) |
| astro-moved-url | 0% 0/1, 118 | 100% 1/1, 6,934 (+6,816) | 100% 1/1, 6,939 (+6,821) |
| astro-new-post-meta | 0% 0/1, 118 | 100% 1/1, 7,461 (+7,343) | 100% 1/1, 7,465 (+7,347) |
| astro-not-found | 0% 0/1, 118 | 100% 1/1, 6,934 (+6,816) | 100% 1/1, 6,939 (+6,821) |
| astro-reading-time | 0% 0/1, 118 | 100% 1/1, 7,461 (+7,343) | 100% 1/1, 7,465 (+7,347) |
| astro-ready-to-ship | 0% 0/1, 118 | 100% 1/1, 3,290 (+3,172) | 100% 1/1, 3,291 (+3,173) |
| astro-reduced-motion | 0% 0/1, 118 | 100% 1/1, 7,461 (+7,343) | 100% 1/1, 7,465 (+7,347) |
| astro-scheduled-posts | 0% 0/1, 118 | 0% 0/1, 4,798 (+4,680) | 0% 0/1, 4,799 (+4,681) |
| astro-secret-key | 0% 0/1, 118 | 100% 1/1, 2,985 (+2,867) | 100% 1/1, 2,986 (+2,868) |
| astro-security-headers | 0% 0/1, 118 | 100% 1/1, 4,045 (+3,927) | 100% 1/1, 4,046 (+3,928) |
| astro-self-host-font | 0% 0/1, 118 | 100% 1/1, 7,467 (+7,349) | 100% 1/1, 7,489 (+7,371) |
| astro-seo-audit | 0% 0/1, 118 | 100% 1/1, 6,827 (+6,709) | 100% 1/1, 6,831 (+6,713) |
| astro-setup | 0% 0/1, 118 | 100% 1/1, 1,730 (+1,612) | 100% 1/1, 2,004 (+1,886) |
| astro-sitemap | 0% 0/1, 118 | 100% 1/1, 5,650 (+5,532) | 100% 1/1, 5,651 (+5,533) |
| astro-subscribe-endpoint | 0% 0/1, 118 | 100% 1/1, 4,349 (+4,231) | 100% 1/1, 4,350 (+4,232) |
| astro-testimonials | 0% 0/1, 118 | 100% 1/1, 7,460 (+7,342) | 100% 1/1, 7,465 (+7,347) |
| astro-typo-no-commit | 0% 0/1, 118 | 100% 1/1, 6,510 (+6,392) | 100% 1/1, 6,515 (+6,397) |
| astro-view-transitions | 0% 0/1, 118 | 100% 1/1, 8,765 (+8,647) | 100% 1/1, 8,787 (+8,669) |
| django-bump-version | 0% 0/1, 134 | 100% 1/1, 3,046 (+2,912) | 100% 1/1, 3,047 (+2,913) |
| django-cors | 0% 0/1, 134 | 100% 1/1, 5,350 (+5,216) | 100% 1/1, 5,351 (+5,217) |
| django-crud-no-feature-doc | 0% 0/1, 134 | 100% 1/1, 5,846 (+5,712) | 100% 1/1, 5,847 (+5,713) |
| django-delete-note | 0% 0/1, 134 | 100% 1/1, 5,000 (+4,866) | 100% 1/1, 5,001 (+4,867) |
| django-error-format | 0% 0/1, 134 | 100% 1/1, 5,000 (+4,866) | 100% 1/1, 5,001 (+4,867) |
| django-fix-failing-test | 0% 0/1, 134 | 100% 1/1, 5,000 (+4,866) | 100% 1/1, 5,001 (+4,867) |
| django-list-all | 0% 0/1, 134 | 100% 1/1, 4,714 (+4,580) | 100% 1/1, 4,715 (+4,581) |
| django-missing-attachment | 0% 0/1, 134 | 100% 1/1, 4,792 (+4,658) | 100% 1/1, 4,793 (+4,659) |
| django-note-price | 0% 0/1, 134 | 0% 0/1, 6,565 (+6,431) | 0% 0/1, 6,566 (+6,432) |
| django-note-str | 0% 0/1, 134 | 100% 1/1, 4,792 (+4,658) | 100% 1/1, 4,793 (+4,659) |
| django-patch-title | 0% 0/1, 134 | 100% 1/1, 5,000 (+4,866) | 100% 1/1, 5,001 (+4,867) |
| django-pinned-field | 0% 0/1, 134 | 100% 1/1, 6,479 (+6,345) | 100% 1/1, 6,480 (+6,346) |
| django-production-settings | 0% 0/1, 134 | 100% 1/1, 4,357 (+4,223) | 100% 1/1, 4,358 (+4,224) |
| django-rate-limit | 0% 0/1, 134 | 100% 1/1, 4,714 (+4,580) | 100% 1/1, 4,715 (+4,581) |
| django-rename-url-no-commit | 0% 0/1, 134 | 100% 1/1, 4,714 (+4,580) | 100% 1/1, 4,715 (+4,581) |
| django-search | 0% 0/1, 134 | 100% 1/1, 5,085 (+4,951) | 100% 1/1, 5,086 (+4,952) |
| django-security-review | 0% 0/1, 134 | 100% 1/1, 5,780 (+5,646) | 100% 1/1, 5,781 (+5,647) |
| django-session-cookies | 0% 0/1, 134 | 100% 1/1, 4,053 (+3,919) | 100% 1/1, 4,054 (+3,920) |
| django-setup | 0% 0/1, 134 | 100% 1/1, 1,746 (+1,612) | 100% 1/1, 2,020 (+1,886) |
| django-sharing-feature-doc | 0% 0/1, 134 | 0% 0/1, 5,389 (+5,255) | 0% 0/1, 5,390 (+5,256) |
| django-ship-failing | 0% 0/1, 134 | 100% 1/1, 3,351 (+3,217) | 100% 1/1, 3,352 (+3,218) |
| django-split-body | 0% 0/1, 134 | 0% 0/1, 4,526 (+4,392) | 0% 0/1, 4,527 (+4,393) |
| django-unique-slug | 0% 0/1, 134 | 0% 0/1, 6,194 (+6,060) | 0% 0/1, 6,195 (+6,061) |
| django-update-devbook | 0% 0/1, 134 | 100% 1/1, 3,440 (+3,306) | 100% 1/1, 3,441 (+3,307) |
| django-upgrade-django | 0% 0/1, 134 | 100% 1/1, 3,417 (+3,283) | 100% 1/1, 3,418 (+3,284) |
| django-validation-not-review | 0% 0/1, 134 | 100% 1/1, 5,000 (+4,866) | 100% 1/1, 5,001 (+4,867) |
| django-weekly-query | 0% 0/1, 134 | 100% 1/1, 6,194 (+6,060) | 100% 1/1, 6,195 (+6,061) |

## Worse than another variant

None.

## Failures

- android-api-key · none: rules-visible: not in context or reachable: MOB-01, SEC-03
- android-camera-permission · none: rules-visible: not in context or reachable: MOB-05
- android-delete-button · none: rules-visible: not in context or reachable: MOB-04, DES-29
- android-icon-font · none: rules-visible: not in context or reachable: LIC-02, LIC-11
- android-offline-notes · none: rules-visible: not in context or reachable: MOB-03, DES-21
- android-save-token · none: rules-visible: not in context or reachable: MOB-01
- android-setup · none: skill-trigger: expected devbook-setup, model loads none
- apple-data-race · none: rules-visible: not in context or reachable: CORE-02, stacks/swift.md#concurrency
- apple-last-sync · none: rules-visible: not in context or reachable: MOB-06, stacks/swift.md#privacy
- apple-mac-dmg · none: rules-visible: not in context or reachable: SEC-03, stacks/swift.md#notarize
- apple-word-count · none: rules-visible: not in context or reachable: TEST-01, CORE-10, stacks/swift.md#testing
- astro-add-helper · none: rules-visible: not in context or reachable: TEST-01, CORE-01
- astro-add-license · none: rules-visible: not in context or reachable: LIC-01
- astro-blog-announcement · none: rules-visible: not in context or reachable: CONT-01, CONT-03, CONT-06
- astro-branch-security-check · none: rules-visible: not in context or reachable: SEC-05; skill-trigger: expected devbook-security-review, model loads none
- astro-button-focus · none: rules-visible: not in context or reachable: DES-20, DES-27, DES-18
- astro-cache-headers · none: rules-visible: not in context or reachable: PERF-12, stacks/cloudflare.md#headers
- astro-contact-form-fields · none: rules-visible: not in context or reachable: DES-22, DES-23
- astro-copied-snippet · none: rules-visible: not in context or reachable: LIC-03, LIC-14
- astro-csp-footer-year · none: rules-visible: not in context or reachable: SEC-05, stacks/astro.md#csp, stacks/cloudflare.md#headers
- astro-devbook-up-to-date · none: skill-trigger: expected devbook-upgrade, model loads none
- astro-fix-failing-test · none: rules-visible: not in context or reachable: CORE-02, TEST-02
- astro-hero-image · none: rules-visible: not in context or reachable: PERF-05, PERF-06, SEO-19, stacks/astro.md#images
- astro-launch-google · none: rules-visible: not in context or reachable: SEO-25, SEO-04; skill-trigger: expected devbook-seo-audit, model loads none
- astro-load-probe · none: rules-visible: not in context or reachable: CORE-02, DES-04
- astro-meta-description · none: rules-visible: not in context or reachable: SEO-11
- astro-missing-analytics-id · none: rules-visible: not in context or reachable: CORE-04, CORE-03
- astro-moved-url · none: rules-visible: not in context or reachable: SEO-09, SEO-08, stacks/cloudflare.md#redirects
- astro-new-post-meta · none: rules-visible: not in context or reachable: SEO-11, SEO-15, CONT-01
- astro-not-found · none: rules-visible: not in context or reachable: SEO-01, stacks/cloudflare.md#workers
- astro-reading-time · none: rules-visible: not in context or reachable: CORE-04, SEC-04
- astro-ready-to-ship · none: rules-visible: not in context or reachable: CORE-01, CORE-05; skill-trigger: expected devbook-release-check, model loads none
- astro-reduced-motion · none: rules-visible: not in context or reachable: DES-25, DES-26
- astro-scheduled-posts · none: rules-visible: not in context or reachable: FEAT-04, FEAT-12; skill-trigger: expected devbook-feature-doc, model loads none
- astro-secret-key · none: rules-visible: not in context or reachable: SEC-03
- astro-security-headers · none: rules-visible: not in context or reachable: SEC-18, SEC-05, stacks/cloudflare.md#headers
- astro-self-host-font · none: rules-visible: not in context or reachable: PERF-07, SEC-19, DES-11
- astro-seo-audit · none: rules-visible: not in context or reachable: SEO-11, SEO-03; skill-trigger: expected devbook-seo-audit, model loads none
- astro-setup · none: skill-trigger: expected devbook-setup, model loads none
- astro-sitemap · none: rules-visible: not in context or reachable: SEO-07, SEC-04, stacks/astro.md#checks
- astro-subscribe-endpoint · none: rules-visible: not in context or reachable: SEC-02, SEC-11
- astro-testimonials · none: rules-visible: not in context or reachable: CONT-01, DES-06
- astro-typo-no-commit · none: rules-visible: not in context or reachable: CORE-05
- astro-view-transitions · none: rules-visible: not in context or reachable: PERF-03, DES-19, DES-31, stacks/astro.md#islands
- django-bump-version · none: rules-visible: not in context or reachable: CORE-18
- django-cors · none: rules-visible: not in context or reachable: SEC-10, SEC-04
- django-crud-no-feature-doc · none: rules-visible: not in context or reachable: FEAT-05; skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · none: rules-visible: not in context or reachable: API-12, API-14, TEST-01; skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · none: rules-visible: not in context or reachable: API-02, API-13; skill-trigger: expected devbook-api-endpoint, model loads none
- django-fix-failing-test · none: rules-visible: not in context or reachable: CORE-02, TEST-02
- django-list-all · none: rules-visible: not in context or reachable: API-03, API-17
- django-missing-attachment · none: rules-visible: not in context or reachable: CORE-04, CORE-03
- django-note-price · none: rules-visible: not in context or reachable: DB-11, API-18, stacks/django.md#money; skill-trigger: expected devbook-db-migration, model loads none
- django-note-str · none: rules-visible: not in context or reachable: CORE-17
- django-patch-title · none: rules-visible: not in context or reachable: SEC-02, API-05, API-12; skill-trigger: expected devbook-api-endpoint, model loads none
- django-pinned-field · none: rules-visible: not in context or reachable: DB-03, CORE-06
- django-production-settings · none: rules-visible: not in context or reachable: SEC-03, stacks/django.md#production
- django-rate-limit · none: rules-visible: not in context or reachable: SEC-11, SEC-04
- django-rename-url-no-commit · none: rules-visible: not in context or reachable: CORE-05
- django-search · none: rules-visible: not in context or reachable: TEST-01, CORE-01, PERF-10
- django-security-review · none: rules-visible: not in context or reachable: SEC-06, SEC-03, SEC-01; skill-trigger: expected devbook-security-review, model loads none
- django-session-cookies · none: rules-visible: not in context or reachable: SEC-16, SEC-09, SEC-13, stacks/django.md#production
- django-setup · none: skill-trigger: expected devbook-setup, model loads none
- django-sharing-feature-doc · none: rules-visible: not in context or reachable: FEAT-04, FEAT-17, FEAT-12, FEAT-08; skill-trigger: expected devbook-feature-doc, model loads none
- django-ship-failing · none: rules-visible: not in context or reachable: CORE-01, CORE-02, CORE-05; skill-trigger: expected devbook-release-check, model loads none
- django-split-body · none: rules-visible: not in context or reachable: CORE-06, DB-04, DB-31; skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · none: rules-visible: not in context or reachable: DB-17, DB-02; skill-trigger: expected devbook-db-migration, model loads none
- django-update-devbook · none: skill-trigger: expected devbook-upgrade, model loads none
- django-upgrade-django · none: rules-visible: not in context or reachable: CORE-08, stacks/django.md#versions
- django-validation-not-review · none: rules-visible: not in context or reachable: SEC-02, TEST-01
- django-weekly-query · none: rules-visible: not in context or reachable: DB-10, TEST-01
- astro-scheduled-posts · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-note-price · main: skill-trigger: expected devbook-db-migration, model loads none
- django-sharing-feature-doc · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · main: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · main: skill-trigger: expected devbook-db-migration, model loads none
- astro-scheduled-posts · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-note-price · local: skill-trigger: expected devbook-db-migration, model loads none
- django-sharing-feature-doc · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · local: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · local: skill-trigger: expected devbook-db-migration, model loads none
