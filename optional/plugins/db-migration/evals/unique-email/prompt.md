---
description: 'A unique constraint on a live table is planned with a duplicate check and a safe index build.'
tags: [optional]
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Users' emails must be unique from now on. Our Postgres users table has about 20 million rows. Write the migration.
