'use client';

import React, { Children, memo, useMemo } from 'react';
import type { UIAvatar, UIAvatarGroup } from '@Calendis/types/ui';
import { cl } from '@Calendis/lib/client/utils';
import { Avatar } from '@Calendis/components/ui';

const AvatarGroup = memo(({
	children,
	max,
	border,
	borderColor,
	classNameContainer,
	avatarProps,
	...props
}: UIAvatarGroup) => {
	const items = Children.toArray(children).filter(Boolean) as React.ReactElement<UIAvatar>[];
	const count = items.length;

	const names = useMemo(() => {
		if (!max || count <= max) return [];
		return items
			.map(el => (el.props as UIAvatar).name)
			.filter(Boolean)
			.slice(max)
			.sort((a, b) => a!.toLowerCase().localeCompare(b!.toLowerCase()));
	}, [children, max]);

	return (
		<div className={ cl('flex items-center group -space-x-4', classNameContainer) } { ...props }>
			{ (!max || count <= max) ? items : (
				<>
					{ items.slice(0, max) }
					<div className="ml-2">
						<Avatar
							{ ...avatarProps }
							isGroup={ true }
							size={ avatarProps?.size ?? 50 }
							className={ avatarProps?.className }
							name={ `+${ count - max }` }
							itemsNames={ names }
							alt={ `Plus ${ count - max }` }
						/>
					</div>
				</>
			) }
		</div>
	);
});

export default AvatarGroup;