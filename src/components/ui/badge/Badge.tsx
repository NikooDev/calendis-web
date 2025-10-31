'use client';

import React from 'react';
import type { BadgeColor, BadgePlacement, BadgeSize, UIBadge } from '@Calendis/types/ui';
import { cl } from '@Calendis/lib/client/utils';

const Badge = (props: UIBadge) => {
	const {
		size = 'sm',
		color = 'theme',
		variant = 'solid',
		className,
		placement = 'top-right',
		title,
		children
	} = props;

	const textSizeMap: Record<BadgeSize, string> = {
		sm: 'px-2.5 py-0.5 text-[11px] font-bold',
		md: 'px-3 py-0.5 text-[14px] font-bold'
	};

	const countSizeMap: Record<BadgeSize, string> = {
		sm: 'h-5 min-w-[1.25rem] px-1.5 text-[11px] font-bold pb-[0.5px]',
		md: 'h-6 min-w-[1.5rem]  px-1.5 text-[14px] font-bold pb-[0.5px]'
	};

	const solidMap: Record<BadgeColor, string> = {
		theme: 'bg-theme text-white',
		neutral: 'bg-slate-600 text-white',
		danger: 'bg-danger text-white'
	};

	const softMap: Record<BadgeColor, string> = {
		theme: 'bg-theme/15 text-theme',
		neutral: 'bg-slate-400/15 text-foreground',
		danger: 'bg-danger/15 text-danger'
	};

	const placementCls: Record<BadgePlacement, string> = {
		'top-right': 'top-0 right-0 -translate-y-1/3 translate-x-1/3',
		'top-left': 'top-0 left-0 -translate-y-1/3 -translate-x-1/3',
		'bottom-right': 'bottom-0 right-0 translate-y-1/3 translate-x-1/3',
		'bottom-left': 'bottom-0 left-0 translate-y-1/3 -translate-x-1/3'
	};

	const isNumber = 'count' in props;
	const palette = (variant === 'solid' ? solidMap : softMap)[color];
	const sizing = isNumber ? countSizeMap[size] : textSizeMap[size];

	let content: string | number | null;

	if (isNumber) {
		const { count, max = 99, showZero = false } = props;
		if (count === 0 && !showZero) content = null;
		else content = count > max ? `${ max }+` : count;
	} else {
		content = props.text;
	}

	if (children) {
		return (
			<span className="relative inline-flex">
        { children }
				{ content != null && (
					<span
						className={ cl(
							'absolute inline-flex items-center justify-center rounded-full select-none font-bold font-sans',
							sizing,
							palette,
							placementCls[placement],
							className
						) }
						title={ title }
					>
            { content }
          </span>
				) }
      </span>
		);
	}

	if (content == null) return null;
	return (
		<span
			className={ cl(
				'inline-flex items-center justify-center rounded-full select-none font-bold font-sans',
				sizing,
				palette,
				className
			) }
			title={ title }
		>
      { content }
    </span>
	);
};

export default Badge;