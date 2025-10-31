import React, { type Dispatch, type SetStateAction } from 'react';
import type { TippyProps } from '@tippyjs/react';
import { iconPaths } from '@Calendis/components/ui/icon/paths';

export type AvatarSize = { textSize: string; size: number; };

/**
 * Avatar component
 */
export interface UIAvatar extends React.HTMLAttributes<HTMLSpanElement> {
	src?: string;
	alt?: string;
	name: string;
	sex?: 'woman' | 'man';
	itemsNames?: string[];
	size?: number;
	isGroup?: boolean;
	showTooltip?: boolean;
	priority?: boolean;
	offset?: [number, number];
	classNameContainer?: string;
	classNameImage?: string;
}

export interface UIAvatarMenuNames {
	itemsNames: string[] | undefined;
	names: string[] | null;
	setNames: Dispatch<SetStateAction<string[] | null>>;
	open: boolean;
}

export interface UIAvatarGroup extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	max?: number;
	border?: boolean;
	borderColor?: string;
	classNameContainer?: string;
	avatarProps?: Omit<UIAvatar, 'name' | 'src' | 'alt'>;
}

/**
 * Badge component
 */
export type BadgeColor = 'theme' | 'neutral' | 'danger';
export type BadgeSize = 'sm' | 'md';
export type BadgeVariant = 'solid' | 'soft';
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface CommonBadgeProps {
	size?: BadgeSize;
	color?: BadgeColor;
	variant?: BadgeVariant;
	className?: string;
	placement?: BadgePlacement;
	title?: string;
	children?: React.ReactNode;
}

interface TextBadgeProps extends CommonBadgeProps {
	text: string;
}

interface NumberBadgeProps extends CommonBadgeProps {
	count: number;
	max?: number;
	showZero?: boolean;
}

export type UIBadge = TextBadgeProps | NumberBadgeProps;

/**
 * Breadcrumbs component
 */
export interface UIBreadcrumbs {
	overrides?: Record<string, string>;
	hiddenOn?: (string | RegExp)[];
	localePrefixes?: string[];
	className?: string;
}

export type Crumb = { label: string; href?: string; link: boolean };

/**
 * Icon component
 */
interface CommonIconProps {
	size?: number | string;
	fill?: string;
	viewBox?: string;
	className?: string;
	title?: string;
}

export type IconName = keyof typeof iconPaths;

export interface IconByNameProps extends CommonIconProps {
	path: IconName;
}

export interface IconByPathProps extends CommonIconProps {
	d: string | { d: string; fill?: string };
}

export type UIIcon = IconByNameProps | IconByPathProps;

/**
 * Loader composant
 */
export interface UILoader {
	size?: number;
	className?: string;
	color?: string;
	strokeWidth?: number;
}

/**
 * Tooltip component
 */
export interface UITooltip extends Omit<TippyProps, 'content'> {
	content?: React.ReactNode;
}

/**
 * Logo component
 */
export interface UILogo {
	animate?: boolean;
	strokeWidth?: number;
	size?: number;
	fill?: string;
	className?: string;
	onAnimationEnd?: () => void;
}