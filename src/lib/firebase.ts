import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const getFirebaseAuth = (apiKeys?: any) => {
  if (apiKeys?.firebaseApiKey) {
    // This is a bit tricky since initializeApp is usually called once.
    // For now, we'll return the default auth but in a real app you might re-init.
    return auth;
  }
  return auth;
};

export const getFirebaseConfig = (apiKeys?: any) => {
  if (apiKeys?.firebaseApiKey) {
    return {
      apiKey: apiKeys.firebaseApiKey,
      authDomain: apiKeys.firebaseAuthDomain,
      projectId: apiKeys.firebaseProjectId,
      storageBucket: apiKeys.firebaseStorageBucket,
      messagingSenderId: apiKeys.firebaseMessagingSenderId,
      appId: apiKeys.firebaseAppId,
    };
  }
  return firebaseConfig;
};

export const getFirebaseErrorMessage = (error: any) => {
  if (typeof error === 'string') return error;
  return error.message || 'An unknown error occurred';
};
