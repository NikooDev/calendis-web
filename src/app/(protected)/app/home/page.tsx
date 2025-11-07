import React from 'react';
import type { Metadata } from 'next';
import metadatas from '@Calendis/config/metadatas';

export const metadata: Metadata = metadatas({ title: 'Calendis', index: false, follow: false });

const HomePage = () => {
	return (
		<section>

		</section>
	);
};

export default HomePage;