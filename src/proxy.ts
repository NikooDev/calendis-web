import { NextRequest } from 'next/server';
import CalendisProxy from '@Calendis/services/proxy';

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
