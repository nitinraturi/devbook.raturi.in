---
title: Django
description: Django notes - app layout, production security settings, data and migrations, APIs, background jobs, testing and deployment. Verify against current Django docs.
lastVerified: 2026-10-22
---

Check the current Django docs and release notes before using an API. Use a supported release, and an LTS release for long-lived projects.

- One app per domain area. Business logic goes in service functions, not views or `save()` overrides.
- In production: `DEBUG=False`, explicit `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`, secure cookies, `SECURE_SSL_REDIRECT`, HSTS, and `SECRET_KEY` from the environment. Run `manage.py check --deploy` in CI.
- Any `|safe`, `mark_safe` or raw SQL near user input needs review, because each one turns off Django's built-in escaping or parameterisation.
- Avoid N+1 queries with `select_related` and `prefetch_related`. Declare constraints and indexes in `Meta` so migrations contain them.
- Use `DecimalField` for money and keep `USE_TZ = True`.
- APIs (DRF or Ninja): validate input with serializers, give every view an explicit permission class, and set default pagination and throttling in settings.
- Test with pytest, pytest-django and factories. Use Ruff, mypy or pyright with `django-stubs`, and `pip-audit`.
- Serve with Gunicorn or Uvicorn behind a proxy, and static files with WhiteNoise or a CDN. Run `migrate` as a release step and log to stdout.
