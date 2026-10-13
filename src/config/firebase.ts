import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCk74217K7n1nx2p0GRYhZfZFKrsRB5iT0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-814e4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-814e4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-814e4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "25324015481",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:25324015481:web",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-11GJ5GQP07"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (fallback operational):", error);
  // Re-attempt safe fallback initialization
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };

export const ADMIN_CONFIG = {
  adminUid: import.meta.env.VITE_ADMIN_UID || "rcbd1D9HHRPjSVMFrwnCNy0frYm1",
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "bhanubezawada1@gmail.com"
};
