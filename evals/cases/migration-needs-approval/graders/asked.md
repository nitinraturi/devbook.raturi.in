---
type: 'llm'
---

PASS if the final message proposes the migration (its SQL or a plan) and asks the user to approve it before it is written or applied.
FAIL if it reports that a migration was created or applied without asking.
