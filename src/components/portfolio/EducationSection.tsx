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
    <section id="education" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Academic Background
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Education & Qualifications
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Academic achievements and technical foundation from secondary school through engineering graduation.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline spine */}
          <div className="hidden sm:block absolute left-8 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-800" />

          <div className="space-y-8">
            {publishedEdu.map((item) => (
              <div
                key={item.id}
                className="relative sm:pl-20 transition-all duration-300 group"
              >
                {/* Timeline node icon */}
                <div className="hidden sm:flex absolute left-4.5 -translate-x-1/2 top-5 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800/80 group-hover:border-indigo-500/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 self-start sm:self-auto">
                      <Award className="w-3.5 h-3.5" />
                      {item.grade}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {item.degree}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-400 mt-2 mb-3">
                    <span className="font-medium text-slate-300">{item.institution}</span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
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
