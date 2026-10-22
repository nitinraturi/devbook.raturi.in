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

/**
 * Analytics runs only in production builds that have a measurement ID, and never on
 * Cloudflare Pages preview builds (CF_PAGES_BRANCH is set by the Pages build image).
 */
export const IS_PREVIEW = Boolean(process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main');
export const GA_ID: string | undefined =
	import.meta.env.PROD && !IS_PREVIEW && import.meta.env.PUBLIC_GA_ID ? import.meta.env.PUBLIC_GA_ID : undefined;
