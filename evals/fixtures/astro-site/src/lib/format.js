/** Lower-case, hyphen-separated slug from a title, with accents removed: "Crème Brûlée" → "creme-brulee". */
export function slugify(title) {
	return title
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** "2026-09-14" → "14 September 2026", in UTC so the date never shifts by time zone. */
export function formatDate(isoDate) {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	});
}
