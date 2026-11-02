// Committed eval results (evals/results/*.json), read at build time. One fact, one place: the evals write these
// files and the site only reads them.
export interface TaskResult {
	runs: number;
	passes: number;
	passRate: number;
	meanInputTokens: number;
	failed: string[];
}
export interface EvalResult {
	date: string;
	startedAt: string;
	method: 'modelled' | 'measured';
	model: string;
	variant: string;
	commit: string | null;
	overall: TaskResult & { coverageLoaded?: number; coverageReachable?: number };
	tasks: Record<string, TaskResult>;
}

const ORDER = ['none', 'ref:9504d10', 'main', 'local'];
const files = import.meta.glob<EvalResult>('../../evals/results/*.json', { eager: true, import: 'default' });

/** The newest result per variant, for one method, in a fixed order. */
export function latestResults(method: EvalResult['method'] = 'modelled'): EvalResult[] {
	const newest = new Map<string, EvalResult>();
	for (const r of Object.values(files)) {
		if (r.method !== method) continue;
		const seen = newest.get(r.variant);
		if (!seen || r.startedAt > seen.startedAt) newest.set(r.variant, r);
	}
	return [...newest.values()].sort((a, b) => ORDER.indexOf(a.variant) - ORDER.indexOf(b.variant));
}

/** The date of the newest result. */
export const resultsDate = () =>
	latestResults()
		.map((r) => r.date)
		.sort()
		.at(-1) ?? '';

/** How many tasks the newest results cover. */
export const taskCount = () => Math.max(0, ...latestResults().map((r) => r.overall.runs));

export const pct = (x: number) => `${Math.round(x * 100)}%`;
export const tokens = (x: number) => Math.round(x).toLocaleString('en');
