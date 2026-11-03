# Security policy

## Report a vulnerability

Report security problems privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability** ([direct link](https://github.com/nitinraturi/devbook.raturi.in/security/advisories/new)). Don't open a public issue, and don't include real secrets or personal data in the report.

You'll get an acknowledgement within 7 days. Once a fix is ready, it ships in a new version on `main` with a changelog entry, and the advisory is published with credit to you unless you prefer otherwise.

## What counts

- **The bootstrap prompt and the catalog** (`prompt/`, `catalog/`): a step that can be steered into installing from outside the allowlist, touching CI or deploy config, or reading secrets; or a catalog source that ships something malicious.
- **The core block and the optional skills** (`core/`, `optional/`): text that steers agents into insecure code.
- **Code that runs in a project**: the hooks the prompt writes and the scripts (`scripts/`).
- **The site** (devbook.raturi.in) and this repository's workflows.

## Supported versions

Only the latest version on `main` gets fixes. Re-run the bootstrap prompt to update; its Update mode shows what changed.
