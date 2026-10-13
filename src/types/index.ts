export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'Engineering' | 'Web Development' | 'Machine Learning' | 'Digital Marketing';
  technologies: string[];
  thumbnail: string | null;
  gallery: string[];
  liveDemoUrl?: string | null;
  sourceCodeUrl?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  startDate?: string;
  completionDate?: string;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Web Development' | 'Digital Marketing' | 'Creative & Productivity' | 'Technical Tools';
  proficiency?: number | null;
  published: boolean;
  sortOrder: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  sortOrder: number;
  published: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  type: 'work' | 'internship';
  duration?: string;
  period?: string;
  responsibilities?: string[];
  description?: string;
  technologies?: string[];
  certificateUrl?: string | null;
  published: boolean;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  mediaType: 'image' | 'video';
  altText: string;
  caption?: string;
  category?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  publicId?: string;
  width?: number;
  height?: number;
  createdAt?: string | number | null;
}

export interface ResumeMetadata {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: string;
  lastUpdated: string;
  downloadLabel: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string | number | any;
}

export interface SocialLink {
  platform: 'LinkedIn' | 'GitHub' | 'Twitter' | 'Instagram' | 'Email' | 'WhatsApp';
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  ownerName: string;
  primaryEmail: string;
  phone?: string;
  phoneVerified: boolean;
  location?: string;
  heroHeadline: string;
  heroBio: string;
  heroPortrait: string;
  availabilityStatus: string;
  defaultTheme: 'light' | 'dark' | 'system';
  whatsAppNumber: string;
  whatsAppPrefilledMessage: string;
  resumeUrl: string;
  aboutShortBio: string;
  aboutFullBio: string;
  careerObjective: string;
  strengths: string[];
  sectionVisibility: {
    hero: boolean;
    about: boolean;
    skills: boolean;
    education: boolean;
    experience: boolean;
    projects: boolean;
    gallery: boolean;
    resume: boolean;
    contact: boolean;
  };
  socialLinks: SocialLink[];
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}

export interface MediaAsset {
  id: string;
  publicId: string;
  secureUrl: string;
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  originalFilename?: string;
  createdAt: string | number | any;
}
