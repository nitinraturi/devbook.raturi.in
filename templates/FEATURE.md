# <Feature name>

<!-- Follow .devbook/instructions/feature-docs.md. Delete these comments and any optional section you don't need. -->

<One or two sentences: what the feature does, for whom, and why.>

## Map
- `<path>`: <one-line role, for example "pure invoice totals">
- Data: `<table or model>`: <what it stores>
- Entry points: `<route, command, event or job>`
- Tests: `<path>`

## Rules
- R1: WHEN <trigger>, the system SHALL <response>.
- R2: WHILE <state>, the system SHALL <response>.
- R3: IF <unwanted event>, THEN the system SHALL <response>.
- R4: WHERE <variant or plan>, the system SHALL <response>.

## Flow
1. <first step of the main path>
2. <next step>

States (optional): `<state>` → `<state>` → `<state>` | `<state>`

## Decisions (optional)
- <choice>: <why, in one line> (<ADR link>)

## Out of scope (optional)
- <deliberately not handled>

## Open questions (optional)
- <question, and who decides>
