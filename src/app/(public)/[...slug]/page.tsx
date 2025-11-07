import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import metadatas from '@Calendis/config/metadatas';

export const metadata: Metadata = metadatas({ title: 'Contenu indisponible • Calendis', index: false, follow: false });

const CatchAll = () => {
	notFound();
};

export default CatchAll;