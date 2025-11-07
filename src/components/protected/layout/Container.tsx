import React from 'react';
import type { ChildrenProp } from '@Calendis/types/app';

const Container = ({ children }: ChildrenProp) => {
	return (
		<main className="ml-67 pt-20">
			<div className="px-8 py-4">
				{ children }
			</div>
		</main>
	);
};

export default Container;