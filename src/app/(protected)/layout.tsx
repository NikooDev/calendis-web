import React from 'react';
import FirebaseProvider from '@Calendis/providers/FirebaseProvider';
import type { ChildrenProp } from '@Calendis/types/app';

const ProtectedLayout = ({ children }: ChildrenProp) => {
	return (
		<FirebaseProvider>
			{ children }
		</FirebaseProvider>
	);
};

export default ProtectedLayout;