import React from 'react';
import { FileText, Download, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import type { ResumeMetadata } from '../../types';

interface ResumeSectionProps {
  resume?: ResumeMetadata;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resume }) => {
  const fileUrl = resume?.fileUrl || '/assets/bhanu_resume.pdf';
  const fileName = resume?.fileName || 'Bhanu _ resume 1.pdf';
  const fileSize = resume?.fileSize || '218 KB';
  const fileType = resume?.fileType || 'PDF Document';
  const lastUpdated = resume?.lastUpdated || 'October 2026';
  const downloadLabel = resume?.downloadLabel || 'Download Official Resume';

  return (
    <section id="resume" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-black/40 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Icon & Info */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Curriculum Vitae</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Curriculum Vitae & Credentials
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Review verified educational qualifications (SRGEC B.Tech EEE), technical skills in Python, C, Web Development, and Digital Marketing engagements.
              </p>

              {/* File Specs Pill */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {fileName}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="font-medium">{fileSize}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="font-medium">{fileType}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="font-medium">Updated: {lastUpdated}</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>SRGEC Degree Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Smart Bridge Internship Included</span>
                </div>
              </div>
            </div>

            {/* Right Column: Download & Preview CTAs */}
            <div className="md:col-span-4 flex flex-col gap-3 justify-center items-stretch sm:items-start md:items-end">
              <a
                href={fileUrl}
                download="Bhanu_Bezawada_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
                  icon={<Download className="w-4 h-4" />}
                >
                  {downloadLabel}
                </Button>
              </a>

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="md"
                  variant="outline"
                  className="w-full sm:w-auto"
                  icon={<ExternalLink className="w-4 h-4" />}
                >
                  Preview PDF in New Tab
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
