import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import Env from '@Calendis/lib/hybrid/env';

class FirebaseServer {
	private readonly app: App;
	private authInstance: Auth | null = null;
	private dbInstance: Firestore | null = null;
	private storageInstance: Storage | null = null;

	/**
	 * Creates a new Firebase Admin service instance for server-side operations.
	 * @throws {Error} If required environment variables are missing or invalid.
	 */
	constructor() {
		this.app = !getApps().length
			? initializeApp({
				credential: cert({
					projectId: Env.getPrivate('FIREBASE_PROJECT_ID'),
					clientEmail: Env.getPrivate('FIREBASE_CLIENT_EMAIL'),
					privateKey: Env.getPrivate('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
				})
			})
			: getApps()[0];
	}

	/**
	 * Returns the Firebase Admin Authentication service.
	 * @returns {Auth} The Firebase Admin Authentication service.
	 */
	get auth(): Auth {
		if (!this.authInstance) {
			this.authInstance = getAuth();
		}
		return this.authInstance;
	}

	/**
	 * Returns the Firestore database instance for server-side use.
	 * @returns {Firestore} The Firestore Admin SDK instance.
	 */
	get db(): Firestore {
		if (!this.dbInstance) {
			this.dbInstance = getFirestore(this.app);
		}
		return this.dbInstance;
	}

	/**
	 * Returns the Firebase Storage service for server-side file operations.
	 * @returns {Storage} The Firebase Storage Admin SDK instance.
	 */
	get storage(): Storage {
		if (!this.storageInstance) {
			this.storageInstance = getStorage(this.app);
		}
		return this.storageInstance;
	}
}

export default FirebaseServer;