/** Site-wide constants shared by the config, components and JSON-LD. */
export const SITE_URL = 'https://devbook.raturi.in/';
export const SITE_NAME = 'Devbook';
export const REPO_URL = 'https://github.com/nitinraturi/devbook.raturi.in';
export const OG_IMAGE = { path: '/og-default.png', width: 1200, height: 630 };

/** Same Person entity across every raturi.in site. */
export const PERSON = {
	id: 'https://raturi.in/#person',
	name: 'Nitin Raturi',
	url: 'https://raturi.in/',
	// TODO(owner): add profile URLs (GitHub, LinkedIn, …) for `sameAs`.
	sameAs: [] as string[],
};

/** Pages older than this many days since `lastVerified` show a caution notice. */
export const STALE_AFTER_DAYS = 180;

/** GA4 measurement ID shared with raturi.in (one property; reports split by hostname). */
const DEFAULT_GA_ID = 'G-4343Y0SFZ5';

/**
 * Analytics runs only in production builds, never on Cloudflare Pages preview builds
 * (CF_PAGES_BRANCH is set by the Pages build image). The default ID applies only to the
 * Pages production build of `main`, so local, CI and Lighthouse builds send nothing.
 * PUBLIC_GA_ID overrides it (for example after moving to Workers).
 */
const PAGES_BRANCH = process.env.CF_PAGES_BRANCH;
export const IS_PREVIEW = Boolean(PAGES_BRANCH && PAGES_BRANCH !== 'main');
const configuredId = import.meta.env.PUBLIC_GA_ID || (PAGES_BRANCH === 'main' ? DEFAULT_GA_ID : undefined);
export const GA_ID: string | undefined = import.meta.env.PROD && !IS_PREVIEW ? configuredId : undefined;
