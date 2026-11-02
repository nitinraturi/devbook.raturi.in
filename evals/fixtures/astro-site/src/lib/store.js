// In-memory subscriber store. A real deployment would swap this for a database or an email provider.
const subscribers = new Set();

export function addSubscriber(email) {
	const isNew = !subscribers.has(email);
	subscribers.add(email);
	return isNew;
}

export function listSubscribers() {
	return [...subscribers];
}

export function clearSubscribers() {
	subscribers.clear();
}
