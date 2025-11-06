const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

/**
 * Firebase endpoints used by the Firestore, Auth, and Storage SDKs.
 * Joined into a single string for CSP connect-src rules.
 */
const firebaseEndpoints = [
	'https://firestore.googleapis.com',
	'https://identitytoolkit.googleapis.com',
	'https://securetoken.googleapis.com',
	'https://firebasestorage.googleapis.com'
].join(' ');

const scriptSrc = isProd
	? "'self' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com https://js.stripe.com;"
	: "'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com https://js.stripe.com https://vercel.live;";

/**
 * Global Content Security Policy applied to all requests.
 * Restricts sources for scripts, styles, connections, and embedded content.
 */
export const csp = [
	"default-src 'self';",
	`script-src ${scriptSrc}`,
	"style-src 'self' 'unsafe-inline';",
	"img-src 'self' https://firebasestorage.googleapis.com data: blob:;",
	`connect-src 'self' ${firebaseEndpoints} ${process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL} https://api.stripe.com;`,
	"font-src 'self';",
	"manifest-src 'self';",
	"worker-src 'self';",
	"child-src 'self';",
	"object-src 'none';",
	"base-uri 'none';",
	"form-action 'self';",
	"frame-ancestors 'none';",
	"frame-src 'self';"
].join(' ');

/**
 * Default HTTP security headers applied by Next.js middleware.
 * Includes CSP, COOP/COEP isolation, and restricted permissions.
 */
export const headers = [
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: `geolocation=(), microphone=(self)` },
	{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
	{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
	{ key: 'Content-Security-Policy', value: csp }
];