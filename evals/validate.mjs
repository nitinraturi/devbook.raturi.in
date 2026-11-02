// Validates the eval definitions without running anything: task fields, checks, rule signals and coverage.
// Coverage: every instruction file, every stack note a fixture loads, and every skill has at least
// MIN_TASKS tasks, counted from each task's `rules`, `covers`, `skill` and `skillNot`.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { here, loadFixture, repo } from './install.mjs';

export const MIN_TASKS = 3;

export async function loadSignals() {
	return JSON.parse(await readFile(join(here, 'rules.json'), 'utf8')).signals;
}

/** Map rule ID → { file, text } from the current instruction files. */
export async function currentRules() {
	const rules = new Map();
	for (const name of (await readdir(join(repo, 'instructions'))).filter((n) => n.endsWith('.md'))) {
		for (const line of (await readFile(join(repo, 'instructions', name), 'utf8')).split('\n')) {
			const id = line.match(/^- ([A-Z]+-\d+): /)?.[1];
			if (id) rules.set(id, { file: `instructions/${name}`, text: line });
		}
	}
	return rules;
}

const checkNames = (checks) => checks.flatMap((c) => [c.check, ...checkNames(c.checks ?? [])]);

export async function validate(tasks) {
	const errors = [];
	const ids = new Set();
	const checks = new Set((await readdir(join(here, 'checks'))).map((n) => n.replace(/\.mjs$/, '')));
	const signals = await loadSignals();
	const rules = await currentRules();
	const skills = (await readdir(join(repo, 'skills'))).filter((n) => n.startsWith('devbook-'));
	const coverage = new Map();
	const count = (key, id) => coverage.set(key, new Set([...(coverage.get(key) ?? []), id]));
	const fixtureStacks = new Set();

	for (const task of tasks) {
		const where = `tasks/${task.file}`;
		if (!task.id || `${task.id}.yaml` !== task.file) errors.push(`${where}: id must match the file name`);
		if (ids.has(task.id)) errors.push(`${where}: duplicate id`);
		ids.add(task.id);
		if (!task.prompt) errors.push(`${where}: missing prompt`);
		if (!task.behaviour) errors.push(`${where}: missing behaviour`);
		try {
			(await loadFixture(task.fixture)).stacks.forEach((s) => fixtureStacks.add(s));
		} catch {
			errors.push(`${where}: unknown fixture "${task.fixture}"`);
		}
		if (!task.checks?.length) errors.push(`${where}: needs at least one check`);
		for (const c of checkNames(task.checks ?? [])) if (!checks.has(c)) errors.push(`${where}: unknown check "${c}"`);
		if (!Array.isArray(task.rules))
			errors.push(`${where}: needs rules (the rule IDs it tests; [] for skill-only tasks)`);
		if (!task.touches?.length) errors.push(`${where}: needs touches (the files the task reads or edits)`);
		if (!task.rules?.length && !task.skill && !task.skillNot) errors.push(`${where}: tests no rule and no skill`);
		for (const id of [...(task.rules ?? []), ...(task.covers ?? [])]) {
			if (!signals[id]) errors.push(`${where}: ${id} has no signal in rules.json`);
			const file = id.includes('#') ? id.split('#')[0] : rules.get(id)?.file;
			if (!file) errors.push(`${where}: ${id} is not a current rule`);
			else count(file, task.id);
		}
		for (const skill of [task.skill, task.skillNot].filter(Boolean)) {
			if (!skills.includes(skill)) errors.push(`${where}: unknown skill "${skill}"`);
			count(`skills/${skill}`, task.id);
		}
	}

	// Each signal must still identify its rule in the current text, or the modelled coverage is wrong.
	for (const [id, signal] of Object.entries(signals)) {
		const re = new RegExp(signal, 'i');
		if (id.includes('#')) {
			const text = await readFile(join(repo, id.split('#')[0]), 'utf8').catch(() => '');
			if (!re.test(text)) errors.push(`rules.json: ${id} signal /${signal}/ no longer matches ${id.split('#')[0]}`);
		} else if (!rules.has(id)) errors.push(`rules.json: ${id} is not a current rule`);
		else if (!re.test(rules.get(id).text))
			errors.push(`rules.json: ${id} signal /${signal}/ no longer matches its rule`);
	}

	const instructionFiles = (await readdir(join(repo, 'instructions'))).filter((n) => n.endsWith('.md'));
	const wanted = [
		...instructionFiles.map((n) => `instructions/${n}`),
		...fixtureStacks,
		...skills.map((s) => `skills/${s}`),
	];
	// A pointer file that only links to its replacement has no rules to test.
	const pointer = async (key) =>
		key.startsWith('instructions/') && !(await readFile(join(repo, key), 'utf8')).match(/^- [A-Z]+-\d+: /m);
	for (const key of wanted) {
		const n = coverage.get(key)?.size ?? 0;
		if (n < MIN_TASKS && !(await pointer(key)))
			errors.push(`coverage: ${key} has ${n} task(s), needs at least ${MIN_TASKS}`);
	}
	for (const name of checks) await import(join(here, 'checks', `${name}.mjs`));
	return { errors, coverage };
}
