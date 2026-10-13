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
    <section id="experience" className="py-20 md:py-28 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Career Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Professional Experience & Internships
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Hands-on digital marketing execution combined with technical internships in machine learning and industrial energy audit.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Experiences
          </button>
          <button
            onClick={() => setFilter('work')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filter === 'work'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Work & Management
          </button>
          <button
            onClick={() => setFilter('internship')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filter === 'internship'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Technical Internships
          </button>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredExp.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-4">
                {/* Badge & Period */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === 'work'
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
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
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.duration || item.period}
                    </span>
                  )}
                </div>

                {/* Role & Org */}
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{item.role}</h3>
                  <p className="text-sm text-indigo-400 font-medium flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4" />
                    {item.organization}
                  </p>
                </div>

                {/* Description or Responsibilities */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-slate-800/60">
                    {item.responsibilities.slice(0, 5).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                    {item.responsibilities.length > 5 && (
                      <li className="text-[11px] text-slate-400 italic pl-5">
                        + {item.responsibilities.length - 5} additional marketing responsibilities
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Technologies / Tags */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50"
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
