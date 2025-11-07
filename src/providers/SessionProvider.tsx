'use client';

import { useEffect, useEffectEvent } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { debounceImmediate } from '@Calendis/lib/client/helpers';
import { useFirebase } from '@Calendis/providers/FirebaseProvider';
import type { ChildrenProp } from '@Calendis/types/app';

const SessionProvider = ({ children }: ChildrenProp) => {
	const pathname = usePathname();
	const router = useRouter();
	const { auth } = useFirebase()

	const checkSession = useEffectEvent(async () => {
		const res = await fetch('/api/auth/session', { method: 'GET', credentials: 'include' });
		const isAuth = res.ok;

		if (!isAuth && pathname !== '/login') {
			await signOut(auth);
			router.replace('/auth/login');
			return;
		}

		if (isAuth && pathname === '/login') {
			router.replace('/welcome');
		}
	});

	useEffect(() => {
		if (pathname === '/login') return;
		void checkSession();

		const throttledCheck = debounceImmediate(() => void checkSession(), 3000);

		const onFocus = throttledCheck;
		const onVisibility = () => {
			if (document.visibilityState === 'visible') throttledCheck();
		}

		window.addEventListener('focus', onFocus);
		document.addEventListener('visibilitychange', onVisibility);

		return () => {
			window.removeEventListener('focus', onFocus);
			document.removeEventListener('visibilitychange', onVisibility);
		}
	}, [checkSession, pathname]);

	return children;
}

export default SessionProvider;