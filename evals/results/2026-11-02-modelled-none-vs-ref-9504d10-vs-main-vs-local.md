# Devbook eval results: 2026-11-02 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| none | modelled | 71 | 0% | 0% | 0% | 126 | $0.000 |
| ref:9504d10 @ 9504d10 | modelled | 71 | 63% | 88% | 88% | 9,934 | $0.000 |
| main @ 8b5199c | modelled | 71 | 85% | 69% | 90% | 5,164 | $0.000 |
| local @ dc40f0d+local | modelled | 71 | 93% | 69% | 93% | 4,935 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against none.

| Task | none | ref:9504d10 (Δ tokens) | main (Δ tokens) | local (Δ tokens) |
|---|---|---|---|---|
| android-api-key | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) | 100% 1/1, 3,211 (+3,083) |
| android-camera-permission | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,318 (+4,190) | 100% 1/1, 3,605 (+3,477) |
| android-delete-button | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,274 (+5,146) | 100% 1/1, 4,737 (+4,609) |
| android-icon-font | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,548 (+4,420) | 100% 1/1, 4,017 (+3,889) |
| android-offline-notes | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,844 (+5,716) | 100% 1/1, 5,131 (+5,003) |
| android-save-token | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) | 100% 1/1, 3,211 (+3,083) |
| android-setup | 0% 0/1, 128 | 0% 0/1, 128 (+0) | 100% 1/1, 1,601 (+1,473) | 100% 1/1, 1,740 (+1,612) |
| apple-data-race | 0% 0/1, 134 | 0% 0/1, 7,238 (+7,104) | 0% 0/1, 3,754 (+3,620) | 100% 1/1, 3,825 (+3,691) |
| apple-last-sync | 0% 0/1, 134 | 0% 0/1, 7,238 (+7,104) | 0% 0/1, 3,754 (+3,620) | 100% 1/1, 3,825 (+3,691) |
| apple-mac-dmg | 0% 0/1, 134 | 0% 0/1, 7,238 (+7,104) | 0% 0/1, 3,283 (+3,149) | 100% 1/1, 3,348 (+3,214) |
| apple-word-count | 0% 0/1, 134 | 0% 0/1, 7,238 (+7,104) | 0% 0/1, 3,754 (+3,620) | 100% 1/1, 3,825 (+3,691) |
| astro-add-helper | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,985 (+2,867) |
| astro-add-license | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) | 100% 1/1, 3,791 (+3,673) |
| astro-blog-announcement | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,454 (+4,336) | 100% 1/1, 3,935 (+3,817) |
| astro-branch-security-check | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,894 (+3,776) | 100% 1/1, 4,050 (+3,932) |
| astro-button-focus | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,510 (+6,392) |
| astro-cache-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,549 (+4,431) | 100% 1/1, 4,685 (+4,567) |
| astro-contact-form-fields | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,510 (+6,392) |
| astro-copied-snippet | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) | 100% 1/1, 3,791 (+3,673) |
| astro-csp-footer-year | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,140 (+7,022) | 100% 1/1, 7,283 (+7,165) |
| astro-devbook-up-to-date | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,080 (+3,962) | 100% 1/1, 3,379 (+3,261) |
| astro-fix-failing-test | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,985 (+2,867) |
| astro-hero-image | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,368 (+7,250) | 100% 1/1, 7,498 (+7,380) |
| astro-launch-google | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 5,165 (+5,047) | 100% 1/1, 5,301 (+5,183) |
| astro-load-probe | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 5,036 (+4,918) | 100% 1/1, 4,511 (+4,393) |
| astro-meta-description | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,510 (+6,392) |
| astro-missing-analytics-id | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,510 (+6,392) |
| astro-moved-url | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,800 (+6,682) | 100% 1/1, 6,934 (+6,816) |
| astro-new-post-meta | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,461 (+7,343) |
| astro-not-found | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,800 (+6,682) | 100% 1/1, 6,934 (+6,816) |
| astro-reading-time | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,461 (+7,343) |
| astro-ready-to-ship | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,795 (+3,677) | 100% 1/1, 3,290 (+3,172) |
| astro-reduced-motion | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,461 (+7,343) |
| astro-scheduled-posts | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 0% 0/1, 5,311 (+5,193) | 0% 0/1, 4,798 (+4,680) |
| astro-secret-key | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,985 (+2,867) |
| astro-security-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,916 (+3,798) | 100% 1/1, 4,045 (+3,927) |
| astro-self-host-font | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,323 (+7,205) | 100% 1/1, 7,467 (+7,349) |
| astro-seo-audit | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 6,690 (+6,572) | 100% 1/1, 6,827 (+6,709) |
| astro-setup | 0% 0/1, 118 | 0% 0/1, 118 (+0) | 100% 1/1, 1,591 (+1,473) | 100% 1/1, 1,730 (+1,612) |
| astro-sitemap | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 5,505 (+5,387) | 100% 1/1, 5,650 (+5,532) |
| astro-subscribe-endpoint | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,868 (+4,750) | 100% 1/1, 4,349 (+4,231) |
| astro-testimonials | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,460 (+7,342) |
| astro-typo-no-commit | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,510 (+6,392) |
| astro-view-transitions | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 8,608 (+8,490) | 100% 1/1, 8,765 (+8,647) |
| django-bump-version | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,558 (+3,424) | 100% 1/1, 3,046 (+2,912) |
| django-cors | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 5,350 (+5,216) |
| django-crud-no-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 6,345 (+6,211) | 100% 1/1, 5,846 (+5,712) |
| django-delete-note | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,000 (+4,866) |
| django-error-format | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,220 (+5,086) | 100% 1/1, 5,000 (+4,866) |
| django-fix-failing-test | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 5,000 (+4,866) |
| django-list-all | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,714 (+4,580) |
| django-missing-attachment | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) | 100% 1/1, 4,792 (+4,658) |
| django-note-price | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 7,048 (+6,914) | 0% 0/1, 6,565 (+6,431) |
| django-note-str | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) | 100% 1/1, 4,792 (+4,658) |
| django-patch-title | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,000 (+4,866) |
| django-pinned-field | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 6,978 (+6,844) | 100% 1/1, 6,479 (+6,345) |
| django-production-settings | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 4,197 (+4,063) | 100% 1/1, 4,357 (+4,223) |
| django-rate-limit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,714 (+4,580) |
| django-rename-url-no-commit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,714 (+4,580) |
| django-search | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,575 (+5,441) | 100% 1/1, 5,085 (+4,951) |
| django-security-review | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,504 (+5,370) | 100% 1/1, 5,780 (+5,646) |
| django-session-cookies | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,913 (+3,779) | 100% 1/1, 4,053 (+3,919) |
| django-setup | 0% 0/1, 134 | 0% 0/1, 134 (+0) | 100% 1/1, 1,607 (+1,473) | 100% 1/1, 1,746 (+1,612) |
| django-sharing-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,888 (+5,754) | 0% 0/1, 5,389 (+5,255) |
| django-ship-failing | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) | 100% 1/1, 3,351 (+3,217) |
| django-split-body | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,031 (+4,897) | 0% 0/1, 4,526 (+4,392) |
| django-unique-slug | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 6,693 (+6,559) | 0% 0/1, 6,194 (+6,060) |
| django-update-devbook | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 4,127 (+3,993) | 100% 1/1, 3,440 (+3,306) |
| django-upgrade-django | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 4,197 (+4,063) | 100% 1/1, 3,417 (+3,283) |
| django-validation-not-review | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,000 (+4,866) |
| django-weekly-query | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 6,693 (+6,559) | 100% 1/1, 6,194 (+6,060) |

## Worse than another variant

- android-setup: ref:9504d10 0% vs main 100%
- android-setup: ref:9504d10 0% vs local 100%
- apple-data-race: ref:9504d10 0% vs local 100%
- apple-last-sync: ref:9504d10 0% vs local 100%
- apple-mac-dmg: ref:9504d10 0% vs local 100%
- apple-word-count: ref:9504d10 0% vs local 100%
- astro-add-license: ref:9504d10 0% vs main 100%
- astro-add-license: ref:9504d10 0% vs local 100%
- astro-branch-security-check: ref:9504d10 0% vs main 100%
- astro-branch-security-check: ref:9504d10 0% vs local 100%
- astro-devbook-up-to-date: ref:9504d10 0% vs main 100%
- astro-devbook-up-to-date: ref:9504d10 0% vs local 100%
- astro-launch-google: ref:9504d10 0% vs main 100%
- astro-launch-google: ref:9504d10 0% vs local 100%
- astro-ready-to-ship: ref:9504d10 0% vs main 100%
- astro-ready-to-ship: ref:9504d10 0% vs local 100%
- astro-seo-audit: ref:9504d10 0% vs main 100%
- astro-seo-audit: ref:9504d10 0% vs local 100%
- astro-setup: ref:9504d10 0% vs main 100%
- astro-setup: ref:9504d10 0% vs local 100%
- django-crud-no-feature-doc: ref:9504d10 0% vs main 100%
- django-crud-no-feature-doc: ref:9504d10 0% vs local 100%
- django-delete-note: ref:9504d10 0% vs main 100%
- django-delete-note: ref:9504d10 0% vs local 100%
- django-error-format: ref:9504d10 0% vs local 100%
- django-patch-title: ref:9504d10 0% vs main 100%
- django-patch-title: ref:9504d10 0% vs local 100%
- django-pinned-field: ref:9504d10 0% vs main 100%
- django-pinned-field: ref:9504d10 0% vs local 100%
- django-security-review: ref:9504d10 0% vs local 100%
- django-setup: ref:9504d10 0% vs main 100%
- django-setup: ref:9504d10 0% vs local 100%
- django-ship-failing: ref:9504d10 0% vs main 100%
- django-ship-failing: ref:9504d10 0% vs local 100%
- django-update-devbook: ref:9504d10 0% vs main 100%
- django-update-devbook: ref:9504d10 0% vs local 100%
- apple-data-race: main 0% vs local 100%
- apple-last-sync: main 0% vs local 100%
- apple-mac-dmg: main 0% vs local 100%
- apple-word-count: main 0% vs local 100%
- django-error-format: main 0% vs local 100%
- django-security-review: main 0% vs local 100%

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
- android-setup · ref:9504d10: skill-trigger: expected devbook-setup, model loads none
- apple-data-race · ref:9504d10: rules-visible: not in context or reachable: stacks/swift.md#concurrency
- apple-last-sync · ref:9504d10: rules-visible: not in context or reachable: stacks/swift.md#privacy
- apple-mac-dmg · ref:9504d10: rules-visible: not in context or reachable: stacks/swift.md#notarize
- apple-word-count · ref:9504d10: rules-visible: not in context or reachable: stacks/swift.md#testing
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
- django-pinned-field · ref:9504d10: rules-visible: not in context or reachable: CORE-06
- django-security-review · ref:9504d10: skill-trigger: expected devbook-security-review, model loads none
- django-setup · ref:9504d10: skill-trigger: expected devbook-setup, model loads none
- django-sharing-feature-doc · ref:9504d10: skill-trigger: expected devbook-feature-doc, model loads none
- django-ship-failing · ref:9504d10: skill-trigger: expected devbook-release-check, model loads none
- django-split-body · ref:9504d10: rules-visible: not in context or reachable: CORE-06; skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · ref:9504d10: skill-trigger: expected devbook-db-migration, model loads none
- django-update-devbook · ref:9504d10: skill-trigger: expected devbook-upgrade, model loads none
- apple-data-race · main: rules-visible: not in context or reachable: stacks/swift.md#concurrency
- apple-last-sync · main: rules-visible: not in context or reachable: stacks/swift.md#privacy
- apple-mac-dmg · main: rules-visible: not in context or reachable: stacks/swift.md#notarize
- apple-word-count · main: rules-visible: not in context or reachable: stacks/swift.md#testing
- astro-scheduled-posts · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-error-format · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-note-price · main: skill-trigger: expected devbook-db-migration, model loads none
- django-security-review · main: skill-trigger: expected devbook-security-review, model loads devbook-release-check
- django-sharing-feature-doc · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · main: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · main: skill-trigger: expected devbook-db-migration, model loads none
- astro-scheduled-posts · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-note-price · local: skill-trigger: expected devbook-db-migration, model loads none
- django-sharing-feature-doc · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · local: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · local: skill-trigger: expected devbook-db-migration, model loads none
