import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { GallerySection } from '../components/portfolio/GallerySection';
import { ResumeSection } from '../components/portfolio/ResumeSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Footer } from '../components/layout/Footer';
import { SectionSkeleton } from '../components/common/LoadingSkeleton';

import {
  getProjects,
  getSkills,
  getEducation,
  getExperience,
  getGallery,
  getSiteSettings,
  getResumeMetadata
} from '../repositories/portfolioRepo';
import type {
  Project,
  Skill,
  Education,
  Experience,
  GalleryItem,
  SiteSettings,
  ResumeMetadata
} from '../types';
import { initialSiteSettings, initialResumeMetadata } from '../data/initialData';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [resume, setResume] = useState<ResumeMetadata>(initialResumeMetadata);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, e, exp, g, set, res] = await Promise.all([
          getProjects(),
          getSkills(),
          getEducation(),
          getExperience(),
          getGallery(),
          getSiteSettings(),
          getResumeMetadata()
        ]);
        setProjects(p);
        setSkills(s);
        setEducation(e);
        setExperience(exp);
        setGallery(g);
        setSettings(set);
        setResume(res);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <div className="pt-32">
          <SectionSkeleton />
        </div>
      </div>
    );
  }

  const { sectionVisibility } = settings;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-500">
      {/* Smart Sticky Header */}
      <Navbar resumeUrl={settings.resumeUrl || resume.fileUrl} />

      {/* Main Page Sections controlled by database settings */}
      <main className="flex-1">
        {sectionVisibility?.hero !== false && (
          <HeroSection settings={settings} resumeUrl={settings.resumeUrl || resume.fileUrl} />
        )}

        {sectionVisibility?.about !== false && (
          <AboutSection settings={settings} />
        )}

        {sectionVisibility?.skills !== false && (
          <SkillsSection skills={skills} />
        )}

        {sectionVisibility?.education !== false && (
          <EducationSection education={education} />
        )}

        {sectionVisibility?.experience !== false && (
          <ExperienceSection experience={experience} />
        )}

        {sectionVisibility?.projects !== false && (
          <ProjectsSection projects={projects} />
        )}

        {sectionVisibility?.gallery !== false && (
          <GallerySection gallery={gallery} />
        )}

        {sectionVisibility?.resume !== false && (
          <ResumeSection resume={resume} />
        )}

        {sectionVisibility?.contact !== false && (
          <ContactSection settings={settings} />
        )}
      </main>

      {/* Responsive Footer */}
      <Footer settings={settings} />
    </div>
  );
};
