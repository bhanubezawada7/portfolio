import React from 'react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import type { Education } from '../../types';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const publishedEdu = education
    .filter(e => e.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Academic Background
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Education & Qualifications
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Academic achievements and technical foundation from secondary school through engineering graduation.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline spine */}
          <div className="hidden sm:block absolute left-8 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-200 dark:to-slate-800" />

          <div className="space-y-8">
            {publishedEdu.map((item) => (
              <div
                key={item.id}
                className="relative sm:pl-20 transition-all duration-300 group"
              >
                {/* Timeline node icon */}
                <div className="hidden sm:flex absolute left-4.5 -translate-x-1/2 top-5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 group-hover:border-indigo-500/50 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto">
                      <Award className="w-3.5 h-3.5" />
                      {item.grade}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {item.degree}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 mb-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.institution}</span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
