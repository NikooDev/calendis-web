import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

export type FirebaseContextValue = {
	auth: Auth;
	db: Firestore;
	storage: FirebaseStorage;
};