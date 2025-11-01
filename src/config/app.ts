import Env from '@Calendis/lib/hybrid/env';
import type { CookieClientOptions } from '@Calendis/types/app';

export const hostname = {
	development: 'localhost:3000',
	testing: 'calendis-web.vercel.app',
	production: ['www.calendis.fr', 'app.calendis.fr', 'demo.calendis.fr'] as const
}

/**
 * Public paths
 */
export const publicPaths = [
	'/login'
]

/**
 * Default cache freshness duration (in milliseconds).
 * Determines how long a query result is considered "fresh"
 * before React Query marks it as stale and allows refetching.
 */
export const DEFAULT_STALE_TIME = 60_000;

/**
 * List environments of application
 */
export const environments = [
	'production',
	'development',
	'testing'
] as const;

/**
 * Check if hostname / pathname is a demo
 */
export const isDemo = typeof window !== 'undefined' && (
	window.location.hostname === 'demo.calendis.fr' ||
	window.location.pathname.startsWith('/demo')
);

/**
 * Token expiration seven days
 */
export const expireToken = 1000 * 60 * 60 * 24 * 7;

/**
 * Server-side Cookie Configuration
 */
export const http = {
	cookie: {
		path: '/',
		maxAge: Math.floor(expireToken / 1000),
		httpOnly: true,
		secure: !Env.isEnvironment('development'),
		sameSite: 'Strict'
	}
}

/**
 * Client-side Cookie Configuration
 */
export const client = (opts?: CookieClientOptions) => ({
	cookie: {
		path: opts?.path ?? '/',
		domain: opts?.domain ?? '.calendis.fr',
		maxAge: Math.floor((opts?.maxAge ?? expireToken) / 1000),
		secure: !Env.isEnvironment('development'),
		sameSite: opts?.sameSite ?? 'Lax'
	}
});