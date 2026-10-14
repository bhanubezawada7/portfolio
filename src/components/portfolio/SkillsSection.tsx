import React, { useState } from 'react';
import { Code2, Globe, TrendingUp, Sparkles, Cpu, Layers } from 'lucide-react';
import type { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories list
  const categories = [
    'All',
    'Programming',
    'Web Development',
    'Digital Marketing',
    'Creative & Productivity',
    'Technical Tools'
  ];

  const categoryIcons: Record<string, React.ReactNode> = {
    Programming: <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    'Web Development': <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    'Digital Marketing': <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    'Creative & Productivity': <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
    'Technical Tools': <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  };

  const filteredSkills =
    activeCategory === 'All'
      ? skills.filter(s => s.published)
      : skills.filter(s => s.published && s.category === activeCategory);

  // Grouped skills for detailed breakdown
  const groupedSkills = categories
    .filter(c => c !== 'All')
    .map(category => ({
      category,
      skills: skills.filter(s => s.published && s.category === category)
    }))
    .filter(g => g.skills.length > 0);

  return (
    <section id="skills" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Expertise & Toolkit
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Technical & Marketing Capabilities
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A versatile blend of engineering analytical competencies, web technologies, and strategic digital marketing tools.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500 scale-105'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-500/40 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* If All is selected, display visually grouped rich cards */}
        {activeCategory === 'All' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {groupedSkills.map((group) => (
              <div
                key={group.category}
                className="group relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/70">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      {categoryIcons[group.category] || <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {group.category}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {group.skills.length} competencies
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>Verified Skillset</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">Bhausri Bezawada</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group relative overflow-hidden rounded-2xl p-5 text-center bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-md shadow-slate-200/30 dark:shadow-black/30 hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center justify-center gap-2.5"
              >
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 group-hover:scale-110 transition-transform">
                  {categoryIcons[skill.category] || <Layers className="w-5 h-5" />}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {skill.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
