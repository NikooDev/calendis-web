import { type NextRequest } from 'next/server';
import CalendisProxy from '@Calendis/lib/server/proxy';

const proxy = (req: NextRequest) => new CalendisProxy(req).handle();

export const config = {
	matcher: [
		'/((?!_next|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|static|icons|manifest\\.webmanifest).*)'
	]
};

export default proxy;