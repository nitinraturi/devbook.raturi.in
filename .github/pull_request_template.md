## Summary


## Evidence
- Primary source (for core, prompt, catalog or skill changes):
- Measured eval (`node evals/run.mjs`, only with the owner's approval): core score and mean Δ before → after, or "not run"
- Core block size (`npm run check:prompt`):

## Checked
- [ ] `npm run check` passes
- [ ] The core block stays under 2 KB and every line passes the deletion test
- [ ] New catalog sources are vendor-maintained, pinned and read in full at the pinned ref
- [ ] Page text follows the writing guide (pages, guides or changelog changed)
- [ ] `CHANGELOG.md` entry (shipped files changed); the Release workflow raises `VERSION` after merge
