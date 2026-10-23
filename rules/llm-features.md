---
profile: llm-features
title: Devbook LLM features baseline
description: Mandatory Devbook rules for products that call a language model at runtime - prompts as code, structured output, RAG, tools, budgets and LLM security.
---

# Devbook LLM features baseline (mandatory when the product calls a model)

Applies alongside the core baseline to chat, summarisation, extraction, RAG and agent features.

## Need and model choice
- Use a model only where rules, search or a query cannot do the job well. Write the reason in the spec.
- Define success measurably before choosing a model: eval accuracy, latency and cost per request.
- Choose models by eval results on your own task. Re-run evals before every model upgrade.
- Keep provider, model ID and parameters in config, not scattered through code.

## Prompts are code
- Prompts live in version-controlled files with an ID and version, and go through review and the eval suite.
- Keep system instructions, task instructions, examples and untrusted input clearly separated. Label data as data.

## Security: the model is untrusted
- Assume any text the model reads may contain injected instructions.
- Security never depends on the model obeying instructions. Enforce limits in code: permissions, allowlists, schemas and human approval.
- Validate model output against a schema before use. On failure, retry once with the validation error, then fall back.
- Never pass model output directly into SQL, shell, `eval`, file paths, unencoded HTML, or URLs fetched server-side. Sanitise any rendered Markdown or HTML.
- Send only the data the task needs. Never put secrets, internal URLs or other users' data in prompts or the system prompt.
- Tools are narrow, schema-validated and least-privilege. Actions that spend money, send messages, delete data or change permissions need explicit user confirmation.
- Log every tool call with the user, parameters and result.

## Retrieval (RAG)
- Enforce access control at retrieval time.
- Track the source of every indexed document, and keep the index fresh.
- Answers cite the chunks they used. If retrieval finds nothing relevant, say so instead of guessing.

## Runtime
- Every call has a timeout, limited retries with backoff, and a fallback.
- Agent runs have a step limit and a time budget.
- Stream anything a user waits on.
- Set per-feature limits on input tokens, output tokens, latency, cost per request and per user per day.
- Alert on unusual spend.

## Product
- Tell users when content is AI-generated and can be wrong.
- Provide a way to report a bad answer, and route reports into the eval set.

## Detail
- LLM feature engineering: `{{devbook}}/src/content/docs/llm-features/llm-feature-engineering.md`
- LLM evals: `{{devbook}}/src/content/docs/llm-features/llm-evals.md`
- LLM application security: `{{devbook}}/src/content/docs/security/llm-application-security.md`
