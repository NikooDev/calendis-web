import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { domain } from '@Calendis/config/app';
import { defaultDescription, defaultTitle } from '@Calendis/config/metadatas';

export const GET = async (req: NextRequest) => {
	const header = await headers();
	const hostname = header.get('x-forwarded-host') || req.headers.get('host');

	if (hostname !== domain.app.production && hostname !== domain.app.development) {
		return NextResponse.json({
			name: '',
			short_name: '',
			start_url: '/',
			display: 'browser',
			icons: []
		});
	}

	return NextResponse.json({
		name: defaultTitle,
		short_name: defaultTitle,
		description: defaultDescription,
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#454653',
		icons: [
			{
				src: '/icons/icon-96x96.png',
				sizes: '96x96',
				type: 'image/png'
			},
			{
				src: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			},
			{ src: '/icons/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png'
			}
		]
	});
}