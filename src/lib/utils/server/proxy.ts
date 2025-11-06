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

	constructor(req: NextRequest) {
		this.req = req;
		this.url = req.nextUrl.clone();
		this.pathname = this.url.pathname;
		this.origin = this.url.origin;
		this.hostname = this.resolveHostname();
		this.cookieUser = req.cookies.get(cookieName.session)?.value;
		this.cookieDemo = req.cookies.get(cookieName.demo)?.value;
	}

	private readonly next: (opts?: MiddlewareResponseInit) => NextResponse = (opts) => {
		return NextResponse.next(opts);
	}

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

	get env(): Environment {
		const hostname = this.url.hostname;

		if (hostname.includes('localhost')) return 'development';
		if (hostname.includes('vercel.app')) return 'testing';
		if (hostname.endsWith('calendis.fr')) return 'production';

		return 'development';
	}

	private getSubdomain(hostname: string): SubDomain | 'none' {
		if (hostname.startsWith('www.')) return 'www';
		if (hostname.startsWith('app.')) return 'app';
		if (hostname.startsWith('demo.')) return 'demo';
		if (hostname.endsWith('vercel.app')) return 'test';

		return 'none';
	}

	private isUser(): boolean {
		return Boolean(this.cookieUser?.trim());
	}

	private isDemoUser(): boolean {
		return Boolean(this.cookieDemo?.trim());
	}

	private isPublicPath(): boolean {
		return publicPaths.includes(this.pathname);
	}

	private rewrite(path: string | URL, options?: { request: { headers: Headers } }): NextResponse {
		const url = path instanceof URL ? path : new URL(path, this.url.origin);
		return NextResponse.rewrite(url, options);
	}

	private redirect(to: string | URL, status = 303): NextResponse {
		const url = to instanceof URL ? to : new URL(to, this.url.origin);
		return NextResponse.redirect(url, { status });
	}

	private buildRedirect(): string {
		const full = `${this.origin}${this.pathname}${this.url.search}`;
		return encodeURIComponent(full);
	}

	private notFound(): NextResponse {
		return this.rewrite('/404');
	}

	private isPath(...paths: string[]): boolean {
		return paths.some((path) => this.pathname.startsWith(path));
	}

	private handleWWW() {
		if (this.isPath('/auth')) {
			return this.rewrite('/404');
		}

		if (this.isPath('/app')) {
			return this.notFound();
		}

		return this.next();
	}

	private handleApp() {
		const isUser = this.isUser();

		if (this.pathname === '/') {
			return isUser ? this.redirect('/welcome') : this.redirect('/auth/login');
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

	private handleDemo() {

	}

	private handleTest() {
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

	public handle() {
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