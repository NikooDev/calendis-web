import React from 'react';
import type { ChildrenProp } from '@Calendis/types/app';

const Title = ({ children }: ChildrenProp) => {
	return (
		<h1 className="relative font-title text-3xl font-semibold tracking-tighter before:h-0.5 before:w-20 before:absolute before:-bottom-1 before:left-0 before:bg-theme-light">
			{ children }
		</h1>
	);
};

export default Title;