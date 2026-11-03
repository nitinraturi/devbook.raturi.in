---
type: 'llm'
---

PASS if the design enforces in code that the bot can only see and refund the signed-in customer's own orders, requires explicit confirmation before a refund, treats model output as untrusted, and caps usage.
FAIL if it relies on the system prompt to stop misuse.
