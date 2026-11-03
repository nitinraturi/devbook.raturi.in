import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { render, renderAllowlist, syncBlock, validateCatalog } from './build-prompt.mjs';

const catalog = JSON.parse(readFileSync(new URL('../catalog/sources.json', import.meta.url), 'utf8'));
const source = (over = {}) => ({
	id: 'x',
	title: 'X',
	group: 'stack',
	use: 'Things',
	type: 'skill',
	repo: 'o/x',
	ref: 'v1.0.0',
	install: { any: 'gh skill install o/x x --pin <ref> --agent <host>' },
	license: 'MIT',
	counts: true,
	status: 'adopted',
	lastChecked: '2026-11-03',
	...over,
});

test('the committed catalog is valid', () => {
	assert.deepEqual(validateCatalog(catalog), []);
});

test('rejects auto-consent flags, bad refs and unexplained suggestions', () => {
	const bad = {
		maxOptional: 3,
		upstreams: [
			source({ id: 'a', install: { any: 'npx skills add o/x -y' } }),
			source({ id: 'b', ref: 'latest' }),
			source({ id: 'c', status: 'suggested' }),
		],
	};
	const problems = validateCatalog(bad).join('\n');
	assert.match(problems, /a: install must not pass an auto-consent flag/);
	assert.match(problems, /b: ref must be/);
	assert.match(problems, /c: a suggested source needs a reason/);
});

test('the allowlist pins each command and leaves out retired and suggested sources', () => {
	const text = renderAllowlist({
		upstreams: [source(), source({ id: 'r', title: 'Retired', status: 'retired', reason: 'gone' })],
	});
	assert.match(text, /--pin v1\.0\.0/);
	assert.doesNotMatch(text, /Retired|<ref>/);
});

test('the prompt carries the core block between versioned markers', () => {
	const out = render({
		template: '<!-- BEGIN:devbook-core {{VERSION}} -->\n{{CORE}}\n<!-- END:devbook-core -->',
		core: '## Devbook core\n- rule\n',
		catalog: { ...catalog },
		version: '2026.11.03',
	});
	assert.equal(out, '<!-- BEGIN:devbook-core 2026.11.03 -->\n## Devbook core\n- rule\n<!-- END:devbook-core -->');
});

test('the repository block takes the new core and version and keeps its Commands and everything around it', () => {
	const agents =
		'# A\n\n<!-- BEGIN:devbook-core 1 -->\n## Devbook core\n- old\n## Commands\n- Test: x\n<!-- END:devbook-core -->\n\nmine\n';
	assert.equal(
		syncBlock(agents, '## Devbook core\n- new\n', '2'),
		'# A\n\n<!-- BEGIN:devbook-core 2 -->\n## Devbook core\n- new\n## Commands\n- Test: x\n<!-- END:devbook-core -->\n\nmine\n',
	);
	assert.throws(() => syncBlock('# no block\n', 'x', '1'), /no Devbook block/);
});
