'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseContextValue } from '@Calendis/types/firebase';
import type { ChildrenProp } from '@Calendis/types/app';
import FirebaseClient from '@Calendis/services/firebase/client';

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const FirebaseProvider = ({ children }: ChildrenProp) => {
	const firebase = useMemo(() => FirebaseClient.getInstance(), []);

	const value = useMemo<FirebaseContextValue>(
		() => ({
			auth: firebase.auth,
			db: firebase.db,
			storage: firebase.storage
		}),
		[firebase]
	);

	return (
		<FirebaseContext.Provider value={value}>
			{ children }
		</FirebaseContext.Provider>
	)
}

export const useFirebase = (): FirebaseContextValue => {
	const ctx = useContext(FirebaseContext);
	if (!ctx) {
		throw new Error('useFirebase() must be used within a <FirebaseProvider>');
	}
	return ctx;
};

export default FirebaseProvider;