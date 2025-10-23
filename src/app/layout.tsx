import React from 'react';
import { fonts } from '@Calendis/config/fonts';
import type { ChildrenProp } from '@Calendis/types/core';
import '@Calendis/assets/styles/globals.css';

const RootLayout = ({ children }: ChildrenProp) => {
	return (
		<html className="dark">
			<body className={fonts}>
				{ children }
			</body>
		</html>
	);
};

export default RootLayout;