'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cl } from '@Calendis/lib/client/utils';
import Link from 'next/link';
import type { Crumb, UIBreadcrumbs } from '@Calendis/types/ui';

const titleCase = (s: string): string =>
	s.replace(/[-_]+/g, ' ').trim().replace(/\p{L}+/gu, w => w.charAt(0).toUpperCase() + w.slice(1));

const matchHidden = (val: string, patterns: (string | RegExp)[]): boolean =>
	patterns.some(p => (typeof p === 'string' ? p === val : p.test(val)));

const labelFor = (segment: string, pathSoFar: string, overrides: Record<string, string>): string =>
	overrides[pathSoFar] ??
	overrides[segment] ??
	titleCase(decodeURIComponent(segment));

const Breadcrumbs = ({
	overrides = {},
	hiddenOn = [],
	localePrefixes = ['fr', 'en'],
	className = ''
}: UIBreadcrumbs) => {
	const pathname = usePathname() ?? '/';

	const purePath = pathname.split(/[?#]/)[0] || '/';
	const raw = purePath.replace(/^\/+|\/+$/g, '');
	const parts = raw ? raw.split('/') : [];

	const trimmed =
		parts.length > 0 && localePrefixes.includes(parts[0]) ? parts.slice(1) : parts;
	const visibleSegments = trimmed.filter(seg => !matchHidden(seg, hiddenOn));

	const crumbs: Crumb[] = [];
	let acc = '';
	visibleSegments.forEach((seg, idx) => {
		acc += `/${ seg }`;
		const isLast = idx === visibleSegments.length - 1;
		const label = labelFor(seg, acc, overrides);
		crumbs.push({
			label,
			link: !isLast,
			href: !isLast ? acc : undefined
		});
	});

	if (crumbs.length === 0) return null;

	return (
		<nav aria-label="Breadcrumb" className={ cl(className, 'px-0') }>
			<ol className="flex flex-wrap items-center gap-1 h-6 text-sm text-muted-foreground">
				<Link href={'/welcome'} aria-current="page" className="font-semibold hover:underline select-none">
					Accueil
				</Link>
				<span className="select-none" aria-hidden>
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height={ 24 } width={ 24 } viewBox="0 0 24 24">
						<path d="M15.78,11.28a.75.75,0,0,1,.22.53v.38a.77.77,0,0,1-.22.53l-5.14,5.13a.5.5,0,0,1-.71,0l-.71-.71a.49.49,0,0,1,0-.7L13.67,12,9.22,7.56a.5.5,0,0,1,0-.71l.71-.7a.5.5,0,0,1,.71,0Z"/>
					</svg>
				</span>
				{ crumbs.map((c, i) => (
					<li key={ c.href ?? `last-${ i }` } className="flex items-center gap-1">
						{ i > 0 && (
							<span className="select-none" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height={ 24 } width={ 24 } viewBox="0 0 24 24">
                  <path d="M15.78,11.28a.75.75,0,0,1,.22.53v.38a.77.77,0,0,1-.22.53l-5.14,5.13a.5.5,0,0,1-.71,0l-.71-.71a.49.49,0,0,1,0-.7L13.67,12,9.22,7.56a.5.5,0,0,1,0-.71l.71-.7a.5.5,0,0,1,.71,0Z"/>
                </svg>
              </span>
						) }
						{ c.link && c.href ? (
							<Link href={ c.href } className="font-semibold hover:underline select-none">
								{ c.label }
							</Link>
						) : (
							<span aria-current="page" className="font-semibold select-none">
                { c.label }
              </span>
						) }
					</li>
				)) }
			</ol>
		</nav>
	);
};

export default Breadcrumbs;