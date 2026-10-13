import React, { useState } from 'react';
import {
  FolderKanban,
  Mail,
  GraduationCap,
  Briefcase,
  Image as ImageIcon,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';
import { seedDatabase } from '../../repositories/portfolioRepo';
import type {
  Project,
  Education,
  Experience,
  GalleryItem,
  Inquiry
} from '../../types';

interface DashboardOverviewProps {
  projects: Project[];
  education: Education[];
  experience: Experience[];
  gallery: GalleryItem[];
  inquiries: Inquiry[];
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  education,
  experience,
  gallery,
  inquiries,
  onRefresh,
  onNavigateTab
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ success: boolean; message: string } | null>(null);

  const publishedProjects = projects.filter(p => p.published).length;
  const draftProjects = projects.filter(p => !p.published).length;
  const unreadInquiries = inquiries.filter(i => i.status === 'unread').length;

  const handleSeed = async (overwrite = false) => {
    setSeeding(true);
    setSeedStatus(null);
    try {
      const result = await seedDatabase(overwrite);
      setSeedStatus(result);
      onRefresh();
    } catch (err: any) {
      setSeedStatus({ success: false, message: err?.message || 'Database seeding failed.' });
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      subtitle: `${publishedProjects} published • ${draftProjects} draft`,
      icon: <FolderKanban className="w-5 h-5 text-indigo-400" />,
      tab: 'projects'
    },
    {
      title: 'Contact Inquiries',
      value: inquiries.length,
      subtitle: `${unreadInquiries} unread messages`,
      icon: <Mail className="w-5 h-5 text-emerald-400" />,
      highlight: unreadInquiries > 0,
      tab: 'inquiries'
    },
    {
      title: 'Academic Records',
      value: education.length,
      subtitle: 'SRGEC, Narayana & SSC',
      icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
      tab: 'education'
    },
    {
      title: 'Experience & Internships',
      value: experience.length,
      subtitle: 'Social media & technical roles',
      icon: <Briefcase className="w-5 h-5 text-sky-400" />,
      tab: 'experience'
    },
    {
      title: 'Media Gallery Assets',
      value: gallery.length,
      subtitle: 'Photos and project media',
      icon: <ImageIcon className="w-5 h-5 text-pink-400" />,
      tab: 'gallery'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Seed alert if present */}
      {seedStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            seedStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {seedStatus.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="text-sm">
            <p className="font-semibold">{seedStatus.success ? 'Success' : 'Notice'}</p>
            <p className="text-xs opacity-90">{seedStatus.message}</p>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Status */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Portfolio Administration System
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">
            Welcome back, Bhausri
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Live metrics connected to Cloud Firestore. Changes saved here reflect instantly on your public portfolio.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            icon={<Database className="w-4 h-4 text-indigo-400" />}
            loading={seeding}
            onClick={() => handleSeed(false)}
          >
            Seed Verified Records
          </Button>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="secondary" icon={<ExternalLink className="w-4 h-4" />}>
              View Live Portfolio
            </Button>
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateTab(card.tab)}
            className={`glass-card rounded-2xl p-5 border cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all ${
              card.highlight
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {card.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries Quick Glance */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            Recent Inquiries
          </h3>
          <button
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            View all ({inquiries.length}) →
          </button>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No contact inquiries submitted yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="py-3 flex items-center justify-between gap-4">
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200">
                    {inq.name}{' '}
                    <span className="text-[11px] font-normal text-slate-400">({inq.email})</span>
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{inq.subject}: {inq.message}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    inq.status === 'unread'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
