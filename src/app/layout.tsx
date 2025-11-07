import React, { use } from 'react';
import type { Metadata } from 'next';
import type { ChildrenProp } from '@Calendis/types/app';
import { cookies } from 'next/headers';
import metadatas from '@Calendis/config/metadatas';
import '@Calendis/assets/styles/globals.css';

export const metadata: Metadata = metadatas();

const RootLayout = ({ children }: ChildrenProp) => {
	const theme = use(cookies()).get('theme')?.value;
	const dataMode = {...(theme && theme !== 'auto' ? { 'data-mode': theme } : {})};

	return (
		<html lang="fr" { ...dataMode }>
			<body>
				{ children }
			</body>
		</html>
	);
};

export default RootLayout;