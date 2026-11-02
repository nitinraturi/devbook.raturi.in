## Summary


## Evidence
- Primary source (for rule changes):
- Eval delta (`npm run evals:model -- --variant main,local`): pass rate main → local, mean tokens main → local
- Byte delta of changed instruction files:

## Checked against Devbook's own rules
- [ ] `npm run check` passes
- [ ] Core, security, testing
- [ ] Design (UI or styles changed)
- [ ] SEO: `skills/devbook-seo-audit/SKILL.md` run against `dist/` (pages, layouts, config or `public/` changed)
- [ ] Content (page text, guides or changelog changed)
- [ ] Rule IDs kept; removed IDs in `retiredRuleIds`; no budget raised without eval evidence
- [ ] `CHANGELOG.md` entry (shipped files changed); the Release workflow raises `VERSION` and promotes to `stable` after merge
