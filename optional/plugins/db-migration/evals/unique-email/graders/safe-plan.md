---
type: 'llm'
---

PASS if the reply checks for existing duplicate emails before adding the constraint, builds the index without a long lock (for example CREATE UNIQUE INDEX CONCURRENTLY), considers case-insensitive matching, and asks for approval before applying.
FAIL if it only adds a plain UNIQUE constraint.
