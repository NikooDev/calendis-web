'use client';

import React from 'react';
import { getIconPath } from '@Calendis/components/ui/icon/paths';
import { cl } from '@Calendis/lib/client/utils';
import type { IconName, UIIcon } from '@Calendis/types/ui';

const Icon = (props: UIIcon) => {
	const { size = 24, fill = 'currentColor', viewBox = '0 0 24 24', className, title } = props;
	const d = 'path' in props ? getIconPath(props.path as IconName) : props.d;
	if (!d) return null;

	const iconStyle = cl('pointer-events-none', className);

	return (
		<svg viewBox={ viewBox }
				 fill={ fill }
				 width={ size }
				 height={ size }
				 className={ iconStyle }
				 role={ title ? 'img' : 'presentation' }
				 aria-hidden={ title ? undefined : true }>
			{ title ? <title>{ title }</title> : null }
			{ typeof d === 'string' ? <path d={ d }/> : Array.isArray(d) ? (
				d.map((part, i) => (
					<path key={ i } d={ part.d } fill={ part.fill ?? fill }/>
				))
			) : null }
		</svg>
	);
};

export default Icon;