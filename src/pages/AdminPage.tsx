import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  GraduationCap,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Settings,
  UploadCloud,
  LogOut,
  ArrowLeft,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { ProjectManager } from '../components/admin/ProjectManager';
import { SkillsManager } from '../components/admin/SkillsManager';
import { EducationManager } from '../components/admin/EducationManager';
import { ExperienceManager } from '../components/admin/ExperienceManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { InquiryManager } from '../components/admin/InquiryManager';
import { SettingsManager } from '../components/admin/SettingsManager';
import { MediaUploader } from '../components/admin/MediaUploader';

import {
  getProjects,
  getSkills,
  getEducation,
  getExperience,
  getGallery,
  getSiteSettings
} from '../repositories/portfolioRepo';
import { getInquiries } from '../repositories/inquiryRepo';
import type {
  Project,
  Skill,
  Education,
  Experience,
  GalleryItem,
  Inquiry,
  SiteSettings
} from '../types';
import { initialSiteSettings } from '../data/initialData';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [loading, setLoading] = useState(true);

  const { user, signOutUser } = useAuth();

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [p, s, e, exp, g, inq, set] = await Promise.all([
        getProjects(),
        getSkills(),
        getEducation(),
        getExperience(),
        getGallery(),
        getInquiries(),
        getSiteSettings()
      ]);
      setProjects(p);
      setSkills(s);
      setEducation(e);
      setExperience(exp);
      setGallery(g);
      setInquiries(inq);
      setSettings(set);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" />, count: projects.length },
    { id: 'skills', label: 'Skills', icon: <Cpu className="w-4 h-4" />, count: skills.length },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" />, count: education.length },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" />, count: experience.length },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" />, count: gallery.length },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: <Mail className="w-4 h-4" />,
      count: inquiries.filter(i => i.status === 'unread').length,
      badge: inquiries.filter(i => i.status === 'unread').length > 0
    },
    { id: 'media', label: 'Media Uploader', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Live Portfolio</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm tracking-tight">Portfolio Admin Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <span className="text-xs text-slate-400 hidden md:inline truncate max-w-xs">
            {user?.email}
          </span>

          <button
            onClick={signOutUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-slate-800 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                  {item.count}
                </span>
              ) : item.count !== undefined ? (
                <span className="text-[10px] opacity-60">({item.count})</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-400">Loading portfolio database records...</p>
          </div>
        ) : (
          <main>
            {activeTab === 'overview' && (
              <DashboardOverview
                projects={projects}
                education={education}
                experience={experience}
                gallery={gallery}
                inquiries={inquiries}
                onRefresh={loadAllData}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectManager projects={projects} onRefresh={loadAllData} />
            )}

            {activeTab === 'skills' && (
              <SkillsManager skills={skills} onRefresh={loadAllData} />
            )}

            {activeTab === 'education' && (
              <EducationManager education={education} onRefresh={loadAllData} />
            )}

            {activeTab === 'experience' && (
              <ExperienceManager experience={experience} onRefresh={loadAllData} />
            )}

            {activeTab === 'gallery' && (
              <GalleryManager gallery={gallery} onRefresh={loadAllData} />
            )}

            {activeTab === 'inquiries' && (
              <InquiryManager inquiries={inquiries} onRefresh={loadAllData} />
            )}

            {activeTab === 'media' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-400" />
                  Media Management Center
                </h3>
                <p className="text-xs text-slate-400">
                  Upload images and videos to Cloudinary (cloud: <span className="font-mono text-indigo-300">dw1a87ipd</span>, preset: <span className="font-mono text-indigo-300">portfolio</span>) and copy the secure delivery URL.
                </p>
                <MediaUploader />
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsManager settings={settings} onRefresh={loadAllData} />
            )}
          </main>
        )}
      </div>
    </div>
  );
};
