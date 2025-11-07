/**
 * Publicly accessible routes for the main app domain
 * These paths do not require user authentication.
 */
export const publicPaths = [
	'/auth/login',
	'/auth/signup'
]

/**
 * Cookies name
 */
const prefixCookieName = 'cld_';
export const cookieName = {
	session: `${prefixCookieName}session`,
	demo: `${prefixCookieName}demo`
}

/**
 * List environments of application
 */
export const environments = [
	'production',
	'development',
	'testing'
] as const;

/**
 * Domain configuration for each subdomain and environment.
 * Used to resolve base URLs dynamically in both dev and prod.
 */
export const domain = {
	www: {
		development: 'www.localhost:3000',
		production: 'www.calendis.fr',
	},
	app: {
		development: 'app.localhost:3000',
		production: 'app.calendis.fr',
	},
	demo: {
		development: 'demo.localhost:3000',
		production: 'demo.calendis.fr',
	},
	test: {
		development: 'calendis-web.vercel.app'
	}
};