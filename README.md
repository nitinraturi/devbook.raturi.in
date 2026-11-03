# Devbook

One bootstrap prompt that sets up a repository for careful agent coding. Paste it into Claude Code, Codex, Cursor, GitHub Copilot or Gemini CLI. The agent detects your stack, shows a plan, writes a 1 KB core block and your real commands into `AGENTS.md`, installs at most three pinned skills from the vendors who maintain them, and adds hooks where it can. It never touches CI or deploys, and it never commits. Site: https://devbook.raturi.in

## Use it

Copy the prompt from https://devbook.raturi.in/ (or [`prompt/bootstrap.md`](prompt/bootstrap.md)) and paste it into your agent in the repository. Re-run it to update: it reads `devbook.lock.json` and shows a diff. Projects on the old `.devbook/` submodule move over with the same prompt; see [Setup](https://devbook.raturi.in/start-here/setup/).

## What is in this repository

| Path | What it is |
|---|---|
| `core/AGENTS.core.md` | The core block: the only always-loaded part, at most 2 KB |
| `catalog/sources.json` | The allowlist: every upstream skill, plugin and docs MCP the prompt may install, pinned, with its status |
| `prompt/` | The prompt template and the generated `bootstrap.md` (`npm run prompt`) |
| `optional/`, `.claude-plugin/` | Devbook's own opt-in skills, as a plugin marketplace: api-design, db-migration, feature-doc, licensing, llm-security |
| `evals/` | Measured evals with `claude plugin eval`, with and without Devbook |
| `src/` | The Starlight site |

## Develop

Requires Node.js 22 or later; CI uses the version in `.nvmrc`.

```bash
npm ci
npm run dev
npm run check
```

Contributor rules are in [`AGENTS.md`](AGENTS.md), and every change to the core block or the prompt follows the [writing guide](src/content/docs/start-here/writing-instructions.md). Deployment and releases are in [`DEPLOY.md`](DEPLOY.md), and changes are in [`CHANGELOG.md`](CHANGELOG.md).

## License

- The optional skills in `optional/` and the site's guides in `src/content/docs/start-here/`: [CC BY 4.0](LICENSE-CC-BY-4.0). Reuse and change them with credit.
- The prompt, the core block, the catalog, the scripts, the evals and the site code: [MIT No Attribution (MIT-0)](LICENSE). No notice needed.

See the [license page](https://devbook.raturi.in/license/) for how to give credit.
