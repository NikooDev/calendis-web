import localFont from 'next/font/local';
import { twMerge } from 'tailwind-merge';

const raleway = localFont({
	src: [
		{
			path: './../assets/fonts/raleway/Raleway.woff2',
			style: 'normal'
		}
	],
	preload: true,
	variable: '--font-default',
	display: 'swap'
});

const montserrat = localFont({
	src: [
		{
			path: './../assets/fonts/montserrat/MontserratAlternates-SemiBold.woff2',
			weight: '600',
			style: 'normal'
		},
		{
			path: './../assets/fonts/montserrat/MontserratAlternates-Bold.woff2',
			weight: '700',
			style: 'normal'
		},
		{
			path: './../assets/fonts/montserrat/MontserratAlternates-ExtraBold.woff2',
			weight: '800',
			style: 'normal'
		},
		{
			path: './../assets/fonts/montserrat/MontserratAlternates-Black.woff2',
			weight: '900',
			style: 'normal'
		}
	],
	preload: true,
	variable: '--font-title',
	display: 'swap'
});

export const fonts = twMerge(raleway.variable, montserrat.variable);