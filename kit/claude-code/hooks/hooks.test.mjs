// Runs each hook the way Claude Code does: JSON on stdin, exit code 2 and stderr to block.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, test } from 'node:test';
import { compareVersions } from './lib.mjs';
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
	const scripts = Object.values(settings.hooks)
		.flat()
		.flatMap((group) => group.hooks.map((h) => h.command.match(/hooks\/([\w-]+\.mjs)/)[1]));
	for (const name of scripts) assert.ok(existsSync(new URL(name, import.meta.url)), name);
	assert.deepEqual([...new Set(scripts)].sort(), [
		'block-git-push.mjs',
		'check-version.mjs',
		'guard-rm.mjs',
		'protect-env.mjs',
	]);
});

test('compareVersions orders version numbers', () => {
	assert.ok(compareVersions('2026.11.02', '2026.11.10') < 0);
	assert.ok(compareVersions('2026.11.02.1', '2026.11.02') > 0);
	assert.ok(compareVersions('2026.11.02.10', '2026.11.02.9') > 0);
	assert.ok(compareVersions('2026.11.02.1', 'v2026.11.02') > 0);
	assert.equal(compareVersions('2026.12.01', '2026.12.01'), 0);
});

describe('check-version', () => {
	// A local VERSION file stands in for main, so the test needs no network.
	const root = realpathSync(mkdtempSync(join(tmpdir(), 'devbook-version-')));
	after(() => rmSync(root, { recursive: true, force: true }));
	const upstream = join(root, 'VERSION');
	writeFileSync(upstream, '2026.11.02.1\n');

	let n = 0;
	const run = (project, source, cache) =>
		spawnSync('node', [new URL('check-version.mjs', import.meta.url).pathname], {
			env: {
				...process.env,
				CLAUDE_PROJECT_DIR: project,
				DEVBOOK_VERSION_SOURCE: source,
				DEVBOOK_CACHE_DIR: join(root, cache),
			},
			encoding: 'utf8',
		});
	const check = (version, { installed = true } = {}) => {
		const project = join(root, `p${n++}`);
		mkdirSync(join(project, '.devbook', installed ? 'instructions' : ''), { recursive: true });
		if (version) writeFileSync(join(project, '.devbook', 'VERSION'), `${version}\n`);
		const result = run(project, upstream, 'cache');
		assert.equal(result.status, 0, result.stderr);
		return result.stdout;
	};

	test('asks the agent to offer the upgrade when main has a newer version', () => {
		const out = check('2026.11.02');
		assert.match(out, /uses 2026\.11\.02, and 2026\.11\.02\.1 is the newest/);
		assert.match(out, /devbook-upgrade/);
	});

	test('treats a missing or old-style version as out of date', () => {
		assert.match(check(undefined), /from before version numbers/);
		assert.match(check('main'), /from before version numbers/);
		assert.match(check('v2026.11.02'), /uses v2026\.11\.02/);
	});

	test('stays silent when up to date or Devbook is not installed', () => {
		assert.equal(check('2026.11.02.1'), '');
		assert.equal(check(undefined, { installed: false }), '');
	});

	test('stays silent when the version source is unreachable', () => {
		const result = run(join(root, 'p0'), join(root, 'missing'), 'cache2');
		assert.equal(result.status, 0);
		assert.equal(result.stdout, '');
	});
});
