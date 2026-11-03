// Committed measured eval summaries (evals/results/*.json, written by evals/summarize.mjs), read at build time. One
// fact, one place: the evals write these files and the site only reads them.
export interface CaseResult {
	name: string;
	with: number | null;
	without: number | null;
	delta: number | null;
	errors: number;
}
export interface SuiteResult {
	score: number | null;
	meanDelta: number | null;
	casesPassed: number | null;
	casesTotal: number;
	cases: CaseResult[];
}
export interface EvalSummary {
	date: string;
	method: 'measured';
	model: string | null;
	judge: string | null;
	suites: Record<string, SuiteResult>;
}

const files = import.meta.glob<EvalSummary>('../../evals/results/*.json', { eager: true, import: 'default' });

/** The newest committed summary, or undefined before the first measured run. */
export const latest = (): EvalSummary | undefined =>
	Object.values(files)
		.filter((r) => r.method === 'measured')
		.sort((a, b) => a.date.localeCompare(b.date))
		.at(-1);

export const score = (x: number | null) => (x === null ? '–' : `${Math.round(x * 100)}%`);
export const delta = (x: number | null) => (x === null ? '–' : `${x > 0 ? '+' : ''}${Math.round(x * 100)} pts`);
