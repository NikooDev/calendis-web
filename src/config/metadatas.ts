import type { Metadata } from 'next';
import type { MetadatasProps } from '@Calendis/types/app';

export const defaultTitle = 'Calendis';
export const defaultDescription = 'L\'application unique pour planifier la distribution du calendrier, gérer vos événements et suivre la vie de l’amicale.';

const metadatas = (config?: MetadatasProps): Metadata => {
	const { title: t, description: d, index, follow } = config ?? {};

	return {
		title: t ?? defaultTitle,
		description: d ?? defaultDescription,
		robots: {
			index: index ?? true,
			follow: follow ?? true
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
	}
}

export default metadatas;