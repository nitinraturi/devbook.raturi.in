---
title: LLM feature engineering
description: Building features that call a language model - model choice, versioned prompts, structured output, RAG, tools, streaming, fallbacks, cost and latency budgets.
sidebar:
  order: 1
---

For products that call a model at runtime (chat, summarisation, extraction, agents). Pair this page with [LLM application security](/security/llm-application-security/) and [evals](/llm-features/llm-evals/).

## Rules

### Decide whether you need a model
- Use a model only where rules, search or a database query cannot do the job well. Write the reason in the spec.
- Define success measurably (accuracy on an eval set, latency, cost per request) before choosing a model.

### Model choice
- Choose by eval results on your own task, then latency and cost, not by benchmark headlines.
- Record provider, model ID and parameters in config, not scattered in code.
- Keep an abstraction thin enough to switch providers or models, but do not build a framework.
- Re-run evals before every model upgrade.

### Prompts are code
- Prompts live in version-controlled files with an ID and version, not inline strings spread through the codebase.
- A prompt change goes through review and the eval suite like any code change.
- Separate system instructions, task instructions, examples and untrusted input clearly.
- Few-shot examples are real, representative and reviewed.

### Structured output
- Ask for structured output (JSON matching a schema) whenever code consumes the result. Use the provider's structured-output or tool-calling features where available.
- Validate against the schema; on failure, retry once with the validation error, then fall back.

### Retrieval (RAG)
- Chunk by meaning (sections, paragraphs) with metadata: source, title, date, access permissions.
- Retrieve with permissions enforced; re-rank if relevance is weak.
- The answer cites the chunks it used; the UI shows sources.
- If retrieval finds nothing relevant, the model says so instead of guessing.
- Keep the index fresh: re-index on content change, remove deleted documents.

### Tools and agents
- Each tool has a narrow purpose, a strict input schema and least-privilege access.
- Set a maximum number of steps and a time budget per agent run.
- Confirm with the user before irreversible actions.
- Log each step for debugging and audit.

### Runtime behaviour
- Stream responses for anything a user waits on.
- Every call has a timeout, limited retries with backoff, and a fallback (smaller model, cached answer, or a clear message).
- Cache deterministic or repeated requests where it is safe.
- Set per-feature budgets: maximum input tokens, maximum output tokens, target latency, cost per request and per user per day.

### Product
- Tell users when content is AI-generated and that it can be wrong, in plain words where it matters.
- Provide a way to report a bad answer; route reports into the eval set.

## Checklist
- [ ] Need for a model justified; success measure defined
- [ ] Prompts versioned in files and reviewed
- [ ] Structured output validated
- [ ] RAG with permissions and citations
- [ ] Timeouts, fallbacks, budgets
- [ ] Feedback path into evals
