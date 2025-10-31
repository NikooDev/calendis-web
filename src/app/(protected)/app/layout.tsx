import React, { use } from 'react';
import { headers } from 'next/headers'
import type { ChildrenProp } from '@Calendis/types/app';
import Header from '@Calendis/components/protected/partials/Header';
import Sidebar from '@Calendis/components/protected/partials/Sidebar';
import Container from '@Calendis/components/protected/partials/Container';
import Breadcrumbs from '@Calendis/components/ui/breadcrumbs/Breadcrumbs';

const ProtectedLayout = ({ children }: ChildrenProp) => {
	const pathname = use(headers()).get('x-pathname');

	if (pathname && pathname.startsWith('/app/login')) {
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