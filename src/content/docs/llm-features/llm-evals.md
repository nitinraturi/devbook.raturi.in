---
title: LLM evals
description: Golden datasets, automated checks and model-graded scoring with its caveats, regression evals in CI on every prompt or model change, and production feedback loops.
sidebar:
  order: 2
---

Without evals, every prompt or model change is a guess. Evals turn "it seems better" into a number you can track.

## Rules

### Dataset
- Build a **golden set** before shipping: real or realistic inputs with expected outputs or grading criteria. Start with 30–100 cases covering common, edge, adversarial (including prompt injection) and "should refuse or say unknown" cases.
- Store it in the repo with a version. Never include real personal data without consent and anonymisation.
- Add every reported production failure as a new case.

### Scoring
- Prefer **deterministic checks** where possible: schema validity, exact or normalised match, required fields present, citations point to real retrieved chunks, banned content absent.
- Use **model-graded scoring** only for qualities code cannot check (helpfulness, tone, faithfulness), with a written rubric. Spot-check a sample by hand each run; model graders can be biased toward longer or more confident answers.
- Track latency and cost per case alongside quality.

### Process
- Evals run in CI on any change to prompts, model IDs, parameters, retrieval or tools.
- A change that lowers the score beyond a set tolerance fails the check unless a human accepts it with a reason.
- Keep a results history so trends are visible.

### Production
- Sample real traffic (with consent and privacy controls) for periodic human review.
- Monitor refusal rate, error rate, latency, cost and user feedback.

## Checklist
- [ ] Golden set covering normal, edge, adversarial and unknown cases
- [ ] Deterministic checks first; rubric for model grading
- [ ] Evals gate prompt/model changes in CI
- [ ] Production feedback added to the set
