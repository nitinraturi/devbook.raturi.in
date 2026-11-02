import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { addSubscriber, clearSubscribers, listSubscribers } from '../src/lib/store.js';

beforeEach(() => clearSubscribers());

test('addSubscriber stores each email once', () => {
	assert.equal(addSubscriber('a@example.com'), true);
	assert.equal(addSubscriber('a@example.com'), false);
	assert.deepEqual(listSubscribers(), ['a@example.com']);
});
