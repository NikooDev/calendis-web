import React from 'react';
import type { ChildrenProp } from '@Calendis/types/app';

const PublicLayout = ({ children }: ChildrenProp) => {
	return (
		<main>
			{ children }
		</main>
	);
};

export default PublicLayout;