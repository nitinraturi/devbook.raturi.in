// Runs each hook the way Claude Code does: JSON on stdin, exit code 2 and stderr to block.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import assert from 'node:assert/strict';

// Outside the temp folder, because guard-rm allows deletes there.
const project = realpathSync(mkdtempSync(join(homedir(), '.devbook-hook-test-')));
after(() => rmSync(project, { recursive: true, force: true }));

const hook = (name, input) => {
	const result = spawnSync('node', [new URL(name, import.meta.url).pathname], {
		input: JSON.stringify({ cwd: project, hook_event_name: 'PreToolUse', ...input }),
		env: { ...process.env, CLAUDE_PROJECT_DIR: project },
		encoding: 'utf8',
	});
	return { code: result.status, stderr: result.stderr };
};
const bash = (name, command) => hook(name, { tool_name: 'Bash', tool_input: { command } });

const blocks = (result, pattern) => {
	assert.equal(result.code, 2, `expected a block, got exit ${result.code}`);
	assert.match(result.stderr, pattern);
};
const allows = (result) => assert.equal(result.code, 0, result.stderr);

test('block-git-push blocks pushes however they are written', () => {
	for (const command of [
		'git push',
		'git push origin main --force',
		'git -C app push',
		'git -c push.default=current push',
		'npm test && git push',
		'cd app; git push -u origin HEAD',
		'echo $(git push)',
		"bash -c 'git push'",
		'GIT_TRACE=1 git push',
		'sudo git push',
	]) {
		blocks(bash('block-git-push.mjs', command), /git push is for the user/);
	}
});

test('block-git-push allows other git commands', () => {
	for (const command of [
		'git status',
		'git commit -m "push the button"',
		'git log --grep=push',
		'echo git push',
		'git stash push',
	]) {
		allows(bash('block-git-push.mjs', command));
	}
});

test('protect-env blocks edits to .env files', () => {
	for (const tool_name of ['Edit', 'Write', 'MultiEdit']) {
		blocks(hook('protect-env.mjs', { tool_name, tool_input: { file_path: `${project}/.env` } }), /holds secrets/);
	}
	blocks(
		hook('protect-env.mjs', { tool_name: 'Write', tool_input: { file_path: `${project}/app/.env.local` } }),
		/\.env\.local/,
	);
	for (const command of [
		'echo KEY=1 >> .env',
		'printf x > config/.env.production',
		'sed -i "" s/a/b/ .env',
		'cp .env.example .env',
		'mv .env .env.bak',
		'rm .env',
		'echo x | tee .env',
	]) {
		blocks(bash('protect-env.mjs', command), /holds secrets/);
	}
});

test('protect-env allows templates and reads', () => {
	allows(hook('protect-env.mjs', { tool_name: 'Edit', tool_input: { file_path: `${project}/.env.example` } }));
	allows(hook('protect-env.mjs', { tool_name: 'Write', tool_input: { file_path: `${project}/src/env.ts` } }));
	for (const command of [
		'cat .env.example',
		'cp .env.example .env.sample',
		'grep KEY .env.example',
		'ls -a',
		'npm run build 2>&1',
	]) {
		allows(bash('protect-env.mjs', command));
	}
});

test('guard-rm blocks recursive rm outside the project', () => {
	for (const command of [
		'rm -rf /',
		'rm -rf ~',
		'rm -rf ~/Documents',
		'rm -r ..',
		'rm -fr ../other-project',
		'rm --recursive /etc',
		`rm -rf ${project}`,
		'cd .. && rm -rf build',
		'rm -rf /usr/local/*',
		'sudo rm -Rf /var/lib',
		"sh -c 'rm -rf /opt'",
		'rm -rf -- /srv',
	]) {
		blocks(bash('guard-rm.mjs', command), /not inside the project/);
	}
	blocks(bash('guard-rm.mjs', 'rm -rf $BUILD_DIR/'), /uses a variable/);
});

test('guard-rm allows deletes inside the project and in temp folders', () => {
	for (const command of [
		'rm -rf node_modules dist',
		'rm -rf ./build/*',
		`rm -rf ${project}/coverage`,
		'cd app && rm -rf .next',
		`rm -rf ${join(tmpdir(), 'scratch')}`,
		'rm -rf /tmp/devbook-test',
		'rm .env.tmp ../notes.txt',
		'git rm -r --cached dist',
	]) {
		allows(bash('guard-rm.mjs', command));
	}
});

test('hooks report broken input without blocking', () => {
	const result = spawnSync('node', [new URL('guard-rm.mjs', import.meta.url).pathname], {
		input: 'not json',
		encoding: 'utf8',
	});
	assert.equal(result.status, 1);
	assert.match(result.stderr, /could not read its input/);
});

test('the example settings run every hook script, and each script exists', () => {
	const settings = JSON.parse(readFileSync(new URL('../settings.json', import.meta.url), 'utf8'));
	const scripts = settings.hooks.PreToolUse.flatMap((group) =>
		group.hooks.map((h) => h.command.match(/hooks\/([\w-]+\.mjs)/)[1]),
	);
	for (const name of scripts) assert.ok(existsSync(new URL(name, import.meta.url)), name);
	assert.deepEqual([...new Set(scripts)].sort(), ['block-git-push.mjs', 'guard-rm.mjs', 'protect-env.mjs']);
});
