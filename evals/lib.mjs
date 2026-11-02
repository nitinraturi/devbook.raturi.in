// Shared helpers for run.mjs and the checks: shell commands, transcript parsing and file search.
import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

/** Run a shell command in `cwd`. Resolves with { code, stdout, stderr }; never rejects on a non-zero exit. */
export function sh(command, { cwd, env, timeoutMs = 10 * 60_000, input } = {}) {
	return new Promise((resolve) => {
		const child = spawn(command, { cwd, env: { ...process.env, ...env }, shell: true });
		let stdout = '';
		let stderr = '';
		const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
		child.stdout.on('data', (d) => (stdout += d));
		child.stderr.on('data', (d) => (stderr += d));
		child.on('close', (code) => {
			clearTimeout(timer);
			resolve({ code: code ?? 1, stdout, stderr });
		});
		if (input !== undefined) child.stdin.end(input);
		else child.stdin.end();
	});
}

const WRITE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);

/**
 * Parse a Claude Code `--output-format stream-json` transcript.
 * Returns the tool calls in order (main conversation and subagents), the Bash commands,
 * the final result event and its text.
 */
export function parseTranscript(text) {
	const events = text
		.split('\n')
		.filter((line) => line.trim())
		.map((line) => {
			try {
				return JSON.parse(line);
			} catch {
				return { type: 'unparsed', line };
			}
		});
	const toolUses = [];
	for (const event of events) {
		if (event.type !== 'assistant') continue;
		for (const block of event.message?.content ?? []) {
			if (block.type === 'tool_use') toolUses.push({ name: block.name, input: block.input ?? {} });
		}
	}
	const result = events.findLast((e) => e.type === 'result') ?? null;
	return {
		events,
		toolUses,
		bashCommands: toolUses.filter((t) => t.name === 'Bash').map((t) => String(t.input.command ?? '')),
		writes: toolUses.filter((t) => WRITE_TOOLS.has(t.name)),
		result,
		finalText: typeof result?.result === 'string' ? result.result : '',
	};
}

const SKIP_DIRS = new Set(['.git', 'node_modules', '.venv', '__pycache__', 'dist', '.astro']);

/** Every file under `dir` except dependency, build and VCS folders, as paths relative to `dir`. */
export async function listFiles(dir) {
	const out = [];
	for (const entry of await readdir(dir, { recursive: true, withFileTypes: true })) {
		if (!entry.isFile()) continue;
		const rel = relative(dir, join(entry.parentPath, entry.name));
		if (rel.split('/').some((part) => SKIP_DIRS.has(part))) continue;
		out.push(rel);
	}
	return out.sort();
}

export async function readText(path) {
	try {
		return await readFile(path, 'utf8');
	} catch {
		return null;
	}
}

export const pass = (detail = '') => ({ pass: true, detail });
export const fail = (detail) => ({ pass: false, detail });
