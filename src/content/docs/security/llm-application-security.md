---
title: LLM application security
description: Security rules for products that call an LLM - prompt injection, output handling, data leakage, excessive agency, system prompt exposure, RAG weaknesses and cost abuse.
lastVerified: 2026-10-22
sidebar:
  order: 3
---

Applies when your product sends data to a language model or lets a model take actions. Organised around the [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) (2025 edition at the time of writing).

## Core idea

Treat the model as an **untrusted component**. Anything that reaches it can influence it, and anything it produces is untrusted input to the rest of your system.

## Rules

### Prompt injection
- Assume any text the model reads (user input, web pages, documents, emails, tool results, retrieved chunks) may contain instructions trying to override yours.
- Keep instructions and untrusted data clearly separated in the prompt and label the data as data.
- Security **MUST NOT** depend on the model obeying instructions. Enforce limits in code: permissions, allowlists, schema validation, human approval.

### Output handling
- Validate model output against a schema before using it.
- Never pass model output directly into SQL, shell commands, `eval`, file paths, HTML without encoding, or URLs that are fetched server-side.
- Render model-generated HTML or Markdown through a sanitiser.

### Sensitive data
- Send the model only the data the task needs. Strip secrets and unneeded personal data before the call.
- Know and document the provider's data-retention and training-use terms for your plan.
- Never put API keys, internal URLs or other users' data in prompts.

### Agency and tools
- Give tools the **least privilege** possible: read-only where possible, scoped to the current user, with allowlisted parameters.
- Actions that spend money, send messages, delete data or change permissions **MUST** require explicit user confirmation.
- Log every tool call with user, parameters and result for audit.

### System prompt
- Assume the system prompt can be extracted. Never put secrets or security logic in it.

### Retrieval (RAG)
- Enforce access control at retrieval time: a user can only retrieve documents they may already see.
- Track the source of every indexed document; be able to remove one.

### Misinformation
- When output is presented as fact, ground it in retrieved sources and show citations; say clearly when the model is unsure.
- Label AI-generated content where users would reasonably want to know.

### Unbounded consumption
- Per-user and global limits on requests, tokens and spend; alerts on unusual cost.
- Limit input size and maximum output tokens.

## Checklist
- [ ] Untrusted content separated and labelled
- [ ] Output schema-validated and encoded before use
- [ ] Tools least-privilege; risky actions need confirmation
- [ ] No secrets in prompts or system prompt
- [ ] Retrieval respects user permissions
- [ ] Rate, token and cost limits with alerts
