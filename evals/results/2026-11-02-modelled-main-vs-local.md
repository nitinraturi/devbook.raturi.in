# Devbook eval results: 2026-11-02 (modelled)

Modelled: no model was called. "Pass" means every rule the task tests is in the assistant's context or one file away, and the skill trigger model loads the expected skill. Tokens are what Devbook adds to the context for the task (estimated as bytes / 4). It does not show whether the assistant follows the rules.

## Overall

| Variant | Model | Runs | Pass rate | Rules loaded | Rules reachable | Mean input tokens | Mean cost |
|---|---|---|---|---|---|---|---|
| main @ 8b5199c | modelled | 66 | 86% | 75% | 92% | 5,177 | $0.000 |
| local @ a781c4b+local | modelled | 66 | 86% | 75% | 92% | 4,932 | $0.000 |

## Per task

Pass rate (passes/runs) and mean input tokens. Δ is against main.

| Task | main | local (Δ tokens) |
|---|---|---|
| android-api-key | 100% 1/1, 3,748 | 100% 1/1, 3,216 (-532) |
| android-camera-permission | 100% 1/1, 4,318 | 100% 1/1, 3,786 (-532) |
| android-delete-button | 100% 1/1, 5,274 | 100% 1/1, 4,742 (-532) |
| android-icon-font | 100% 1/1, 4,548 | 100% 1/1, 4,016 (-532) |
| android-offline-notes | 100% 1/1, 5,844 | 100% 1/1, 5,312 (-532) |
| android-save-token | 100% 1/1, 3,748 | 100% 1/1, 3,216 (-532) |
| android-setup | 100% 1/1, 1,601 | 100% 1/1, 1,640 (+39) |
| astro-add-helper | 100% 1/1, 3,510 | 100% 1/1, 3,004 (-506) |
| astro-add-license | 100% 1/1, 4,310 | 100% 1/1, 3,804 (-506) |
| astro-blog-announcement | 100% 1/1, 4,454 | 100% 1/1, 3,948 (-506) |
| astro-branch-security-check | 100% 1/1, 3,894 | 100% 1/1, 4,042 (+148) |
| astro-button-focus | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-cache-headers | 100% 1/1, 4,143 | 100% 1/1, 4,267 (+124) |
| astro-contact-form-fields | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-copied-snippet | 100% 1/1, 4,310 | 100% 1/1, 3,804 (-506) |
| astro-csp-footer-year | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-devbook-up-to-date | 100% 1/1, 4,080 | 100% 1/1, 3,574 (-506) |
| astro-fix-failing-test | 100% 1/1, 3,510 | 100% 1/1, 3,004 (-506) |
| astro-hero-image | 100% 1/1, 7,027 | 100% 1/1, 7,150 (+123) |
| astro-launch-google | 100% 1/1, 5,165 | 100% 1/1, 5,288 (+123) |
| astro-meta-description | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-missing-analytics-id | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-moved-url | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-new-post-meta | 100% 1/1, 7,338 | 100% 1/1, 7,461 (+123) |
| astro-not-found | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-reading-time | 100% 1/1, 7,338 | 100% 1/1, 7,461 (+123) |
| astro-ready-to-ship | 100% 1/1, 3,795 | 100% 1/1, 3,289 (-506) |
| astro-reduced-motion | 100% 1/1, 7,338 | 100% 1/1, 7,461 (+123) |
| astro-scheduled-posts | 0% 0/1, 5,311 | 0% 0/1, 4,805 (-506) |
| astro-secret-key | 100% 1/1, 3,510 | 100% 1/1, 3,004 (-506) |
| astro-security-headers | 100% 1/1, 3,510 | 100% 1/1, 3,634 (+124) |
| astro-self-host-font | 100% 1/1, 7,323 | 100% 1/1, 7,447 (+124) |
| astro-seo-audit | 100% 1/1, 6,690 | 100% 1/1, 6,814 (+124) |
| astro-setup | 100% 1/1, 1,591 | 100% 1/1, 1,629 (+38) |
| astro-sitemap | 100% 1/1, 5,165 | 100% 1/1, 5,288 (+123) |
| astro-subscribe-endpoint | 100% 1/1, 4,868 | 100% 1/1, 4,362 (-506) |
| astro-testimonials | 100% 1/1, 7,338 | 100% 1/1, 7,461 (+123) |
| astro-typo-no-commit | 100% 1/1, 6,394 | 100% 1/1, 6,517 (+123) |
| astro-view-transitions | 100% 1/1, 8,267 | 100% 1/1, 8,391 (+124) |
| django-bump-version | 100% 1/1, 3,558 | 100% 1/1, 3,052 (-506) |
| django-cors | 100% 1/1, 5,220 | 100% 1/1, 5,343 (+123) |
| django-crud-no-feature-doc | 100% 1/1, 6,345 | 100% 1/1, 5,839 (-506) |
| django-delete-note | 0% 0/1, 5,220 | 0% 0/1, 4,714 (-506) |
| django-error-format | 0% 0/1, 5,220 | 0% 0/1, 4,714 (-506) |
| django-fix-failing-test | 100% 1/1, 5,220 | 100% 1/1, 4,714 (-506) |
| django-list-all | 100% 1/1, 5,220 | 100% 1/1, 4,714 (-506) |
| django-missing-attachment | 100% 1/1, 5,298 | 100% 1/1, 4,792 (-506) |
| django-note-price | 0% 0/1, 6,693 | 0% 0/1, 6,187 (-506) |
| django-note-str | 100% 1/1, 5,298 | 100% 1/1, 4,792 (-506) |
| django-patch-title | 0% 0/1, 5,220 | 0% 0/1, 4,714 (-506) |
| django-pinned-field | 100% 1/1, 6,978 | 100% 1/1, 6,472 (-506) |
| django-production-settings | 100% 1/1, 3,842 | 100% 1/1, 3,966 (+124) |
| django-rate-limit | 100% 1/1, 5,220 | 100% 1/1, 4,714 (-506) |
| django-rename-url-no-commit | 100% 1/1, 5,220 | 100% 1/1, 4,714 (-506) |
| django-search | 100% 1/1, 5,575 | 100% 1/1, 5,069 (-506) |
| django-security-review | 0% 0/1, 5,504 | 0% 0/1, 5,628 (+124) |
| django-session-cookies | 100% 1/1, 3,558 | 100% 1/1, 3,681 (+123) |
| django-setup | 100% 1/1, 1,607 | 100% 1/1, 1,645 (+38) |
| django-sharing-feature-doc | 0% 0/1, 5,888 | 0% 0/1, 5,382 (-506) |
| django-ship-failing | 100% 1/1, 3,842 | 100% 1/1, 3,336 (-506) |
| django-split-body | 0% 0/1, 5,031 | 0% 0/1, 4,525 (-506) |
| django-unique-slug | 0% 0/1, 6,693 | 0% 0/1, 6,187 (-506) |
| django-update-devbook | 100% 1/1, 4,127 | 100% 1/1, 3,621 (-506) |
| django-upgrade-django | 100% 1/1, 3,842 | 100% 1/1, 3,336 (-506) |
| django-validation-not-review | 100% 1/1, 5,505 | 100% 1/1, 4,999 (-506) |
| django-weekly-query | 100% 1/1, 6,693 | 100% 1/1, 6,187 (-506) |

## Worse than another variant

None.

## Failures

- astro-scheduled-posts · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-note-price · main: skill-trigger: expected devbook-db-migration, model loads none
- django-patch-title · main: skill-trigger: expected devbook-api-endpoint, model loads none
- django-security-review · main: skill-trigger: expected devbook-security-review, model loads devbook-release-check
- django-sharing-feature-doc · main: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · main: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · main: skill-trigger: expected devbook-db-migration, model loads none
- astro-scheduled-posts · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-delete-note · local: skill-trigger: expected devbook-api-endpoint, model loads none
- django-error-format · local: skill-trigger: expected devbook-api-endpoint, model loads none
- django-note-price · local: skill-trigger: expected devbook-db-migration, model loads none
- django-patch-title · local: skill-trigger: expected devbook-api-endpoint, model loads none
- django-security-review · local: skill-trigger: expected devbook-security-review, model loads devbook-release-check
- django-sharing-feature-doc · local: skill-trigger: expected devbook-feature-doc, model loads none
- django-split-body · local: skill-trigger: expected devbook-db-migration, model loads none
- django-unique-slug · local: skill-trigger: expected devbook-db-migration, model loads none
