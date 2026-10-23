---
title: Django
description: Django notes - app layout, production security settings, data and migrations, APIs, background jobs, testing and deployment. Verify against current Django docs.
lastVerified: 2026-10-22
---

Use a supported release; prefer an LTS release for long-lived projects.

- One app per domain area. Business logic goes in service functions, not views or `save()` overrides.
- Settings come from environment variables. Commit `.env.example`.
- In production: `DEBUG=False`, explicit `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`, secure cookies, `SECURE_SSL_REDIRECT`, HSTS, and `SECRET_KEY` from the environment. Run `manage.py check --deploy` in CI.
- Using `|safe`, `mark_safe` or raw SQL near user input needs review.
- Commit and review migrations; never edit one that has been applied. Use `select_related`/`prefetch_related`, indexes and database constraints.
- Use `DecimalField` for money and keep `USE_TZ = True`.
- APIs (DRF or Ninja): validate input with serializers, give every view an explicit permission class, paginate every list and throttle auth endpoints. Keep the OpenAPI schema in the repo.
- Run email, files and LLM calls in idempotent background tasks.
- Test with pytest, pytest-django and factories. Use Ruff, mypy or pyright with `django-stubs`, and `pip-audit`.
- Serve with Gunicorn or Uvicorn behind a proxy, and static files with WhiteNoise or a CDN. Run `migrate` as a release step and log to stdout.
