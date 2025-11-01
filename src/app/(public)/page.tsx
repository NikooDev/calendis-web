import React from 'react';
import Link from 'next/link';

const HomePage = () => {
	return (
		<section>
			<Link href={'/app'}>App</Link>
		</section>
	);
};

export default HomePage;