import React, { use } from 'react';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import type { ChildrenProp } from '@Calendis/types/app';
import Header from '@Calendis/components/protected/partials/Header';
import Sidebar from '@Calendis/components/protected/partials/Sidebar';
import Container from '@Calendis/components/protected/partials/Container';
import Breadcrumbs from '@Calendis/components/ui/breadcrumbs/Breadcrumbs';
import Env from '@Calendis/lib/hybrid/env';

const ProtectedLayout = ({ children }: ChildrenProp) => {
	const header = use(headers());
	const pathname = header.get('pathname');
	const hostname = header.get('host') ?? '';
	const isAppDomain = hostname.startsWith('app.');
	const userCookie = use(cookies()).get('user');
	const demoCookie = use(cookies()).get('demo');
	const url = Env.isEnvironment('production') ? '/login' : '/app/login';
	const activeCookie = isAppDomain ? userCookie : demoCookie;
	const isUserConnected = Boolean(activeCookie?.value);

	if (pathname && pathname.startsWith(url) && !isUserConnected) {
		return (
			<main>
				{ children }
			</main>
		)
	}

	return (
		<>
			<Header/>
			<Sidebar/>
			<Container>
				<Breadcrumbs overrides={{ dashboard: 'Tableau de bord', onboarding: 'Bienvenue' }} hiddenOn={['app']} className="mb-6"/>
				{ children }
			</Container>
		</>
	);
};

export default ProtectedLayout;