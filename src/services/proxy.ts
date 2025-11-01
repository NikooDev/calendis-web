import { NextRequest, NextResponse } from 'next/server';
import type { EnvironmentsApp, EnvironmentsNode, MiddlewareResponseInit } from '@Calendis/types/app';
import { publicPaths, hostname } from '@Calendis/config/app';

class CalendisProxy {
	private readonly url: URL;
	private readonly pathname: string;
	private readonly hostname: string;
	private readonly origin: string;
	private readonly cookieUser?: string;
	private readonly cookieDemo?: string;
	private readonly next: (opts?: MiddlewareResponseInit) =>
		NextResponse = (opts) => NextResponse.next(opts);

	constructor(req: NextRequest) {
		this.url = req.nextUrl.clone();
		this.pathname = this.url.pathname;
		this.hostname = this.url.hostname;
		this.origin = this.url.origin;
		this.cookieUser = req.cookies.get('user')?.value;
		this.cookieDemo = req.cookies.get('demo')?.value;
	}

	get env(): EnvironmentsApp {
		const appEnv = process.env.NEXT_PUBLIC_ENVIRONMENT as EnvironmentsApp;
		const nodeEnv = process.env.NODE_ENV as EnvironmentsNode;

		if (nodeEnv === 'production' && appEnv === 'production') return 'production';
		if (nodeEnv === 'production' && appEnv === 'testing') return 'testing';
		if (nodeEnv === 'development' && appEnv === 'development') return 'development';

		if (hostname.production.some((urls) => urls === this.hostname)) {
			return 'production';
		}

		switch (this.hostname) {
			case hostname.testing:
				return 'testing';
			case hostname.development.replace(':3000', ''):
			case hostname.development:
				return 'development';
			default:
				if (this.hostname.endsWith('.vercel.app')) return 'testing';
				if (this.hostname.endsWith('calendis.fr')) return 'production';
				return 'development';
		}
	}

	private isProduction(): boolean {
		return this.env === 'production' && hostname.production.some((urls) => urls === this.hostname);
	}

	private isTesting(): boolean {
		return this.env === 'testing' && this.hostname === hostname.testing;
	}

	private isDevelopment(): boolean {
		return this.env === 'development' && this.hostname === hostname.development;
	}

	private isSubDomain(prefix: 'app' | 'demo'): boolean {
		if (!this.isProduction) return false;
		const parts = this.hostname.split('.');

		return parts.length === 3 && parts[0] === prefix;
	}

	public isRootDomain() {
		return this.hostname === 'www.calendis.fr';
	}

	private isPublicPath() {
		return publicPaths.includes(this.pathname);
	}

	private isUser(): boolean {
		return Boolean(this.cookieUser && this.cookieUser.trim() !== '');
	}

	private isDemoUser(): boolean {
		return Boolean(this.cookieDemo && this.cookieDemo.trim() !== '');
	}

	private headerPathname(res: NextResponse) {
		if (this.isSubDomain('app') || this.isSubDomain('demo')) {
			res.headers.set('pathname', this.pathname);
		}
		return res;
	}

	private redirect(to: string | URL, status = 303) {
		const dest = to instanceof URL ? to : new URL(to, this.origin);
		return this.isSubDomain('app') ? this.headerPathname(NextResponse.redirect(dest, { status })) : NextResponse.redirect(dest, { status });
	}

	private rewrite(path: string) {
		const nextUrl = new URL(this.url);
		nextUrl.pathname = path;
		return this.headerPathname(NextResponse.rewrite(nextUrl));
	}

	private handleSubdomain(type: 'app' | 'demo') {
		const isUser = type === 'app' ? this.isUser() : this.isDemoUser();

		if (this.pathname === '/') {
			return isUser ? this.redirect('/welcome') : this.redirect('/login');
		}

		if (this.pathname.startsWith('/app')) {
			return this.rewrite('/404');
		}

		if (!isUser && !this.isPublicPath()) {
			return this.redirect('/login');
		}

		if (isUser && this.isPublicPath()) {
			return this.redirect('/welcome');
		}

		return this.rewrite(`/app${this.pathname}`);
	}

	public handle(): NextResponse {
		if (this.isProduction()) {
			// www.calendis.fr/app
			if (this.isRootDomain()) {
				if (this.pathname === '/app' || this.pathname.startsWith('/app/')) {
					const newPath = this.pathname.replace(/^\/app/, '') || '/';
					const redirectUrl = new URL(newPath, 'https://app.calendis.fr');

					redirectUrl.search = this.url.search;

					return this.redirect(redirectUrl);
				}

				return this.next();
			}

			// app.calendis.fr
			if (this.isSubDomain('app')) {
				return this.handleSubdomain('app');
			}

			// demo.calendis.fr
			if (this.isSubDomain('demo')) {
				return this.handleSubdomain('demo');
			}

			// www.calendis.fr
			return this.next();
		}

		if (this.isTesting()) {
			// Si user existe et si user.role === "super-admin" ->
			// Requête handler route.ts alors on affiche calendis-web.vercel.app
		}

		if (this.isDevelopment()) {


			return this.next();
		}

		return this.next();
	}
}

export default CalendisProxy;

/*class CalendisProxy {
	private readonly url: URL;
	private readonly pathname: string;
	private readonly hostname: string;
	private readonly cookieUser?: string;
	private readonly origin: string;

	constructor(req: NextRequest) {
		this.url = req.nextUrl.clone();
		this.pathname = this.url.pathname;
		this.hostname = req.headers.get('host') ?? '';
		this.cookieUser = req.cookies.get('user')?.value;
		this.origin = this.url.origin;
	}

	get env() {
		const appEnv = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
		const nodeEnv = process.env.NODE_ENV || 'development';
		if (nodeEnv === 'production' && appEnv === 'production') return 'production';
		if (appEnv === 'testing') return 'testing';
		return 'development';
	}

	get domain() {
		return this.env === 'production' ? 'calendis.fr' : 'localhost:3000';
	}

	get isProd() {
		return this.env === 'production';
	}

	get isApp() {
		return this.isProd ? this.hostname.startsWith('app.') : this.pathname.startsWith('/app');
	}

	get hasUser() {
		return Boolean(this.cookieUser);
	}

	private isPublicPath() {
		return publicPaths.includes(this.pathname);
	}

	private withPathHeader(res: NextResponse) {
		if (this.isApp) res.headers.set('x-pathname', this.pathname);
		return res;
	}

	private redirect(to: string | URL, status = 303) {
		const dest = to instanceof URL ? to : new URL(to, this.origin);
		return this.isApp ? this.withPathHeader(NextResponse.redirect(dest, { status })) : NextResponse.redirect(dest, { status });
	}

	private rewrite(path: string) {
		const nextUrl = new URL(this.url);
		nextUrl.pathname = path;
		return this.withPathHeader(NextResponse.rewrite(nextUrl));
	}

	public handle() {
		if (this.isProd) {
			if (!this.isApp && this.pathname.startsWith('/app')) {
				return this.rewrite('/404');
			}

			if (this.isApp) {
				if (this.pathname === '/') {
					if (!this.hasUser) {
						console.log('origin',this.origin);
						const redirectTo = `${this.origin}/welcome`;
						const loginUrl = new URL(`/login?redirect=${encodeURIComponent(redirectTo)}`, this.origin);
						return this.redirect(loginUrl, 303);
					}

					return this.rewrite('/app');
				}

				if (!this.hasUser && !this.isPublicPath()) {
					if (this.pathname !== '/login') {
						console.log('origin',this.origin);
						const redirectTo = `${this.origin}/welcome`;
						const loginUrl = new URL(`/login?redirect=${encodeURIComponent(redirectTo)}`, this.origin);
						return this.withPathHeader(NextResponse.redirect(loginUrl, 303));
					}
				}

				if (this.pathname.startsWith('/app')) {
					return this.withPathHeader(NextResponse.next());
				}

				return this.rewrite(`/app${this.pathname}`);
			}

			return NextResponse.next();
		}

		if (this.isApp) {
			if (!this.hasUser && !this.isPublicPath()) {
				if (this.pathname !== '/app/login') {
					const loginUrl = new URL('/app/login', this.origin);
					loginUrl.searchParams.set('redirect', `${this.origin}/welcome`);
					return this.withPathHeader(NextResponse.redirect(loginUrl, 303));
				}
			}
			return this.withPathHeader(NextResponse.next());
		}

		if (this.isApp && this.pathname === '/') {
			if (!this.hasUser) return this.rewrite('/app/login');

			return this.rewrite('/app');
		}

		return this.withPathHeader(NextResponse.next());
	}
}

export default CalendisProxy;
 */