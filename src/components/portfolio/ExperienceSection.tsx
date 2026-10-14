import React, { useState } from 'react';
import { Briefcase, Building2, Calendar, CheckCircle2, Cpu } from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceSectionProps {
  experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const [filter, setFilter] = useState<'all' | 'work' | 'internship'>('all');

  const filteredExp = experience
    .filter(e => e.published)
    .filter(e => (filter === 'all' ? true : e.type === filter))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="experience" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Career Journey
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Professional Experience & Internships
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Hands-on digital marketing execution combined with technical internships in machine learning and industrial energy audit.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {(['all', 'work', 'internship'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500 scale-105'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/40'
              }`}
            >
              {type === 'all'
                ? 'All Experiences'
                : type === 'work'
                ? 'Work & Management'
                : 'Internships'}
            </button>
          ))}
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
          {filteredExp.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl p-7 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Badge & Period */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      item.type === 'work'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/60'
                    }`}
                  >
                    {item.type === 'work' ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : (
                      <Cpu className="w-3.5 h-3.5" />
                    )}
                    {item.type === 'work' ? 'Professional Role' : 'Internship'}
                  </span>

                  {(item.duration || item.period) && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.duration || item.period}
                    </span>
                  )}
                </div>

                {/* Role & Org */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.role}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4" />
                    {item.organization}
                  </p>
                </div>

                {/* Description or Responsibilities */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    {item.responsibilities.slice(0, 5).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                    {item.responsibilities.length > 5 && (
                      <li className="text-[11px] text-slate-500 dark:text-slate-400 italic pl-5">
                        + {item.responsibilities.length - 5} additional responsibilities
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Technologies / Tags */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
