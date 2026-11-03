// The homepage's facts, in one place for its components and its Markdown endpoint. The prompt, the core block and
// the version are read from the repository at build time, so the page can't drift from what ships.
import prompt from '../../prompt/bootstrap.md?raw';
import core from '../../core/AGENTS.core.md?raw';
import version from '../../VERSION?raw';

export const VERSION = version.trim();
export const PROMPT = prompt;
export const promptLines = prompt.trimEnd().split('\n').length;

/** The core block's rules, one per line, without the heading. */
export const coreLines = core
	.split('\n')
	.filter((l) => l.startsWith('- '))
	.map((l) => l.slice(2));
export const coreBytes = new TextEncoder().encode(core).length;
export const CORE = core;

export const stats = [
	{ label: 'Always loaded', value: `${(coreBytes / 1000).toFixed(1)} KB` },
	{ label: 'Skills added', value: '3 at most' },
	{ label: 'Commits, CI, deploys', value: 'Never' },
];

/** The prompt's phases. `gate` marks the one approval: nothing is written before it. */
export const phases = [
	{ title: 'Detect', text: 'Reads your stack and runs your commands once. Writes nothing.' },
	{ title: 'Plan and ask', text: 'One table of files, skills and hooks. Waits for your yes.', gate: true },
	{ title: 'AGENTS.md', text: 'Merges the core block and your real commands between markers.' },
	{ title: 'Bridges', text: 'CLAUDE.md or Gemini settings, only for agents you use.' },
	{ title: 'Install', text: 'Up to 3 allowlisted skills, pinned and read first.' },
	{ title: 'Checks', text: 'Permission rules and hooks where your agent has them.' },
	{ title: 'Record', text: 'Writes devbook.lock.json and reports. You commit.' },
];

export type Support = 'Yes' | 'Enforced' | 'Free' | 'No';
export interface AgentRow {
	support: Support;
	what: string;
	how: string;
}

const skills = (where: string): AgentRow => ({
	support: 'Yes',
	what: 'Up to 3 pinned skills',
	how: `In ${where}, pinned to a tag or commit.`,
});
const noHooks: AgentRow = {
	support: 'No',
	what: 'Permission rules and hooks',
	how: 'Not set up by Devbook; the core block asks instead.',
};

/** What each agent gets from the prompt (setup.mdx, "What each agent loads", has the file details). */
export const agents: { id: string; name: string; rows: AgentRow[] }[] = [
	{
		id: 'claude-code',
		name: 'Claude Code',
		rows: [
			{
				support: 'Yes',
				what: 'Core block and your commands',
				how: 'Read from CLAUDE.md, which starts with @AGENTS.md.',
			},
			skills('project plugins or .claude/skills/'),
			{
				support: 'Enforced',
				what: 'Permission rules and hooks',
				how: 'git push and .env reads are blocked; a hook stops edits to CI and deploy paths.',
			},
			{
				support: 'Free',
				what: 'Security warnings and a language server',
				how: 'security-guidance and an LSP plugin; neither counts toward the cap of three.',
			},
		],
	},
	...['Codex', 'Cursor', 'GitHub Copilot'].map((name) => ({
		id: name.toLowerCase().replace(/\s+/g, '-'),
		name,
		rows: [
			{ support: 'Yes' as Support, what: 'Core block and your commands', how: 'Read from AGENTS.md directly.' },
			skills('.agents/skills/, installed with gh skill'),
			noHooks,
		],
	})),
	{
		id: 'gemini-cli',
		name: 'Gemini CLI',
		rows: [
			{
				support: 'Yes',
				what: 'Core block and your commands',
				how: 'AGENTS.md is added to context.fileName in .gemini/settings.json.',
			},
			skills('.agents/skills/, installed with gh skill'),
			noHooks,
		],
	},
];
