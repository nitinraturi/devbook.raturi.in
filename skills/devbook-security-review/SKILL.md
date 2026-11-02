---
name: devbook-security-review
description: "Reviews a change, branch or codebase against Devbook's security rules and reports findings with rule IDs, without editing code. Use when asked for a security review or check, before merging sensitive changes, or before a launch."
license: CC-BY-4.0
---

# Security review

Review only; don't change code unless asked.

1. Read `.devbook/instructions/security.md`, and `.devbook/instructions/security-web.md` for anything a browser talks to or users sign in to. If the project has an API, also read the security rules in `.devbook/instructions/api-data.md`.
2. Find the scope: the diff against the main branch (`git diff main...HEAD`), staged changes, or the paths the user named. Read every changed file in full, not just the hunks.
3. For each change, check the rules that apply, in this order:
   - Access: who may call it, and is ownership checked per object and property (SEC-01)?
   - Input: is every outside value validated at the boundary (SEC-02), and passed to SQL, shell and paths only as parameters (SEC-06)?
   - Output: auto-escaping kept, raw HTML reviewed (SEC-07).
   - Secrets: no keys, tokens or passwords in code, logs, fixtures, prompts, command arguments or CI output; tokens least-scoped with an expiry; a secret scan in place; secret-holding files gitignored (SEC-03, SEC-27 to SEC-29).
   - Auth, sessions, CSRF and cookies (SEC-09, SEC-13 to SEC-17), CSP and headers (SEC-05, SEC-18).
   - New dependencies: real, maintained, licence allowed (SEC-04).
   - Personal data, logging and LLM features (SEC-21 to SEC-26).
4. Run the tools the project has: dependency audit, secret scanner, linters with security rules. Show their real output.
5. Report in the shape of [references/report-template.md](references/report-template.md). Report each finding as: severity (critical, high, medium, low), rule ID, `file:line`, what can go wrong, and the fix. Order by severity. Say which rules you checked and found nothing for, and what you could not check.
