# Release check report

Use this shape. Start with the decision.

## No-go

Blocking:

- **CORE-01** · `npm test` fails: `notes.test.js › rejects empty titles` (expected 400, got 500). Fix the cause before release; don't skip the test (CORE-02).

Not blocking:

- **CORE-18** · The changelog has no entry for the search endpoint.

## Checks run

| Check | Command | Result |
|---|---|---|
| Tests | `npm test` | 1 failed, 41 passed |

## Draft release notes

From the changelog entries since the last tag.
