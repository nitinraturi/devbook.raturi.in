---
title: Django
description: Django stack profile - apps by domain, settings from environment, security settings, ORM and migrations, DRF APIs, background jobs, testing and deploys.
lastVerified: 2026-10-22
sidebar:
  order: 9
---

Check the current Django release notes and supported versions before starting; use a supported LTS release for long-lived projects.

## Rules

### Layout
- One Django app per domain area (`orders`, `accounts`, `catalog`), each with its models, services, views, serializers, admin and tests.
- Business logic in plain service functions or modules, not in views or model `save()` overrides.
- Settings split by environment or driven entirely by environment variables (`django-environ` or similar); `.env.example` committed.

### Security settings (production)
- `DEBUG = False`; `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` explicit.
- `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS` set; `SECURE_CONTENT_TYPE_NOSNIFF` on.
- `SECRET_KEY` from the environment, unique per environment.
- Run `python manage.py check --deploy` in CI for production settings and fix every warning or document why.
- Never use `|safe`, `mark_safe` or raw SQL with user input without review.

### Data
- Migrations committed and reviewed; never edit an applied migration.
- Use `select_related` / `prefetch_related` to avoid N+1 queries; add indexes in `Meta.indexes`.
- Money in `DecimalField`; timestamps timezone-aware (`USE_TZ = True`).
- Use database constraints (`UniqueConstraint`, `CheckConstraint`).

### APIs
- Django REST Framework (or Django Ninja) with serializers validating all input, explicit permission classes on every view (deny by default), pagination on every list, throttling on auth and expensive endpoints.
- Generate an OpenAPI schema and keep it in the repo.

### Background work
- Celery, RQ or Django's task framework (check availability in your version) for email, file processing and LLM calls; tasks idempotent with retries.

### Quality
- `pytest` with `pytest-django`; factories for test data; no real personal data.
- Ruff for lint and format; mypy or pyright with `django-stubs`.
- `pip-audit` or similar in CI; dependencies pinned with hashes.

### Deployment
- Gunicorn or Uvicorn behind a reverse proxy; static files via WhiteNoise or a CDN.
- `migrate` as an explicit release step; health-check endpoint; structured logging to stdout.

## Checklist
- [ ] Apps by domain; logic in services
- [ ] `check --deploy` clean
- [ ] Permissions on every view; pagination; throttling
- [ ] Migrations reviewed; N+1 avoided
- [ ] pytest, ruff, type checker, audit in CI
