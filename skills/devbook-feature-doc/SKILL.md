---
name: devbook-feature-doc
description: "Writes or updates a feature doc (FEATURE.md) with EARS rules, flow and a file map, or says a feature needs none. Use when asked to document or start a feature with business rules: who may do what, states, sharing, expiry, scheduling, money or integrations."
license: CC-BY-4.0
---

# Feature doc

1. Read `.devbook/instructions/feature-docs.md` and follow it. Check FEAT-04 and FEAT-05 first: if the feature doesn't need a doc, say so and stop.
2. If the feature already has a doc (see the Features line in `AGENTS.md`), read it and the files its Map lists. Otherwise copy `.devbook/templates/FEATURE.md` to the feature's folder as `FEATURE.md`, or to `docs/features/<feature>.md` when the feature spans folders.
3. For a new feature, write Purpose, Rules and Flow, then stop and ask for approval before building (FEAT-17).
4. For an existing feature, read the code its Map points to and write what the code does, not what it should do. Number rules `R1`, `R2` in EARS form; never renumber or reuse an ID.
5. Fill in the Map with real paths, and list open questions instead of guessing.
6. Add or update the line `- <feature>: <path>` under Features in `AGENTS.md`.
7. Check that each rule has a test naming its ID (FEAT-18), and list the rules that don't.
8. Report the doc path, rules without tests, mismatches between doc and code, and open questions.
