import Env from '@Calendis/lib/hybrid/env';

/**
 * Token expiration time (7 days).
 */
export const expireToken = 1000 * 60 * 60 * 24 * 7;

/**
 * Default HTTP cookie configuration used for session management.
 * Ensures secure cookies in production and relaxed rules in development.
 */
export const http = {
	cookie: {
		path: '/',
		maxAge: Math.floor(expireToken / 1000),
		httpOnly: true,
		secure: Env.isEnvironment('production'),
		sameSite: Env.isEnvironment('development') ? 'lax' : 'strict'
	} as const,
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-store, must-revalidate',
		'X-Content-Type-Options': 'nosniff'
	} as const,
	cors: {
		origin: Env.isEnvironment('production') ? 'https://app.calendis.fr' : 'http://app.localhost:3000',
		methods: ['GET', 'POST', 'OPTIONS'],
		credentials: true
	} as const
}