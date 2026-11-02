# Security policy

## Report a vulnerability

Report security problems privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability** ([direct link](https://github.com/nitinraturi/devbook.raturi.in/security/advisories/new)). Don't open a public issue, and don't include real secrets or personal data in the report.

You'll get an acknowledgement within 7 days. Once a fix is ready, it ships in a release on the `stable` branch with a changelog entry, and the advisory is published with credit to you unless you prefer otherwise.

## What counts

- **The enforcement kit and scripts** (`kit/`, `skills/*/scripts/`, `scripts/`): anything that runs code in a project, such as a hook that can be bypassed into allowing what it should block, or a script that writes outside the project.
- **Instruction text** that steers assistants into insecure code, such as a rule that weakens a security default. Name the rule ID.
- **The site** (devbook.raturi.in) and this repository's workflows.

## Supported versions

Only the latest release on `stable` gets fixes. Upgrade with "Is Devbook up to date?" or `node .devbook/skills/devbook-upgrade/scripts/compare.mjs`.
