# devbook.raturi.in

The engineering playbook for building software with LLM assistants (Claude, Copilot and similar): universal rules, stack profiles, templates, prompts and checklists. It is both:

1. **A public site** at `https://devbook.raturi.in`, built with Astro Starlight.
2. **A versioned standard** that every project pins and follows.

> **Golden rule:** rules live here once. Projects reference a pinned version of this repo and only write down what is unique to them.

---

## The three layers

| Layer | Lives in | Changes | Examples |
|---|---|---|---|
| 1. Universal | this repo, `src/content/docs/` (all sections except `stacks/`) | Rarely | Workflow, security, testing, SEO, content, evidence |
| 2. Stack profiles | this repo, `src/content/docs/stacks/` | When a tool changes | Astro, Cloudflare, TypeScript, GA4, Django |
| 3. Project | each project repo, `docs/` | Constantly | Design tokens, taxonomy, research docs, domain rules |

**Precedence:** project rules override stack rules, which override universal rules.
A project may **tighten** any rule freely. It may **loosen** a security, privacy, accessibility, quality or honesty rule only with a written ADR.

## Repo map

```
devbook.raturi.in/
├── README.md                 ← you are here
├── AGENTS.md                 ← instructions for an AI agent working ON this repo
├── CLAUDE.md                 ← points to AGENTS.md
├── BUILD-PROMPT.md           ← the prompt the Starlight site was built from
├── DEPLOY.md                 ← Cloudflare deploy, custom domain, releases
├── wrangler.jsonc            ← Worker config (static assets only)
├── CHANGELOG.md
├── .github/                  ← copilot-instructions.md, workflows/ci.yml
├── docs/                     ← adr/ (site decisions), TODO.md (owner tasks, known gaps)
├── astro.config.mjs          ← Starlight config: sidebar, plugins, overrides
├── public/                   ← _headers (CSP), robots.txt, favicon, OG image
├── scripts/                  ← post-build CSP + HTML fixes, checks, local server
├── tests/e2e/                ← Playwright smoke + axe
├── templates/                ← raw files copied INTO projects (AGENTS.md, brief, spec, ADR…)
├── src/components/           ← Starlight overrides: Head (JSON-LD, GA), PageTitle, Footer
├── src/lib/                  ← site constants, JSON-LD graph
└── src/content/docs/         ← every guide; each file becomes a page on the site
    ├── index.mdx             ← home page
    ├── start-here/           ← how to use the devbook, adopt it in a project
    ├── workflow/             ← the LLM-assisted development loop
    ├── engineering/          ← design principles, structure, code, APIs, data, reliability
    ├── security/             ← baseline, supply chain, LLM app security, privacy
    ├── quality/              ← testing, performance, accessibility, CI/CD
    ├── web/                  ← SEO, structured data, IA, content, evidence
    ├── llm-features/         ← building products that call an LLM; evals
    ├── platforms/            ← mobile
    ├── stacks/               ← stack profiles
    ├── templates/            ← site pages that render /templates/*.md
    ├── prompts/              ← copy-paste prompt library
    └── checklists/           ← pre-commit, pre-release, launch, security review
```

## Using it in a project

```bash
# in the project repo
git submodule add https://github.com/<you>/devbook.raturi.in docs/devbook
cd docs/devbook && git checkout v1.0.0 && cd ../..
cp docs/devbook/templates/AGENTS.md ./AGENTS.md   # then fill it in
cp docs/devbook/templates/CLAUDE.md ./CLAUDE.md
```

Full steps: `src/content/docs/start-here/adopt-in-a-project.md`.

## Versioning

- Semantic versions, tagged: `v1.0.0`.
- **Major:** a rule changes in a way that can fail an existing project's checks.
- **Minor:** new rule, page, stack profile or template.
- **Patch:** wording, links, typos, re-verification dates.
- Every release gets a `CHANGELOG.md` entry. Projects upgrade by deliberate PR.

## Building the site

Astro + Starlight, static output, hosted on Cloudflare Workers static assets (`npm run deploy`).

```bash
npm ci
npm run dev          # local preview
npm run check        # typecheck, descriptions, contrast, build, Playwright + axe
npm run lhci         # Lighthouse budgets
```

Every page also has its source served as Markdown at `<page>/index.md`. `/llms.txt`, `/llms-full.txt` and `/llms-small.txt` are generated at build time. Deployment: `DEPLOY.md`. Site decisions: `docs/adr/`.

## Ownership

Author and maintainer: Nitin Raturi. Time-sensitive pages carry a `lastVerified` date and are re-checked at least every 6 months.
