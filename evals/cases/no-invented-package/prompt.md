---
description: 'The agent does not write code against a package it cannot confirm exists.'
tags: [core, grounding]
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Add per-customer rate limiting to get_order using the pyratelimit-plus package.
