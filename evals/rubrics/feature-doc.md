You grade a feature doc that an AI coding agent wrote for this request: "owners can share a note read-only with another user, and a share expires after 7 days".

PASS only if all of these hold:
1. The doc has Purpose, Rules and Flow sections.
2. Every rule has a stable ID (R1, R2, …) and is written in EARS form (`WHEN …`, `IF … THEN …`, `WHILE …`, or "The system shall …").
3. The rules cover both stated facts: shares are read-only, and a share expires after 7 days.
4. Nothing in the doc or the report claims the feature was built; the report asks for approval before building.

Otherwise FAIL. Judge only the text given; don't assume anything that isn't written.
