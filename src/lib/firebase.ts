import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { ApiKeys } from "@/context/DataContext";

export const getFirebaseAuth = (apiKeys: ApiKeys) => {
  if (!apiKeys.firebaseApiKey || !apiKeys.firebaseProjectId) {
    throw new Error("Firebase configuration is missing");
  }

  const firebaseConfig = {
    apiKey: apiKeys.firebaseApiKey,
    authDomain: apiKeys.firebaseAuthDomain,
    projectId: apiKeys.firebaseProjectId,
    storageBucket: apiKeys.firebaseStorageBucket,
    messagingSenderId: apiKeys.firebaseMessagingSenderId,
    appId: apiKeys.firebaseAppId,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getAuth(app);
};

export const googleProvider = new GoogleAuthProvider();

export function getFirebaseErrorMessage(error: any): string {
  const code = error?.code;
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in request was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser.';
    case 'auth/invalid-phone-number':
      return 'The phone number provided is invalid.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/code-expired':
      return 'The OTP code has expired. Please request a new one.';
    case 'auth/invalid-verification-code':
      return 'The OTP code is invalid. Please check and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}
