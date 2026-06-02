import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';

// Support VITE_ environment variable overrides for custom hosting environments like Vercel
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DB_ID || defaultFirebaseConfig.firestoreDatabaseId || "(default)"
};

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId === "" || firebaseConfig.firestoreDatabaseId === "(default)" 
    ? undefined 
    : firebaseConfig.firestoreDatabaseId
);

// Suppress internal connection failure warnings in offline/sandbox environments
try {
  setLogLevel('error');
} catch (e) {
  // Ignore fallback error
}

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

// Standard diagnostic validator
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      const isOfflineOrUnavailable = 
        error.message.includes('the client is offline') || 
        error.message.includes('unavailable') || 
        (error as any).code === 'unavailable';
      if (isOfflineOrUnavailable) {
        console.warn("Firebase configuration/network check status: Operating in offline mode with cached access.");
      } else {
        console.warn("Firebase configuration/network check status details:", error.message);
      }
    }
  }
}
testConnection();

// Mandatory Firebase Integration diagnostic tracker
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Security / Auth Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
