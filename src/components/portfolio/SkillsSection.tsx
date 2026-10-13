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
    Programming: <Code2 className="w-5 h-5 text-indigo-400" />,
    'Web Development': <Globe className="w-5 h-5 text-sky-400" />,
    'Digital Marketing': <TrendingUp className="w-5 h-5 text-emerald-400" />,
    'Creative & Productivity': <Sparkles className="w-5 h-5 text-pink-400" />,
    'Technical Tools': <Cpu className="w-5 h-5 text-amber-400" />,
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
    <section id="skills" className="py-20 md:py-28 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Expertise & Toolkit
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Technical & Marketing Capabilities
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            A versatile blend of engineering analytical competencies, web technologies, and strategic digital marketing tools.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* If All is selected, display visually grouped rich cards */}
        {activeCategory === 'All' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedSkills.map((group) => (
              <div
                key={group.category}
                className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800/60">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                      {categoryIcons[group.category] || <Layers className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-100">{group.category}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/70 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 hover:text-white transition-all"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="glass-card rounded-xl p-4 text-center border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  {categoryIcons[skill.category] || <Layers className="w-4 h-4" />}
                </div>
                <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                <span className="text-[11px] text-slate-400">{skill.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
