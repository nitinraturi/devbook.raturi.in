import { test } from 'node:test';
import assert from 'node:assert/strict';
import { due, extractText, hash, lineDiff, robotsDisallows } from './watch-sources.mjs';

test('extractText keeps the main content and drops scripts, styles and chrome', () => {
	const html = `<html><head><style>x{}</style></head><body><nav>Menu</nav><main><h1>Title</h1>
	<p>First   rule&nbsp;here &amp; there.</p><script>track()</script><p>Second&#8217;s</p></main><footer>©</footer></body></html>`;
	assert.equal(extractText(html), 'Title\nFirst rule here & there.\nSecond’s');
});

test('whitespace-only changes keep the same hash', () => {
	assert.equal(hash(extractText('<main><p>a  b</p></main>')), hash(extractText('<main>\n<p>a b</p>\n</main>')));
});

test('robotsDisallows follows the most specific rule for our agent or *', () => {
	const robots = 'User-agent: *\nDisallow: /private\nAllow: /private/ok\n\nUser-agent: OtherBot\nDisallow: /';
	const blocked = robotsDisallows(robots);
	assert.ok(blocked('/private/x'));
	assert.ok(!blocked('/private/ok/page'));
	assert.ok(!blocked('/docs'));
	assert.ok(robotsDisallows('User-agent: DevbookSourceWatcher\nDisallow: /')('/anything'));
	assert.ok(!robotsDisallows('')('/anything'));
});

test('lineDiff lists removed and added lines', () => {
	assert.equal(lineDiff('a\nb\nc', 'a\nc\nd'), '- b\n+ d');
});

test('due honours the cadence with half a day of slack', () => {
	const now = Date.parse('2026-11-09T00:00:00Z');
	assert.ok(due(undefined, 7, now));
	assert.ok(due({ checkedAt: '2026-11-02T06:00:00Z' }, 7, now));
	assert.ok(!due({ checkedAt: '2026-11-05T00:00:00Z' }, 7, now));
});
