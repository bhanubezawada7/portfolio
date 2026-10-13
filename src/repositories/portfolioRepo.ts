import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  Project,
  Skill,
  Education,
  Experience,
  GalleryItem,
  SiteSettings,
  ResumeMetadata
} from '../types';
import {
  initialProjects,
  initialSkills,
  initialEducation,
  initialExperience,
  initialGallery,
  initialSiteSettings,
  initialResumeMetadata
} from '../data/initialData';

// Collection references
const COLLECTIONS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  EDUCATION: 'education',
  EXPERIENCE: 'experience',
  GALLERY: 'gallery',
  SETTINGS: 'siteSettings',
  RESUME: 'resume',
  INQUIRIES: 'inquiries',
  LOGS: 'activityLogs'
};

/* --- Projects --- */
export async function getProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PROJECTS), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
  } catch (err) {
    console.warn('Failed to load projects from Firestore, falling back to cached/local seed:', err);
    return initialProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(p => p.slug === slug) || null;
}

export async function saveProject(project: Project): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
  await setDoc(docRef, {
    ...project,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
}

/* --- Skills --- */
export async function getSkills(): Promise<Skill[]> {
  try {
    const q = query(collection(db, COLLECTIONS.SKILLS), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
  } catch (err) {
    console.warn('Failed to load skills from Firestore:', err);
    return initialSkills;
  }
}

export async function saveSkill(skill: Skill): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SKILLS, skill.id);
  await setDoc(docRef, { ...skill, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
}

/* --- Education --- */
export async function getEducation(): Promise<Education[]> {
  try {
    const q = query(collection(db, COLLECTIONS.EDUCATION), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Education));
  } catch (err) {
    console.warn('Failed to load education from Firestore:', err);
    return initialEducation;
  }
}

export async function saveEducation(edu: Education): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EDUCATION, edu.id);
  await setDoc(docRef, { ...edu, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteEducation(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EDUCATION, id));
}

/* --- Experience --- */
export async function getExperience(): Promise<Experience[]> {
  try {
    const q = query(collection(db, COLLECTIONS.EXPERIENCE), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
  } catch (err) {
    console.warn('Failed to load experience from Firestore:', err);
    return initialExperience;
  }
}

export async function saveExperience(exp: Experience): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXPERIENCE, exp.id);
  await setDoc(docRef, { ...exp, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id));
}

/* --- Gallery --- */
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
  } catch (err) {
    console.warn('Failed to load gallery from Firestore:', err);
    return initialGallery;
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.GALLERY, item.id);
  await setDoc(docRef, { ...item, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}

/* --- Site Settings --- */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return initialSiteSettings;
  } catch (err) {
    console.warn('Failed to load settings from Firestore:', err);
    return initialSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
  await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}

/* --- Resume Metadata --- */
export async function getResumeMetadata(): Promise<ResumeMetadata> {
  try {
    const docRef = doc(db, COLLECTIONS.RESUME, 'primary');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ResumeMetadata;
    }
    return initialResumeMetadata;
  } catch (err) {
    return initialResumeMetadata;
  }
}

export async function saveResumeMetadata(meta: ResumeMetadata): Promise<void> {
  const docRef = doc(db, COLLECTIONS.RESUME, 'primary');
  await setDoc(docRef, { ...meta, updatedAt: serverTimestamp() }, { merge: true });
}

/* --- Initial Database Seeding --- */
export async function seedDatabase(overwrite = false): Promise<{ success: boolean; message: string }> {
  try {
    const projectsSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
    if (!projectsSnap.empty && !overwrite) {
      return { success: true, message: 'Database already has records. Seeding skipped to preserve existing data.' };
    }

    const batch = writeBatch(db);

    // Seed Settings
    batch.set(doc(db, COLLECTIONS.SETTINGS, 'global'), {
      ...initialSiteSettings,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Seed Resume
    batch.set(doc(db, COLLECTIONS.RESUME, 'primary'), {
      ...initialResumeMetadata,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Seed Projects
    initialProjects.forEach(proj => {
      batch.set(doc(db, COLLECTIONS.PROJECTS, proj.id), {
        ...proj,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    // Seed Skills
    initialSkills.forEach(skill => {
      batch.set(doc(db, COLLECTIONS.SKILLS, skill.id), {
        ...skill,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    // Seed Education
    initialEducation.forEach(edu => {
      batch.set(doc(db, COLLECTIONS.EDUCATION, edu.id), {
        ...edu,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    // Seed Experience
    initialExperience.forEach(exp => {
      batch.set(doc(db, COLLECTIONS.EXPERIENCE, exp.id), {
        ...exp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    // Seed Gallery
    initialGallery.forEach(gal => {
      batch.set(doc(db, COLLECTIONS.GALLERY, gal.id), {
        ...gal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    return { success: true, message: 'Successfully seeded database with verified portfolio content!' };
  } catch (error: any) {
    console.error('Database seed error:', error);
    return { success: false, message: error?.message || 'Failed to seed database.' };
  }
}
