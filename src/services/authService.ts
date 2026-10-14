import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_CONFIG } from '../config/firebase';

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const allowed = [
    'bhanu1@gmail.com',
    'bhanubezawada1@gmail.com',
    'bhanusri15@gmail.com',
    ADMIN_CONFIG.adminEmail.toLowerCase(),
    ...(ADMIN_CONFIG.adminEmails ? ADMIN_CONFIG.adminEmails.map((e: string) => e.toLowerCase()) : [])
  ];
  return allowed.includes(normalized);
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  if (cred.user && (isAuthorizedAdminEmail(cred.user.email) || cred.user.uid === ADMIN_CONFIG.adminUid)) {
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        role: 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not sync admin role in Firestore on login:', err);
    }
  }
  return cred.user;
}

export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }

  // Record user profile in Firestore
  try {
    const isOwner = cred.user.uid === ADMIN_CONFIG.adminUid || isAuthorizedAdminEmail(email);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || null,
      role: isOwner ? 'admin' : 'user',
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to record user record in Firestore:', err);
  }

  return cred.user;
}

export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  if (cred.user) {
    try {
      const isOwner = cred.user.uid === ADMIN_CONFIG.adminUid || isAuthorizedAdminEmail(cred.user.email);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        role: isOwner ? 'admin' : 'user',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to update Google user record in Firestore:', err);
    }
  }
  return cred.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Check verified admin UID from prompt
  if (user.uid === ADMIN_CONFIG.adminUid) {
    return true;
  }

  // 2. Check authorized admin email (e.g. bhanu1@gmail.com)
  if (isAuthorizedAdminEmail(user.email)) {
    // Proactively persist role: 'admin' in Firestore so subsequent checks and rules succeed
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      // ignore
    }
    return true;
  }

  // 3. Check custom claims if present
  try {
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin') {
      return true;
    }
  } catch (e) {
    // ignore
  }

  // 4. Check Firestore role
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      return true;
    }
  } catch (e) {
    // ignore
  }

  return false;
}

