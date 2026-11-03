# Shrink devbook into one pinned bootstrap prompt

Plan adopted on 2026-11-03; it replaces `archive/refocus.md`. The plan is kept as written below, except that the draft prompt has been taken out, because the implemented prompt lives in `prompt/bootstrap.template.md`.

## Implementation notes (2026-11-03)

Where the implementation differs from the plan, and why:

- **Install ids checked against the live catalog.** `superpowers`, `cloudflare`, `expo`, `stripe`, `supabase`, `context7`, `frontend-design`, `security-guidance` and the LSP plugins are all in `claude-plugins-official`, which pins its third-party plugins by SHA. That settles the conflict over superpowers' id: it is `superpowers@claude-plugins-official`. The Vercel skill is `react-best-practices`, not `vercel-react-best-practices`. Astral's plugin is `astral@astral-sh`.
- **Not adopted, only suggested:** vintasoftware/django-ai-plugins (no licence file) and the Astro docs MCP (not updated since October 2025). **Retired:** the official `vercel` plugin, which manages deployments.
- **Not used in the prompt:** `codex plugin` commands, `npx skills` and `stripe agent setup`, because none of them could be confirmed. Non-Claude hosts use `gh skill install <repo> <skill> --pin <ref> --agent <host>`, checked against `gh skill install --help`. Gemini CLI reads `AGENTS.md` through `context.fileName`, confirmed in its docs.
- **Five optional skills, not four.** LLM feature security (the old SEC-25 and SEC-26) became `llm-security`, which the table below keeps as an opt-in extra.
- **Measured evals.** `claude plugin eval` loads no `AGENTS.md`, so `evals/` is a small plugin whose SessionStart hook injects the core block. The fixtures are dependency-free (Node, Python standard library, a static site) instead of Astro, Django and Next.js, because eval runs have no network to install packages. The suite has 10 core cases and one per optional skill. None has run yet, because running them spends usage.
- **Removed outright.** `instructions/`, `stacks/`, `skills/`, `templates/` and `kit/` are deleted. Old `.devbook/` installs that update their submodule lose their imports, links and kit hooks, so the changelog's Upgrade note tells them to paste the prompt, whose Update mode removes the old install.
- **mcp-scan** is in the prompt and in the drift pull request checklist, not in CI, because it would run an unpinned `@latest` package there.

## Summary

Devbook should stop writing and maintaining its own skill corpus and become a **single, copy-pasteable bootstrap prompt plus a small catalog of vetted upstream sources**. The prompt detects the agent host and the stack, plans and asks before writing anything, and merges a **~1.2 KB always-on "devbook core"** (the verify-and-report-honestly, no-commit/no-deploy, approval-gate and secrets guardrails) plus the repo's real build, test and lint commands into the user's `AGENTS.md`. It then installs at most three stack-relevant skills or plugins from an allowlist of vendor-official sources, pinned and scanned, and adds deterministic hooks where the host supports them. The rationale is evidence-based. Hand-written context files help only when they contain facts the agent cannot discover, while LLM-generated ones cut resolution rates and raise cost by about 20% ([arXiv 2602.11988](https://arxiv.org/html/2602.11988v1)). Curated skills help, but four or more skills drop the gain from about +18pp to +5.9pp, and software engineering gains least of any domain (+4.5pp) ([SkillsBench](https://arxiv.org/html/2602.12670v1)). Hooks are deterministic where instructions are only advisory ([Claude Code best practices](https://code.claude.com/docs/en/best-practices.md)). Five of devbook's eight skills and most of its kit already duplicate maintained official plugins or built-in commands. The two distribution skills (setup, upgrade) exist only because of the submodule model. The large maintainer machinery (manifest, budgets, 71 modelled evals, 57-source watcher, 2.9 MB of snapshots) is roughly ten times the size of what it ships, and it is still not switched on. The recommended direction: **keep** the core guardrails, the AGENTS.md skeleton, the writing discipline and a few domain skills with no maintained equivalent (API design, generic migrations, EARS feature docs, licensing) as opt-in extras. **Delegate** security, design, TDD/verification/planning, review, LSP diagnostics, stack knowledge and docs grounding to vendor sources. **Delete** the submodule, the Node link/verify scripts, the per-tool adapters, the Copilot instructions file, starter CI, the GA4 default and most of the source-snapshot apparatus.

## Devbook's value is its guardrails, not its procedures

Devbook ships 13 rule files (8,988 bytes always-on across `core.md`, `security.md` and `testing.md`), 8 stack notes and 8 `devbook-*` skills. They are installed as a git submodule at `.devbook/` and wired into each tool by `link.mjs`, which needs Node on the PATH and symlinks (Developer Mode on Windows). The skills are thin procedures that point back to rule IDs such as SEC-01. They are indexes into devbook's own text, not standalone units. **No measured evidence exists that agents follow the rules.** The committed evals are "modelled" only: 93% of tasks have the right rules reachable, which does not show the agent obeying them. Copilot, Cursor and Codex are "not yet tested", and Gemini CLI has no adapter at all.

What is distinctive and worth carrying forward is the opinion layer. CORE-01 says to run format, lint, typecheck, tests and build and show real output. CORE-02 says never weaken a check. CORE-03 says report partial work as partial. CORE-04 says never invent packages or APIs. CORE-05 says commit, push or deploy only when asked. CORE-06 requires human approval for auth, payments, migrations, secrets, infra and production data. CORE-08 says check versions in official docs. On top of these sit the deploy guarantee ("Never add, change or remove CI, git hooks, branch protection or deploy config unless the user asks") and the precedence rule that the user's request beats the project's AGENTS.md, which beats devbook. These map almost exactly onto what Anthropic says belongs in an always-on file: commands Claude cannot guess, repo etiquette and gotchas, each line passing the test "Would removing this cause Claude to make mistakes?" ([best practices](https://code.claude.com/docs/en/best-practices.md)). Compressed, they fit in 1–2 KB and need no submodule.

The ecosystem has also moved under devbook. **AGENTS.md is now a Linux Foundation (AAIF) standard** read natively by Codex, Cursor, Copilot, Windsurf, Zed and Amp ([AAIF](https://aaif.io/news/linux-foundation-announces-formation-of-aaif)). Claude Code reads it natively from v2.1.277, but only when no CLAUDE.md exists. A CLAUDE.md that imports `@AGENTS.md` loads both, on every version ([Claude Code memory docs](https://code.claude.com/docs/en/memory?r=0)). Agent Skills (SKILL.md) is an open standard with `.agents/skills/` as the emerging cross-tool path. Claude Code still reads only `.claude/skills/` ([GitHub Docs](https://docs.github.com/en/copilot/concepts/customizations/agent-skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/)). Installers such as `gh skill` (with `--pin` to a tag or SHA and tree-SHA provenance) and `npx skills` now do the per-agent path mapping that `link.mjs` was written for ([GitHub changelog](https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/), [Vercel docs](https://vercel.com/docs/agent-resources/skills)).

### Keep / delegate / delete, component by component

| Current component | Action | Maintained replacement | Notes |
|---|---|---|---|
| `core.md` (CORE-01–08, precedence) | **Keep, compress** to ~1.2 KB inline AGENTS.md block | none needed | This is the product. Drop CORE-14 (group-by-feature), CORE-19 (ADRs) and CORE-21 (Conventional Commits) from the default |
| `testing.md` | **Delegate**, keep one line ("failing test first") in core | `superpowers`; Claude Code bundled `/verify` | Superpowers is heavy for tiny edits, so make it opt-in |
| `security.md`, `security-web.md` | **Delegate**; keep secrets rule and gitignore in core | `security-guidance@claude-plugins-official` (hooks only); built-in `/security-review`; `trailofbits/skills` for audits | SEC-21–26 (LLM-feature security) has **no exact replacement**: keep as an opt-in extra |
| `performance.md` | **Delegate** per stack | Cloudflare `web-perf`; Vercel `react-best-practices` | No generic, stack-neutral replacement |
| `api-data.md` + `devbook-api-endpoint` | **Keep as opt-in skill** | none found | RFC 9457, idempotency, ETags |
| `database.md` + `devbook-db-migration` | **Keep a generic opt-in skill**, delegate where stack-specific | `supabase-postgres-best-practices` | No vendor-neutral replacement for expand/contract |
| `design.md` | **Delegate** | `frontend-design`; `web-design-guidelines` (vercel-labs) | |
| `seo.md` + `devbook-seo-audit` | **Delete** from default | no trusted vendor replacement | |
| `content.md` | **Delete** | none | Low code-quality relevance |
| `mobile.md` | **Delegate** | `expo@claude-plugins-official`; `swift-lsp` | |
| `licensing.md` | **Keep as opt-in skill** | none found | SPDX and asset licences |
| `feature-docs.md` + `devbook-feature-doc` | **Keep as opt-in skill** | OpenSpec for teams | |
| `devbook-security-review` | **Delete** | `/security-review` + security-guidance | |
| `devbook-release-check` | **Delete** | `/code-review` | Release gating sits too close to the deploy boundary |
| `devbook-setup`, `devbook-upgrade` | **Delete**, replaced by the bootstrap prompt and its Update mode | the prompt + `devbook.lock.json` | These existed only for the submodule |
| Kit: `block-git-push`, `protect-env`, `guard-rm` | **Replace** with host-native deny permissions or hooks the prompt writes | Claude Code PreToolUse exit-2 hooks | Hooks are deterministic ([hooks guide](https://code.claude.com/docs/en/hooks-guide.md)) |
| Kit: `check-version` SessionStart | **Delete** | lockfile + Update mode | |
| Kit: gitleaks pre-commit, commit-msg | **Delete** from default | | Git hooks are on devbook's own never-touch list |
| Kit: starter CI | **Delete** | none | Conflicts with "never touch CI/CD" |
| Stack notes | **Delegate** | vendor skills, docs MCPs, LSP plugins | No official Astro or Django skill exists |
| Stack note `ga4-consent` | **Delete**, with the GA4-by-default question | none | Unrelated to code quality |
| Templates `AGENTS.md`, `CLAUDE.md` | **Keep**, shrink | | The skeleton is the useful part |
| Copilot instructions, `.github/instructions/`, `.cursor/rules/` adapters | **Delete** | native AGENTS.md reading | |
| `devbook.manifest.json` | **Replace** with `catalog/sources.json` | | Keep a single budget: core ≤ 2 KB |
| `link.mjs`, `verify.mjs`, `compare.mjs`, `gitignore-secrets.mjs` | **Delete** | `gh skill`, `claude plugin` CLIs | Removes the Node requirement for users |
| Evals (71 modelled tasks) | **Replace** with 10–15 *measured* tasks | `claude plugin eval` with a no-plugin baseline ([plugin evals](https://code.claude.com/docs/en/plugin-evals.md)) | Measures what the modelled evals cannot |
| `sources.json`, watcher, `sources/snapshots/` | **Shrink** to the catalog's upstreams and primary docs; delete snapshots | weekly drift workflow | |
| `review.yml`, `digest.yml` | **Keep, retarget** at pin-bump PRs and eval results | `anthropics/claude-code-action` | Claude never merges |
| Planning docs | **Archive** | | |

## The bootstrap prompt is the product

The prompt runs in any agentic host and branches only where the hosts differ. It **embeds the allowlist instead of fetching it at runtime**, because remote instruction loading is one of the attack techniques Snyk documented, and it is mutable after publication ([Snyk ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)). It separates two trust tiers: Anthropic's official marketplace auto-updates by default ([install docs](https://code.claude.com/docs/en/plugins/install.md)), so it is recorded as a vendor channel, and every other source is pinned to a tag or SHA. It **caps optional skills at three**, because SkillsBench found 2–3 skills give +18.6pp while 4+ give only +5.9pp. Hook-only and LSP plugins don't count against the cap, since they add no skill descriptions.

Its outputs follow the evidence. The AGENTS.md block holds only non-discoverable facts and constraints; the paper behind that rule found that naming a tool raised its use from under 0.01 to about 1.6 calls per instance. Verification is pushed into commands and hooks instead of prose. The CLAUDE.md bridge avoids the trap where a CLAUDE.md silently suppresses AGENTS.md in Claude Code. The project-scope install lines deal with a real team gap: committing `enabledPlugins` turns a plugin on for collaborators but does not download it to their machines.

The implemented prompt is `prompt/bootstrap.template.md`.

## Vendors now maintain the stack knowledge devbook hand-wrote

Most platforms devbook covered now ship first-party skills, often bundled with a docs MCP as a plugin. That is better than a hand-written stack note, because it is version-matched and maintained by the people who change the platform. Vercel's own eval found a compressed docs index in AGENTS.md scored 100% while a docs skill scored 53%, because it was never invoked in 56% of cases ([Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)). Framework-managed AGENTS.md blocks therefore beat installing a docs skill, and the prompt preserves them. Anthropic also says CLI tools are the most context-efficient way to use external services, so docs MCPs stay optional.

`catalog/sources.json` records each source, its pinned ref and its status.

## A catalog and a weekly PR replace the maintainer machinery

Devbook now curates other people's work instead of authoring it. Its job reduces to four artifacts: the **core block** (`core/AGENTS.core.md`, ≤ 2 KB, the only budget left), the **catalog** (`catalog/sources.json`), the **generated prompt** (`prompt/bootstrap.md`) and a small `optional/` marketplace for the skills with no maintained equivalent. The site, the writing guide and the AGENTS.md writing discipline stay.

**Weekly**, a model-free drift workflow resolves each catalog entry's latest tag or SHA, confirms that official plugin ids still exist, and opens one PR per changed source. It never auto-merges. **Monthly**, the eval workflow runs `claude plugin eval` on the measured cases, each three times against a no-plugin baseline that reports a Δ. A source is kept only if its Δ is non-negative; if the base model passes without it, it is retired. **Quarterly**, the owner reviews the core block and catalog against the primary docs and prunes what no longer pays.

On the user side, `devbook.lock.json` gives "pinned, reviewed upgrades" a cheaper home than the submodule: re-running the prompt reads the lock, compares it with the catalog and proposes a diff.

## Risks and open questions

The largest risk is **supply chain**. In February 2026 Snyk found 13.4% of 3,984 skills from ClawHub and skills.sh had critical issues and confirmed 76 malicious payloads. The allowlist, pinning, preview and scan steps exist for this reason; even `gh skill` does not verify skills. The official marketplace auto-updates, so Claude Code users get vendor changes without a devbook PR in between; teams that need strict reproducibility can turn auto-update off.

The evidence that this approach improves code quality is modest, and the site says so. Software engineering saw the smallest skill gain of any SkillsBench domain, and 16 of 84 tasks got worse with skills. Developer-written context files helped every agent tested except Claude Code. No controlled study quantifies hooks against instruction compliance. The monthly measured eval is therefore the only way devbook can claim a benefit at all. Deleting devbook's own security, testing and design rules also deletes the SEC, TEST and DES rule IDs.

Still to check: whether Cursor, Copilot and Gemini expose deterministic pre-write hooks (the prompt falls back to the core block), whether cloud sessions load project plugins (Anthropic's install docs say they don't), and `codex plugin` commands. Trail of Bits skills are CC-BY-SA-4.0, so devbook links to them and never vendors modified copies.

## Conclusion

The shift is from **author to curator**. Devbook's defensible asset was never its roughly 51 KB of rule files. It was a judgement about what an agent must always be told (verify, report honestly, stay out of deploys, ask before risky changes) and the discipline to keep that judgement small. That judgement fits in about 1.2 KB of AGENTS.md. Vendors ship the stack knowledge, hooks enforce what prose could only ask for, and installers handle cross-tool mapping. Devbook's edge moves to **trust and restraint**: a small allowlist, pinned refs, a scan step, a cap of three optional skills and a refusal to touch CI/CD. The catalog's retirement column may end up being its most valuable public artifact.
