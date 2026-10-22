---
title: Security review
description: Checklist for reviewing a change that touches authentication, authorisation, input, files, payments, headers, secrets, dependencies or LLM features.
sidebar:
  order: 4
---

Use for any change touching sensitive areas. Details: [security baseline](/security/security-baseline/), [LLM application security](/security/llm-application-security/).

## Access
- [ ] Every new endpoint or page declares who may access it (deny by default)
- [ ] Per-object authorisation on the server
- [ ] No trust in client-supplied IDs, roles or prices
- [ ] Session and cookie settings unchanged or reviewed

## Input and output
- [ ] Server-side schema validation for all new inputs
- [ ] Parameterised queries; no string-built SQL or shell
- [ ] Output encoded for context; no new raw-HTML escape hatches without sanitising
- [ ] Server fetches of user URLs allowlisted (SSRF)
- [ ] File uploads validated, size-limited, stored safely

## Secrets and data
- [ ] No secrets in code, config, logs, prompts or client bundle
- [ ] Personal data minimised, tagged, and not logged
- [ ] New third-party processors added to the privacy list

## Platform
- [ ] Security headers and CSP still correct
- [ ] Rate limits on new expensive or sensitive endpoints
- [ ] New dependencies verified (exist, maintained, licence)

## LLM features
- [ ] Untrusted content separated from instructions
- [ ] Model output schema-validated before use; never executed
- [ ] Tools least-privilege; risky actions need user confirmation
- [ ] Token, rate and cost limits
- [ ] Retrieval respects user permissions
