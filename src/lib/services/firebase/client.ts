import { type FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { type Auth, initializeAuth, getAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { type FirebaseStorage, getStorage, connectStorageEmulator } from 'firebase/storage';
import {
	Firestore,
	getFirestore,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
	connectFirestoreEmulator
} from 'firebase/firestore';
import firebaseConfig from '@Calendis/config/firebase';
import Env from '@Calendis/lib/hybrid/env';

/**
 * Service class for initializing and accessing Firebase client-side instances.
 */
class FirebaseClient {
	private static instance: FirebaseClient;
	private app: FirebaseApp;
	private authInstance: Auth | null = null;
	private dbInstance: Firestore | null = null;
	private storageInstance: FirebaseStorage | null = null;

	constructor(
		private readonly config = firebaseConfig
	) {
		this.app = this.init();

		if (Env.isEnvironment('development')) {
			this.connectEmulators();
			console.info('✓ Firebase emulators connected (dev mode)');
		}
	}

	public static getInstance(): FirebaseClient {
		if (!FirebaseClient.instance) {
			FirebaseClient.instance = new FirebaseClient();
		}
		return FirebaseClient.instance;
	}

	/**
	 * Initializes Firebase according to the current environment.
	 * @returns {FirebaseApp | null} The initialized Firebase app or null if in demo mode.
	 * @throws {Error} If the environment is unknown.
	 * @private
	 */
	private init(): FirebaseApp {
		if (Env.isDemo()) {
			return { name: 'demo' } as FirebaseApp;
		}

		try {
			this.app = initializeApp(this.config);

			if (!Env.isEnvironment('production')) {
				console.info(`✓ Firebase initialized for ${process.env.NEXT_PUBLIC_ENVIRONMENT}${Env.isDemo() ? ' (demo)' : ''} `);
			}
		} catch {
			this.app = getApp();
		}

		return this.app;
	}

	private connectEmulators() {
		try {
			const db = this.db;
			const storage = this.storage;

			connectFirestoreEmulator(db, '127.0.0.1', 8080);
			connectStorageEmulator(storage, '127.0.0.1', 9199);
		} catch (error) {
			console.warn('Failed to connect Firebase emulators:', error);
		}
	}

	/**
	 * Returns the Firebase Authentication instance for the client.
	 * @returns {Auth} The Firebase Authentication instance.
	 */
	get auth(): Auth {
		if (!this.authInstance) {
			try {
				this.authInstance = initializeAuth(this.app, { persistence: [indexedDBLocalPersistence] });
			} catch {
				this.authInstance = getAuth(this.app);
			}
		}

		return this.authInstance;
	}

	/**
	 * Returns the Firestore instance for the client.
	 * @returns {Firestore} The Firestore instance.
	 */
	get db(): Firestore {
		if (Env.isDemo()) {
			throw new Error('Firestore is disabled in demo mode.');
		}

		if (!this.dbInstance) {
			try {
				this.dbInstance = initializeFirestore(this.app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
			} catch {
				this.dbInstance = getFirestore(this.app);
			}
		}

		return this.dbInstance;
	}

	/**
	 * Returns the Firebase Storage instance for the client.
	 * @returns {FirebaseStorage} The Firebase Storage instance.
	 */
	get storage(): FirebaseStorage {
		if (Env.isDemo()) {
			throw new Error('Firebase Storage is disabled in demo mode.');
		}

		if (!this.storageInstance) {
			this.storageInstance = getStorage(this.app);
		}
		return this.storageInstance;
	}
}

export default FirebaseClient;