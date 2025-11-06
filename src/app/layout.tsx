import React from 'react';
import type { Metadata } from 'next';
import type { ChildrenProp } from '@Calendis/types/app';
import metadatas from '@Calendis/config/metadatas';

export const metadata: Metadata = metadatas();

const RootLayout = ({ children }: ChildrenProp) => {
	return (
		<html lang="fr">
			<body>
				{ children }
			</body>
		</html>
	);
};

export default RootLayout;