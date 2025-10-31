'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { cl } from '@Calendis/lib/client/utils';
import { Tooltip } from '@Calendis/components/ui';
import Image from 'next/image';
import MenuNames from '@Calendis/components/ui/avatar/core/MenuNames';
import type { AvatarSize, UIAvatar } from '@Calendis/types/ui';

const Avatar = memo(({
	src,
	alt,
	name,
	sex = 'man',
	size = 50,
	priority,
	isGroup,
	showTooltip = true,
	itemsNames,
	classNameContainer,
	classNameImage,
	offset= [0, 10],
	...props
}: UIAvatar) => {
	const [open, setOpen] = useState(false);
	const [names, setNames] = useState<string[] | null>(null);
	const [error, setError] = useState(false);
	const label = alt ?? name ?? 'Avatar';
	const isUrl = Boolean(src) && !error;
	const defaultAvatar = sex === 'woman' ? '/img/avatar-woman.webp' : '/img/avatar-man.webp';

	const getSize = useMemo((): AvatarSize => {
		return {
			textSize: `${ size }px`,
			size: size
		};
	}, [size]);

	const onShow = useCallback(() => {
		setOpen(true);
	}, []);

	const onHidden = useCallback(() => {
		setOpen(false);
	}, []);

	const groupClass = isGroup && 'border-2 border-background hover:z-20 hover:scale-125';

	return (
		<span role="img" aria-label={ label }
					style={ { '--avatar-size': `${ size }px` } as React.CSSProperties }
					className={ cl('flex items-center justify-center overflow-hidden transition duration-200 rounded-full z-10 select-none h-[var(--avatar-size)]', groupClass, classNameContainer) } { ...props }>
			{
				isGroup ? (
					<Tooltip placement="bottom" onShow={ onShow } onHidden={ onHidden }
									 disabled={ !showTooltip || (itemsNames ? itemsNames.length === 0 : true) }
									 offset={ offset } content={ <MenuNames setNames={ setNames } names={ names } open={ open } itemsNames={ itemsNames }/> }>
						<span className={ cl('flex items-center justify-center text-default-text hover:cursor-pointer hover:bg-header rounded-full hover:shadow-md transition-colors duration-300 dark:text-white font-sans font-bold text-sm h-[var(--avatar-size)]') }>
							{ name }
						</span>
					</Tooltip>
				) : (
					<Tooltip content={ label } disabled={ !showTooltip } offset={ offset } placement="bottom">
						{
							isUrl ? (
								<Image src={ src as string }
											 alt={ label }
											 className={ cl('h-full w-full object-cover rounded-full relative', classNameImage) }
											 sizes={ getSize.textSize }
											 width={ getSize.size }
											 height={ getSize.size }
											 priority={ priority }
											 quality={ 100 }
											 onError={ () => setError(true) }/>
							) : (
								<Image src={ defaultAvatar }
											 alt={ label }
											 className={ cl('h-full w-full object-cover rounded-full relative top-0.5', classNameImage) }
											 sizes={ getSize.textSize }
											 width={ getSize.size }
											 height={ getSize.size }
											 priority={ priority }
											 quality={ 100 }
											 onError={ () => setError(true) }/>
							)
						}
					</Tooltip>
				)
			}
		</span>
	);
});

export default Avatar;