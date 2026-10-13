import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Inquiry } from '../types';

const COLLECTION_NAME = 'inquiries';

// In-memory timestamp to prevent double click spam
let lastSubmissionTime = 0;

export async function submitInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const now = Date.now();
  if (now - lastSubmissionTime < 4000) {
    throw new Error('Please wait a moment before sending another message.');
  }

  // Basic validation
  if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
    throw new Error('Name, email, and message are required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Please provide a valid email address.');
  }

  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject?.trim() || 'General Inquiry',
      message: data.message.trim(),
      status: 'unread',
      createdAt: serverTimestamp()
    });

    lastSubmissionTime = now;
    return { success: true, message: 'Thank you! Your message has been sent successfully.' };
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    // If Firestore write fails (e.g. offline or strict security rules before auth), report clearly
    throw new Error(error?.message || 'Failed to submit inquiry. Please try again or reach out via email.');
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status || 'unread',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn('Failed to load inquiries:', err);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'resolved'): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

export async function deleteInquiry(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
