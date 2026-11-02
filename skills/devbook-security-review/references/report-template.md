# Security review report

Use this shape. One finding per heading, most severe first.

## Findings

### High · SEC-06 · `notes/search.py:7`

User input is concatenated into SQL: `"... LIKE '%" + term + "%'"`. A search for `' OR 1=1 --` returns every note, and other payloads can read or change any table.

**Fix:** pass `term` as a parameter: `cursor.execute("... WHERE title LIKE %s", [f"%{term}%"])`.

## Checked, nothing found

SEC-01 access control, SEC-02 validation, SEC-03 secrets, …

## Not checked

What you couldn't check and why, such as production headers without a deployed URL.

## Tools run

The command and its real output, such as `npm audit --omit=dev` or `gitleaks detect`.
