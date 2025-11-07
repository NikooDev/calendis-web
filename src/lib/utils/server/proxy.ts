import { NextRequest, NextResponse } from 'next/server';
import type { Environment, MiddlewareResponseInit, SubDomain } from '@Calendis/types/app';
import { cookieName, domain, publicPaths } from '@Calendis/config/app';

class CalendisProxy {
	private readonly req: NextRequest;
	private readonly url: URL;
	private readonly pathname: string;
	private readonly origin: string;
	private readonly hostname: string;
	private readonly cookieUser?: string;
	private readonly cookieDemo?: string;

	/**
	 * Initialize Calendis proxy with current request.
	 * @param {NextRequest} req - The incoming Next.js request.
	 */
	constructor(req: NextRequest) {
		this.req = req;
		this.url = req.nextUrl.clone();
		this.pathname = this.url.pathname;
		this.origin = this.url.origin;
		this.hostname = this.resolveHostname();
		this.cookieUser = req.cookies.get(cookieName.session)?.value;
		this.cookieDemo = req.cookies.get(cookieName.demo)?.value;
	}

	/**
	 * Continue to next middleware or route.
	 * @param {MiddlewareResponseInit} [opts] - Optional middleware options.
	 * @return {NextResponse} Next.js response continuation.
	 */
	private readonly next: (opts?: MiddlewareResponseInit) => NextResponse = (opts?: MiddlewareResponseInit): NextResponse => {
		return NextResponse.next(opts);
	}

	/**
	 * Resolve the request hostname based on environment.
	 * @return {string} The resolved hostname.
	 */
	private resolveHostname(): string {
		const hostname = this.req.headers.get('host') ?? this.req.headers.get('x-forwarded-host') ?? this.url.hostname;

		if (this.env === 'development') {
			const subdomain = this.getSubdomain(hostname);

			if (['www', 'app', 'demo', 'test'].includes(subdomain)) {
				return domain[subdomain as SubDomain].development;
			}

			return 'localhost';
		}

		return hostname;
	}

	/**
	 * Get current runtime environment.
	 * @return {Environment} The active environment.
	 */
	get env(): Environment {
		const hostname = this.url.hostname;

		if (hostname.includes('localhost')) return 'development';
		if (hostname.includes('vercel.app')) return 'testing';
		if (hostname.endsWith('calendis.fr')) return 'production';

		return 'development';
	}

	/**
	 * Extract subdomain from hostname.
	 * @param {string} hostname - Hostname to analyze.
	 * @return {SubDomain | 'none'} The detected subdomain.
	 */
	private getSubdomain(hostname: string): SubDomain | 'none' {
		if (hostname.startsWith('www.')) return 'www';
		if (hostname.startsWith('app.')) return 'app';
		if (hostname.startsWith('demo.')) return 'demo';
		if (hostname.endsWith('vercel.app')) return 'test';

		return 'none';
	}

	/**
	 * Check if user session exists.
	 * @return {boolean} True if user cookie is present.
	 */
	private isUser(): boolean {
		return Boolean(this.cookieUser?.trim());
	}

	/**
	 * Check if demo session exists.
	 * @return {boolean} True if demo cookie is present.
	 */
	private isDemoUser(): boolean {
		return Boolean(this.cookieDemo?.trim());
	}

	/**
	 * Check if current path is public.
	 * @return {boolean} True if path is in publicPaths list.
	 */
	private isPublicPath(): boolean {
		return publicPaths.includes(this.pathname);
	}

	/**
	 * Rewrite request to a new path.
	 * @param {string | URL} path - The destination path.
	 * @param {{request: {headers: Headers}}} [options] - Optional rewrite options.
	 * @return {NextResponse} The rewrite response.
	 */
	private rewrite(path: string | URL, options?: { request: { headers: Headers } }): NextResponse {
		const url = path instanceof URL ? path : new URL(path, this.url.origin);
		return NextResponse.rewrite(url, options);
	}

	/**
	 * Redirect request to another path.
	 * @param {string | URL} to - The redirect destination.
	 * @param {number} [status=303] - Redirect status code.
	 * @return {NextResponse} The redirect response.
	 */
	private redirect(to: string | URL, status: number = 303): NextResponse {
		const url = to instanceof URL ? to : new URL(to, this.url.origin);
		return NextResponse.redirect(url, { status });
	}

	/**
	 * Build a redirect query parameter for current path.
	 * @return {string} Encoded redirect URL.
	 */
	private buildRedirect(): string {
		const full = `${this.origin}${this.pathname}${this.url.search}`;
		return encodeURIComponent(full);
	}

	/**
	 * Rewrite response to 404 page.
	 * @return {NextResponse} The not-found response.
	 */
	private notFound(): NextResponse {
		return this.rewrite('/404');
	}

	/**
	 * Check if current path starts with one of provided prefixes.
	 * @param {...string[]} paths - Path prefixes to test.
	 * @return {boolean} True if pathname matches any prefix.
	 */
	private isPath(...paths: string[]): boolean {
		return paths.some((path) => this.pathname.startsWith(path));
	}

	/**
	 * Handle requests for the www subdomain.
	 * @return {NextResponse} The response for www domain.
	 */
	private handleWWW(): NextResponse {
		if (this.isPath('/auth')) {
			return this.rewrite('/404');
		}

		if (this.isPath('/app')) {
			return this.notFound();
		}

		return this.next();
	}

	/**
	 * Handle requests for the app subdomain.
	 * @return {NextResponse} The response for app domain.
	 */
	private handleApp(): NextResponse {
		const isUser = this.isUser();

		if (this.pathname === '/') {
			if (isUser) {
				return this.redirect('/welcome');
			} else {
				const redirectParam = this.buildRedirect();
				return this.redirect(`/auth/login?redirect=${redirectParam}`);
			}
		}

		if (this.pathname === '/app' || this.isPath('/app')) {
			return this.notFound();
		}

		if (this.isPath('/auth')) {
			return isUser ? this.redirect('/welcome') : this.next();
		}

		if (!isUser && !this.isPublicPath()) {
			const redirectParam = this.buildRedirect();
			return this.redirect(`/auth/login?redirect=${redirectParam}`);
		}

		if (isUser && this.isPublicPath()) {
			return this.redirect('/welcome');
		}

		return this.rewrite(`/app${this.pathname}`);
	}

	/**
	 * Handle requests for the demo subdomain.
	 * @return {NextResponse} The response for demo domain.
	 */
	private handleDemo(): NextResponse {
		return this.next();
	}

	/**
	 * Handle requests for the test domain (vercel.app).
	 * @return {NextResponse} The response for test environment.
	 */
	private handleTest(): NextResponse {
		const isUser = this.isUser();
		const isDemoUser = this.isDemoUser();

		if (this.isPath('/app') && !isUser) {
			const redirectParam = this.buildRedirect();
			return this.redirect(`/auth/login?redirect=${redirectParam}`);
		}

		if (this.isPath('/demo') && !isDemoUser) {
			const redirectParam = this.buildRedirect();
			return this.redirect(`/auth/login?redirect=${redirectParam}`);
		}

		if (this.isPath('/auth/login') || this.isPath('/auth/signup')) {
			if (isUser || isDemoUser) {
				return this.redirect('/welcome');
			}
			return this.next();
		}

		if (this.pathname === '/') {
			return this.next();
		}

		return this.next();
	}

	/**
	 * Main middleware handler, routing requests by subdomain.
	 * @return {NextResponse} The final middleware response.
	 */
	public handle(): NextResponse {
		const hostname = this.hostname;
		const subdomain = this.getSubdomain(hostname);

		switch (subdomain) {
			case 'www':
				return this.handleWWW();
			case 'app':
				return this.handleApp();
			case 'demo':
				return this.handleDemo();
			case 'test':
				return this.handleTest();
			default:
				return this.notFound();
		}
	}
}

export default CalendisProxy;