# Devbook eval results: 2026-11-02 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| main @ 8b5199c | modelled | 66 | 89% | 75% | 92% | 5,185 | $0.000 |
| local @ cffb6c0+local | modelled | 66 | 92% | 75% | 92% | 4,898 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against main.

| Task | main | local (Δ tokens) |
|---|---|---|
| android-api-key | 100% 1/1, 3,748 | 100% 1/1, 3,187 (-561) |
| android-camera-permission | 100% 1/1, 4,318 | 100% 1/1, 3,618 (-700) |
| android-delete-button | 100% 1/1, 5,274 | 100% 1/1, 4,713 (-561) |
| android-icon-font | 100% 1/1, 4,548 | 100% 1/1, 3,987 (-561) |
| android-offline-notes | 100% 1/1, 5,844 | 100% 1/1, 4,713 (-1,131) |
| android-save-token | 100% 1/1, 3,748 | 100% 1/1, 3,187 (-561) |
| android-setup | 100% 1/1, 1,601 | 100% 1/1, 1,490 (-111) |
| astro-add-helper | 100% 1/1, 3,510 | 100% 1/1, 2,967 (-543) |
| astro-add-license | 100% 1/1, 4,310 | 100% 1/1, 3,767 (-543) |
| astro-blog-announcement | 100% 1/1, 4,454 | 100% 1/1, 3,911 (-543) |
| astro-branch-security-check | 100% 1/1, 3,894 | 100% 1/1, 4,026 (+132) |
| astro-button-focus | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-cache-headers | 100% 1/1, 4,143 | 100% 1/1, 4,229 (+86) |
| astro-contact-form-fields | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-copied-snippet | 100% 1/1, 4,310 | 100% 1/1, 3,767 (-543) |
| astro-csp-footer-year | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-devbook-up-to-date | 100% 1/1, 4,080 | 100% 1/1, 3,398 (-682) |
| astro-fix-failing-test | 100% 1/1, 3,510 | 100% 1/1, 2,967 (-543) |
| astro-hero-image | 100% 1/1, 7,027 | 100% 1/1, 7,113 (+86) |
| astro-launch-google | 100% 1/1, 5,165 | 100% 1/1, 5,271 (+106) |
| astro-meta-description | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-missing-analytics-id | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-moved-url | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-new-post-meta | 100% 1/1, 7,338 | 100% 1/1, 7,424 (+86) |
| astro-not-found | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-reading-time | 100% 1/1, 7,338 | 100% 1/1, 7,424 (+86) |
| astro-ready-to-ship | 100% 1/1, 3,795 | 100% 1/1, 3,272 (-523) |
| astro-reduced-motion | 100% 1/1, 7,338 | 100% 1/1, 7,424 (+86) |
| astro-scheduled-posts | 0% 0/1, 5,311 | 0% 0/1, 4,768 (-543) |
| astro-secret-key | 100% 1/1, 3,510 | 100% 1/1, 2,967 (-543) |
| astro-security-headers | 100% 1/1, 3,510 | 100% 1/1, 3,596 (+86) |
| astro-self-host-font | 100% 1/1, 7,323 | 100% 1/1, 7,429 (+106) |
| astro-seo-audit | 100% 1/1, 6,690 | 100% 1/1, 6,796 (+106) |
| astro-setup | 100% 1/1, 1,591 | 100% 1/1, 1,480 (-111) |
| astro-sitemap | 100% 1/1, 5,165 | 100% 1/1, 5,271 (+106) |
| astro-subscribe-endpoint | 100% 1/1, 4,868 | 100% 1/1, 4,325 (-543) |
| astro-testimonials | 100% 1/1, 7,338 | 100% 1/1, 7,424 (+86) |
| astro-typo-no-commit | 100% 1/1, 6,394 | 100% 1/1, 6,480 (+86) |
| astro-view-transitions | 100% 1/1, 8,267 | 100% 1/1, 8,373 (+106) |
| django-bump-version | 100% 1/1, 3,558 | 100% 1/1, 3,028 (-530) |
| django-cors | 100% 1/1, 5,220 | 100% 1/1, 5,319 (+99) |
| django-crud-no-feature-doc | 100% 1/1, 6,345 | 100% 1/1, 5,816 (-529) |
| django-delete-note | 100% 1/1, 5,505 | 100% 1/1, 4,976 (-529) |
| django-error-format | 0% 0/1, 5,220 | 100% 1/1, 4,976 (-244) |
| django-fix-failing-test | 100% 1/1, 5,220 | 100% 1/1, 4,976 (-244) |
| django-list-all | 100% 1/1, 5,220 | 100% 1/1, 4,690 (-530) |
| django-missing-attachment | 100% 1/1, 5,298 | 100% 1/1, 4,768 (-530) |
| django-note-price | 0% 0/1, 6,693 | 0% 0/1, 6,163 (-530) |
| django-note-str | 100% 1/1, 5,298 | 100% 1/1, 4,768 (-530) |
| django-patch-title | 100% 1/1, 5,505 | 100% 1/1, 4,976 (-529) |
| django-pinned-field | 100% 1/1, 6,978 | 100% 1/1, 6,449 (-529) |
| django-production-settings | 100% 1/1, 3,842 | 100% 1/1, 3,962 (+120) |
| django-rate-limit | 100% 1/1, 5,220 | 100% 1/1, 4,690 (-530) |
| django-rename-url-no-commit | 100% 1/1, 5,220 | 100% 1/1, 4,690 (-530) |
| django-search | 100% 1/1, 5,575 | 100% 1/1, 5,045 (-530) |
| django-security-review | 0% 0/1, 5,504 | 100% 1/1, 5,749 (+245) |
| django-session-cookies | 100% 1/1, 3,558 | 100% 1/1, 3,657 (+99) |
| django-setup | 100% 1/1, 1,607 | 100% 1/1, 1,496 (-111) |
| django-sharing-feature-doc | 0% 0/1, 5,888 | 0% 0/1, 5,358 (-530) |
| django-ship-failing | 100% 1/1, 3,842 | 100% 1/1, 3,333 (-509) |
| django-split-body | 0% 0/1, 5,031 | 0% 0/1, 4,501 (-530) |
| django-unique-slug | 0% 0/1, 6,693 | 0% 0/1, 6,163 (-530) |
| django-update-devbook | 100% 1/1, 4,127 | 100% 1/1, 3,459 (-668) |
| django-upgrade-django | 100% 1/1, 3,842 | 100% 1/1, 3,028 (-814) |
| django-validation-not-review | 100% 1/1, 5,505 | 100% 1/1, 4,976 (-529) |
| django-weekly-query | 100% 1/1, 6,693 | 100% 1/1, 6,163 (-530) |

## Worse than another variant

- django-error-format: main 0% vs local 100%
- django-security-review: main 0% vs local 100%

## Failures

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
