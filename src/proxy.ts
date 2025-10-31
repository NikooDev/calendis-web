import { NextRequest, NextResponse } from 'next/server';
import { publicPaths } from '@Calendis/config/app';

class CalendisProxy {
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

	private redirect(path: string, status = 303) {
		const dest = new URL(path, this.origin);
		return this.withPathHeader(NextResponse.redirect(dest, { status }));
	}

	private redirectAbs(absUrl: URL, status = 303) {
		return this.withPathHeader(NextResponse.redirect(absUrl, { status }));
	}

	private rewrite(path: string) {
		const nextUrl = new URL(this.url);
		nextUrl.pathname = path;
		return this.withPathHeader(NextResponse.rewrite(nextUrl));
	}

	public handle() {
		if (this.isProd) {
			if (!this.isApp && this.pathname.startsWith('/app')) {
				const cleanPath = this.pathname.replace(/^\/app/, '') || '/';
				const dest = new URL(cleanPath, `https://app.${this.domain}`);
				return this.redirectAbs(dest, 303);
			}

			if (this.isApp) {
				if (this.pathname === '/') {
					if (!this.hasUser) return this.redirect('/login', 303);
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

export const proxy = (req: NextRequest) => {
	const handler = new CalendisProxy(req);
	return handler.handle();
};

// noinspection JSUnusedGlobalSymbols
export const config = {
	matcher: [
		'/((?!_next|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|static|icons|manifest\\.webmanifest).*)',
	],
};
