import React from 'react';
import type { Metadata } from 'next';
import type { ChildrenProp } from '@Calendis/types/app';
import { fonts } from '@Calendis/config/fonts';
import metadatas from '@Calendis/config/metadatas';
import '@Calendis/assets/styles/globals.css';

export const metadata: Metadata = metadatas();

const RootLayout = ({ children }: ChildrenProp) => {
	return (
		<html lang="fr" data-mode="dark" data-theme="blue">
			<body className={ fonts }>
			{ children }
			</body>
		</html>
	)
}

export default RootLayout;