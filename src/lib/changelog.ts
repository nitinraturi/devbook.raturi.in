// Reads CHANGELOG.md headings ("## YYYY-MM-DD: Title") into dated entries for the history timeline.

export interface ChangelogDay {
	date: string;
	titles: string[];
}

const HEADING = /^## (\d{4}-\d{2}-\d{2}): (.+)$/;

/** Group the changelog's entries by date, oldest first. Throws on a malformed heading, so the build fails. */
export function changelogDays(markdown: string): ChangelogDay[] {
	const days = new Map<string, string[]>();
	for (const line of markdown.split('\n')) {
		if (!line.startsWith('## ')) continue;
		const match = HEADING.exec(line);
		if (!match) throw new Error(`CHANGELOG.md: heading must be "## YYYY-MM-DD: Title", got "${line}"`);
		const [, date = '', title = ''] = match;
		days.set(date, [...(days.get(date) ?? []), title]);
	}
	return [...days]
		.map(([date, titles]) => ({ date, titles: titles.reverse() }))
		.sort((a, b) => a.date.localeCompare(b.date));
}

/** "2026-11-02" as "2 November 2026", independent of the build machine's time zone. */
export function formatDay(date: string): string {
	return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
		new Date(`${date}T00:00:00Z`),
	);
}
