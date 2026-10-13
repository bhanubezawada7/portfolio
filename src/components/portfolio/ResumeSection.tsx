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
    <section id="resume" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 sm:p-12 border border-slate-800/80 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Icon & Info */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Curriculum Vitae</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Curriculum Vitae & Credentials
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Review verified educational qualifications (SRGEC B.Tech EEE), technical skills in Python, C, Web Development, and Digital Marketing engagements.
              </p>

              {/* File Specs Pill */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  {fileName}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{fileSize}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{fileType}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>Updated: {lastUpdated}</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>SRGEC Degree Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
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
