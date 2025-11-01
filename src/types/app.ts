import React from 'react';
import { type environments, hostname } from '@Calendis/config/app';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

/**
 * React children property
 */
export type ChildrenProp = Readonly<{
	children: React.ReactNode
}>;

/**
 * Global state of app
 */
export interface AppState {
	isOnline: boolean;
	setOnline: (online: boolean) => void;
};

/**
 * Metadata configuration for page SEO.
 */
export interface ConfigMetadatas {
	title?: string;
	description?: string;
	index?: boolean;
	follow?: boolean;
};

/**
 * Options for client-side cookie handling.
 */
export type CookieClientOptions = {
	path?: string;
	domain?: string;
	maxAge?: number;
	sameSite?: 'Strict' | 'Lax' | 'None';
};

export type EnvironmentsNode = keyof Omit<typeof hostname, 'testing'>;
export type EnvironmentsApp = keyof typeof hostname;

export interface MiddlewareResponseInit {
	request: {
		headers: Headers;
	}
}

/**
 * Represents an application environment.
 */
export type Environment = typeof environments[number];