# Technical spec — <project>

**Version:** 0.1.0 · **Last updated:** YYYY-MM-DD · Links: [brief](./project-brief.md), [ADRs](./adr/)

## 1. Overview
<2–4 sentences: what is being built and the shape of the solution.>

## 2. Architecture
```
<diagram in text: clients → edge/CDN → app → data → external services>
```
- Rendering model: <static / server / hybrid / native>
- Hosting: <…> (ADR-000N)
- Key dependencies: <…>

## 3. Data model
| Entity | Key fields | Relations | Personal data? | Retention |
|---|---|---|---|---|

## 4. Features
Repeat per feature.

### 4.N <Feature name>
- **User story:** As a <user>, I want <action>, so that <outcome>.
- **Acceptance criteria:**
  1. Given <context>, when <action>, then <result>.
  2. …
- **Interfaces:** <routes, endpoints (link OpenAPI), events, components>
- **Data:** <entities read/written>
- **Errors and edge cases:** <empty, invalid, unauthorised, offline, slow>
- **Security notes / threat model:** <if auth, money, personal data, uploads or LLM tools>
- **Out of scope:** <…>

## 5. Non-functional requirements
- Performance budgets: <link or table>
- Accessibility: WCAG 2.2 AA
- Security: devbook baseline + <extras>
- Privacy: <data collected, purpose, consent>
- Observability: <logs, metrics, alerts>
- Browsers / devices / OS versions: <…>

## 6. Integrations
| Service | Purpose | Data sent | Failure behaviour |
|---|---|---|---|

## 7. Testing plan
<Which layers cover which features; e2e journeys.>

## 8. Rollout
<Environments, migrations, feature flags, rollback.>

## 9. Open questions
- …

## Changelog
- 0.1.0 (YYYY-MM-DD): first draft
