---
title: Observability
description: Structured logs, metrics, traces, error tracking, uptime checks and alerts that are actionable, plus what must never be logged, including LLM prompts with user data.
sidebar:
  order: 7
---

You cannot fix what you cannot see. Set this up before launch, not after the first incident.

## Rules

### What to collect
- **Logs:** structured, with level, timestamp (UTC), request or job ID, and outcome.
- **Errors:** an error tracker capturing unhandled exceptions with stack traces and release version, front end and back end.
- **Metrics:** request rate, error rate, latency (p50/p95/p99), job queue depth, and business signals (sign-ups, orders) where relevant.
- **Traces:** for systems with more than one service or heavy external calls, distributed tracing with a correlation ID passed through.
- **Uptime:** an external check on the main pages and health endpoint.
- **Web vitals:** field data for LCP, INP and CLS on public sites.

### What never to collect
- Passwords, tokens, API keys, session cookies, full card or government ID numbers.
- Personal data beyond what is needed; mask emails and phone numbers in logs.
- Full LLM prompts or responses that contain user data, unless the user consented and retention is defined. Log prompt template IDs, token counts, latency and cost instead.

### Alerts
- Alert on symptoms users feel (error rate, latency, downtime), not on every cause.
- Every alert has an owner and a written first step (runbook line).
- If an alert fires and nobody needs to act, change or delete it.

### Releases
- Every deploy is tagged with a version visible in logs and the error tracker, so a regression can be tied to a release.

## Checklist
- [ ] Error tracking on front and back end
- [ ] Structured logs with request IDs
- [ ] Key metrics and an uptime check
- [ ] Alerts with owners and first steps
- [ ] No secrets or unnecessary personal data in any telemetry
