import type { Metadata } from 'next';
import type { ConfigMetadatas } from '@Calendis/types/app';
import Env from '@Calendis/lib/hybrid/env';

const defaultTitle = 'Calendis';
const defaultDescription = 'L\'application unique pour planifier la distribution du calendrier, gérer vos événements et suivre la vie de l’amicale.';

/**
 * Generate Next.js metadata with default Calendis values.
 * Supports custom title, description, and robots directives.
 * @param {ConfigMetadatas} [config] - Optional metadata overrides.
 * @returns {Promise<Metadata>} Generated metadata object.
 */
const metadatas = (config?: ConfigMetadatas): Metadata => {
	const { title: t, description: d, index = true, follow = true } = config ?? {};

	console.log('env', Env.isEnvironment('production'));

	return {
		metadataBase: Env.isEnvironment('production') ? new URL('https://www.calendis.fr') : new URL('http://localhost:3000'),
		title: t ?? defaultTitle,
		description: d ?? defaultDescription,
		robots: {
			index,
			follow
		},
		icons: {
			icon: [
				{
					rel: 'icon',
					type: 'image/ico',
					url: '/icons/favicon-light.ico',
					media: '(prefers-color-scheme: light)',
					sizes: '16x16'
				},
				{
					rel: 'icon',
					type: 'image/ico',
					url: '/icons/favicon-dark.ico',
					media: '(prefers-color-scheme: dark)',
					sizes: '16x16'
				}
			],
			apple: [
				{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }
			]
		},
		manifest: '/manifest.webmanifest'
	} as Metadata;
};

export default metadatas;