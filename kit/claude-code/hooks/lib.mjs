// Shared helpers for the Devbook PreToolUse hooks. No dependencies, so the hooks run with plain Node.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, resolve, sep } from 'node:path';

/** Read the hook input JSON from stdin. */
export const readInput = () => JSON.parse(readFileSync(0, 'utf8') || '{}');

/** Block the tool call: exit code 2 shows stderr to the agent as the reason. */
export const block = (message) => {
	process.stderr.write(`Blocked by the Devbook kit: ${message}\n`);
	process.exit(2);
};

/** Run a hook, reporting broken input as a non-blocking error (exit 1) instead of crashing silently. */
export const run = (check) => {
	let input;
	try {
		input = readInput();
	} catch (error) {
		process.stderr.write(`Devbook hook could not read its input: ${error.message}\n`);
		process.exit(1);
	}
	check(input);
	process.exit(0);
};

const SEPARATORS = new Set([';', '&', '|', '\n', '(', ')', '`']);
const REDIRECTS = ['>>', '>|', '>&', '&>', '>'];

/**
 * Split a shell command into simple commands, each a list of words.
 * Best effort: handles quotes, escapes, `;`, `&&`, `||`, `|`, `$( )`, backticks and `>` redirects
 * (a redirect becomes its own word). It does not expand variables or globs.
 */
export const splitCommand = (command) => {
	const segments = [];
	let words = [];
	let word = '';
	let inWord = false;
	let quote = '';
	const endWord = () => {
		if (inWord) words.push(word);
		word = '';
		inWord = false;
	};
	const endSegment = () => {
		endWord();
		if (words.length) segments.push(words);
		words = [];
	};
	for (let i = 0; i < command.length; i++) {
		const c = command[i];
		if (quote) {
			if (c === quote) quote = '';
			else if (c === '\\' && quote === '"' && i + 1 < command.length) word += command[++i];
			else word += c;
			continue;
		}
		if (c === "'" || c === '"') {
			quote = c;
			inWord = true;
		} else if (c === '\\' && i + 1 < command.length) {
			word += command[++i];
			inWord = true;
		} else if (c === '$' && command[i + 1] === '(') {
			endSegment();
			i++;
		} else if (c === '>' || (c === '&' && command[i + 1] === '>')) {
			const op = REDIRECTS.find((r) => command.startsWith(r, i));
			if (/^\d+$/.test(word)) word = ''; // "2>" redirects a file descriptor
			endWord();
			words.push(op);
			i += op.length - 1;
		} else if (SEPARATORS.has(c)) {
			endSegment();
		} else if (c === ' ' || c === '\t') {
			endWord();
		} else {
			word += c;
			inWord = true;
		}
	}
	endSegment();
	return segments;
};

const WRAPPERS = new Set(['sudo', 'command', 'exec', 'nohup', 'time', 'env', 'xargs', 'doas']);
const SHELLS = new Set(['sh', 'bash', 'zsh', 'dash']);

/** Drop leading `VAR=value` assignments and wrappers such as `sudo` or `env`, so words[0] is the real program. */
const unwrap = (words) => {
	let i = 0;
	while (i < words.length) {
		if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[i])) i++;
		else if (WRAPPERS.has(words[i])) {
			i++;
			while (i < words.length && words[i].startsWith('-')) i++;
		} else break;
	}
	return words.slice(i);
};

/**
 * Every simple command in a shell string, unwrapped, with the working directory it runs in.
 * Follows `cd <dir>` between commands and looks inside `sh -c '...'` and `eval`.
 */
export const commands = (command, cwd) => {
	const out = [];
	let dir = cwd;
	for (const raw of splitCommand(command)) {
		const words = unwrap(raw);
		if (!words.length) continue;
		const [program, ...args] = words;
		if (SHELLS.has(basename(program)) && args.includes('-c')) {
			const script = args[args.indexOf('-c') + 1];
			if (script) out.push(...commands(script, dir));
			continue;
		}
		if (program === 'eval') {
			out.push(...commands(args.join(' '), dir));
			continue;
		}
		if (program === 'cd' && args[0] && !/[$`*?]/.test(args[0])) dir = resolvePath(args[0], dir);
		out.push({ words, cwd: dir });
	}
	return out;
};

/** Resolve a path the way the shell would see it: `~` is home, relative paths start at cwd. */
export const resolvePath = (path, cwd) => {
	if (path === '~' || path.startsWith('~/')) path = join(homedir(), path.slice(1));
	return isAbsolute(path) ? resolve(path) : resolve(cwd, path);
};

/** Resolve symlinks in the longest existing part of a path, so /tmp and /private/tmp compare equal. */
export const realish = (path) => {
	let head = path;
	const tail = [];
	while (!existsSync(head) && dirname(head) !== head) {
		tail.unshift(basename(head));
		head = dirname(head);
	}
	try {
		head = realpathSync(head);
	} catch {
		// keep the unresolved path
	}
	return join(head, ...tail);
};

/** True when `path` is strictly inside `root` (not the root itself). */
export const isInside = (path, root) => path.startsWith(root.endsWith(sep) ? root : root + sep);
