import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const host = new URL(req.url).hostname;

	const isApp = host.startsWith('app.');
	const startUrl = isApp ? '/app' : '/';

	return NextResponse.json({
		name: 'Calendis',
		short_name: 'Calendis',
		description: 'La planification connectée des tournées de calendriers.',
		start_url: startUrl,
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#131920',
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