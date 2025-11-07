import Env from '@Calendis/lib/hybrid/env';

const firebaseConfig = {
	apiKey: Env.getPublic('FIREBASE_API_KEY'),
	authDomain: Env.getPublic('FIREBASE_AUTH_DOMAIN'),
	projectId: Env.getPublic('FIREBASE_PROJECT_ID'),
	storageBucket: Env.getPublic('FIREBASE_STORAGE_BUCKET'),
	messagingSenderId: Env.getPublic('FIREBASE_MESSAGING_SENDER_ID'),
	appId: Env.getPublic('FIREBASE_APP_ID'),
	measurementId: Env.getPublic('FIREBASE_MEASUREMENT_ID')
};

export default firebaseConfig;