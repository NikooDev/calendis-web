import env from '@Calendis/Env';
import type { Environment } from '@Calendis/types/app';

/**
 * Env utility for accessing environment variables safely on client and server.
 * Prevents private variable access on the client and validates required keys.
 */
class Env {
	private static isClient = typeof window !== 'undefined';

	/**
	 * Check if current environment is production.
	 * @returns {env}
	 */
	public static isEnvironment(env: Environment): boolean {
		return process.env.NEXT_PUBLIC_ENVIRONMENT === env;
	};

	public static isDemo(): boolean {
		return typeof window !== 'undefined' && window.location.hostname.startsWith('demo.');
	}

	/**
	 * Get a public environment variable.
	 * @template K
	 * @param {K} key - Key from env.publicEnv.
	 * @returns {string} Value of the public variable.
	 * @throws If the variable is missing.
	 */
	public static getPublic<K extends keyof typeof env.publicEnv>(key: K): string {
		if (this.isClient) {
			const v = env.publicEnv[key];
			if (!v) throw new Error(`Missing public env var: NEXT_PUBLIC_${ String(key) }`);

			return v;
		}

		const envName = `NEXT_PUBLIC_${ String(key) }`;
		const v = process.env[envName];

		if (!v) throw new Error(`Missing public env var: ${ envName }`);

		return v;
	}

	/**
	 * Get a private environment variable.
	 * @template K
	 * @param {K} key - Key from env.privateEnv.
	 * @returns {string} Value of the private variable.
	 * @throws If accessed on the client or variable missing.
	 */
	public static getPrivate<K extends keyof typeof env.privateEnv>(key: K): string {
		if (this.isClient) {
			throw new Error(`Access to private env var "${ key }" on the client is forbidden.`);
		}

		const v = process.env[key];
		if (!v) throw new Error(`Missing private env var: ${ key }`);

		return v;
	}
}

export default Env;