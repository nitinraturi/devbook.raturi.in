# Devbook eval results: 2026-11-02 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| none | modelled | 67 | 0% | 0% | 0% | 125 | $0.000 |
| ref:9504d10 @ 9504d10 | modelled | 67 | 69% | 91% | 91% | 10,095 | $0.000 |
| main @ 8b5199c | modelled | 67 | 90% | 75% | 93% | 5,183 | $0.000 |
| local @ bb8fafa+local | modelled | 67 | 93% | 75% | 93% | 4,933 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against none.

| Task | none | ref:9504d10 (Δ tokens) | main (Δ tokens) | local (Δ tokens) |
|---|---|---|---|---|
| android-api-key | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) | 100% 1/1, 3,214 (+3,086) |
| android-camera-permission | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,318 (+4,190) | 100% 1/1, 3,664 (+3,536) |
| android-delete-button | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,274 (+5,146) | 100% 1/1, 4,740 (+4,612) |
| android-icon-font | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 4,548 (+4,420) | 100% 1/1, 4,020 (+3,892) |
| android-offline-notes | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 5,844 (+5,716) | 100% 1/1, 4,740 (+4,612) |
| android-save-token | 0% 0/1, 128 | 100% 1/1, 7,233 (+7,105) | 100% 1/1, 3,748 (+3,620) | 100% 1/1, 3,214 (+3,086) |
| android-setup | 0% 0/1, 128 | 0% 0/1, 128 (+0) | 100% 1/1, 1,601 (+1,473) | 100% 1/1, 1,740 (+1,612) |
| astro-add-helper | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,988 (+2,870) |
| astro-add-license | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) | 100% 1/1, 3,794 (+3,676) |
| astro-blog-announcement | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,454 (+4,336) | 100% 1/1, 3,938 (+3,820) |
| astro-branch-security-check | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,894 (+3,776) | 100% 1/1, 4,053 (+3,935) |
| astro-button-focus | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-cache-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,143 (+4,025) | 100% 1/1, 4,263 (+4,145) |
| astro-contact-form-fields | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-copied-snippet | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,310 (+4,192) | 100% 1/1, 3,794 (+3,676) |
| astro-csp-footer-year | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-devbook-up-to-date | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 4,080 (+3,962) | 100% 1/1, 3,438 (+3,320) |
| astro-fix-failing-test | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,988 (+2,870) |
| astro-hero-image | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,027 (+6,909) | 100% 1/1, 7,153 (+7,035) |
| astro-launch-google | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 5,165 (+5,047) | 100% 1/1, 5,304 (+5,186) |
| astro-load-probe | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 5,036 (+4,918) | 100% 1/1, 4,513 (+4,395) |
| astro-meta-description | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-missing-analytics-id | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-moved-url | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-new-post-meta | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,463 (+7,345) |
| astro-not-found | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-reading-time | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,463 (+7,345) |
| astro-ready-to-ship | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 3,795 (+3,677) | 100% 1/1, 3,292 (+3,174) |
| astro-reduced-motion | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,463 (+7,345) |
| astro-scheduled-posts | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 0% 0/1, 5,311 (+5,193) | 0% 0/1, 4,801 (+4,683) |
| astro-secret-key | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 2,988 (+2,870) |
| astro-security-headers | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 3,510 (+3,392) | 100% 1/1, 3,623 (+3,505) |
| astro-self-host-font | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,323 (+7,205) | 100% 1/1, 7,469 (+7,351) |
| astro-seo-audit | 0% 0/1, 118 | 0% 0/1, 11,538 (+11,420) | 100% 1/1, 6,690 (+6,572) | 100% 1/1, 6,829 (+6,711) |
| astro-setup | 0% 0/1, 118 | 0% 0/1, 118 (+0) | 100% 1/1, 1,591 (+1,473) | 100% 1/1, 1,730 (+1,612) |
| astro-sitemap | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 5,165 (+5,047) | 100% 1/1, 5,304 (+5,186) |
| astro-subscribe-endpoint | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 4,868 (+4,750) | 100% 1/1, 4,352 (+4,234) |
| astro-testimonials | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 7,338 (+7,220) | 100% 1/1, 7,463 (+7,345) |
| astro-typo-no-commit | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 6,394 (+6,276) | 100% 1/1, 6,513 (+6,395) |
| astro-view-transitions | 0% 0/1, 118 | 100% 1/1, 11,538 (+11,420) | 100% 1/1, 8,267 (+8,149) | 100% 1/1, 8,420 (+8,302) |
| django-bump-version | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,558 (+3,424) | 100% 1/1, 3,049 (+2,915) |
| django-cors | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 5,352 (+5,218) |
| django-crud-no-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 6,345 (+6,211) | 100% 1/1, 5,849 (+5,715) |
| django-delete-note | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,002 (+4,868) |
| django-error-format | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,220 (+5,086) | 100% 1/1, 5,002 (+4,868) |
| django-fix-failing-test | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 5,002 (+4,868) |
| django-list-all | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,717 (+4,583) |
| django-missing-attachment | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) | 100% 1/1, 4,795 (+4,661) |
| django-note-price | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 6,693 (+6,559) | 0% 0/1, 6,196 (+6,062) |
| django-note-str | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,298 (+5,164) | 100% 1/1, 4,795 (+4,661) |
| django-patch-title | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,002 (+4,868) |
| django-pinned-field | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 6,978 (+6,844) | 100% 1/1, 6,482 (+6,348) |
| django-production-settings | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) | 100% 1/1, 3,989 (+3,855) |
| django-rate-limit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,717 (+4,583) |
| django-rename-url-no-commit | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,220 (+5,086) | 100% 1/1, 4,717 (+4,583) |
| django-search | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,575 (+5,441) | 100% 1/1, 5,088 (+4,954) |
| django-security-review | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,504 (+5,370) | 100% 1/1, 5,782 (+5,648) |
| django-session-cookies | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,558 (+3,424) | 100% 1/1, 3,684 (+3,550) |
| django-setup | 0% 0/1, 134 | 0% 0/1, 134 (+0) | 100% 1/1, 1,607 (+1,473) | 100% 1/1, 1,746 (+1,612) |
| django-sharing-feature-doc | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,888 (+5,754) | 0% 0/1, 5,391 (+5,257) |
| django-ship-failing | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) | 100% 1/1, 3,353 (+3,219) |
| django-split-body | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 5,031 (+4,897) | 0% 0/1, 4,528 (+4,394) |
| django-unique-slug | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 0% 0/1, 6,693 (+6,559) | 0% 0/1, 6,196 (+6,062) |
| django-update-devbook | 0% 0/1, 134 | 0% 0/1, 10,129 (+9,995) | 100% 1/1, 4,127 (+3,993) | 100% 1/1, 3,499 (+3,365) |
| django-upgrade-django | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 3,842 (+3,708) | 100% 1/1, 3,049 (+2,915) |
| django-validation-not-review | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 5,505 (+5,371) | 100% 1/1, 5,002 (+4,868) |
| django-weekly-query | 0% 0/1, 134 | 100% 1/1, 10,129 (+9,995) | 100% 1/1, 6,693 (+6,559) | 100% 1/1, 6,197 (+6,063) |

## Worse than another variant

- android-setup: ref:9504d10 0% vs main 100%
- android-setup: ref:9504d10 0% vs local 100%
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
- django-security-review: ref:9504d10 0% vs local 100%
- django-setup: ref:9504d10 0% vs main 100%
- django-setup: ref:9504d10 0% vs local 100%
- django-ship-failing: ref:9504d10 0% vs main 100%
- django-ship-failing: ref:9504d10 0% vs local 100%
- django-update-devbook: ref:9504d10 0% vs main 100%
- django-update-devbook: ref:9504d10 0% vs local 100%
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
- astro-load-probe · none: rules-visible: not in context or reachable: CORE-02, DES-04
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
