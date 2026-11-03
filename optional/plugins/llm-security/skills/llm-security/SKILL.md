---
name: llm-security
description: "Secures application features that call a language model: treats model input and output as untrusted, enforces permissions and schemas in code, confirms risky tool actions, minimises the data sent and caps cost. Use when building or reviewing a chatbot, agent, RAG pipeline or any feature that sends data to an LLM or lets one call tools."
license: CC-BY-4.0
---

# LLM feature security

A prompt can be talked out of its rules, so every control that matters lives in code, outside the model.

## Procedure

1. Map the feature: what goes into the model (user text, retrieved documents, tool results, files), what comes out, and what tools or actions the model can trigger and with whose permissions.
2. Apply the rules below to each input, output and tool. Write a short threat model for the feature: prompt injection through each untrusted input, data leaking to the wrong user, tools misused, and runaway cost.
3. Test the controls with adversarial cases: an injected instruction in a retrieved document, a request for another user's data, a tool call with out-of-scope arguments, and an oversized request.
4. Report the threat model, the controls and where they are enforced, the tests and their output, and any risk left open.

## Rules

- Treat model input and output as untrusted. Retrieved pages, emails, files and tool results can carry instructions; never let them change permissions or call tools on their own authority.
- Enforce permissions in code on every tool call, with the end user's permissions, never the service's. Give each tool the narrowest scope that works.
- Validate model output against a schema before acting on it, and handle it like user input: escape it before rendering, parameterise it before queries, never `eval` it.
- Require explicit human confirmation for consequential actions (sending, paying, deleting, changing access), showing the exact action.
- Send the model only the data the task needs. Never put secrets, keys or other users' data in a prompt or the system prompt; assume the system prompt can be extracted.
- Cap tokens, cost and requests per user and per session, and alert on spikes.
- Log prompts, tool calls and decisions for audit without secrets or unnecessary personal data, and keep them under the same retention rules as other personal data.
- Keep model and provider choice in configuration, and check the provider's current data-retention and training terms before sending user data.

Sources: OWASP Top 10 for LLM Applications, NIST AI 600-1.
