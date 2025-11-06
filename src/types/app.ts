import React from 'react';
import { environments } from '@Calendis/config/app';

export type ChildrenProp = Readonly<{
	children: React.ReactNode
}>

export interface MetadatasProps {
	title?: string;
	description?: string;
	index?: boolean;
	follow?: boolean;
}

export type Environment = typeof environments[number];
export type SubDomain = 'www' | 'app' | 'demo';

export interface MiddlewareResponseInit {
	request: {
		headers: Headers;
	}
}