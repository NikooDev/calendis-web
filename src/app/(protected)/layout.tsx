import React from 'react';
import FirebaseProvider from '@Calendis/providers/FirebaseProvider';
import SessionProvider from '@Calendis/providers/SessionProvider';
import metadatas from '@Calendis/config/metadatas';
import { Header, Sidebar, Container } from '@Calendis/components/protected';
import type { ChildrenProp } from '@Calendis/types/app';
import type { Metadata } from 'next';

export const metadata: Metadata = metadatas({ index: false, follow: false });

const ProtectedLayout = ({ children }: ChildrenProp) => {
	return (
		<FirebaseProvider>
			<SessionProvider>
				<Header/>
				<Sidebar/>
				<main>
					<Container>
						{ children }
					</Container>
				</main>
			</SessionProvider>
		</FirebaseProvider>
	);
};

export default ProtectedLayout;