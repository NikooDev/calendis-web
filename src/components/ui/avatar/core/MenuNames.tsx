'use client';

import React, { memo, useEffect } from 'react';
import { Loader } from '@Calendis/components/ui';
import type { UIAvatarMenuNames } from '@Calendis/types/ui';

const MenuNames = memo(({
	names,
	setNames,
	itemsNames,
	open
}: UIAvatarMenuNames) => {

	useEffect(() => {
		if (!open) {
			setNames(null);
			return;
		}

		const t = setTimeout(() => {
			setNames(itemsNames ?? []);
		}, 700);

		return () => {
			clearTimeout(t);
		};
	}, [open, itemsNames]);

	return (
		<div className="flex flex-col gap-0.5">
			{ names === null ? (
				<div className="p-1">
					<Loader color="#fff" size={ 20 }/>
				</div>
			) : (
				names.map((n, i) => <div key={ i }>{ n }</div>)
			) }
		</div>
	);
});

export default MenuNames;