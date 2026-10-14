import React from 'react';
import { Target, CheckCircle2, Zap, Brain, Sparkles, BookOpen, Award } from 'lucide-react';
import type { SiteSettings } from '../../types';

interface AboutSectionProps {
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const objective =
    settings.careerObjective ||
    'An ambitious engineering graduate looking for an entry-level opportunity in a respected organization to apply my skills, gain hands-on experience, and grow professionally while supporting the success of the team and company.';

  const strengthsList = settings.strengths?.length
    ? settings.strengths
    : [
        'Electrical & Electronics Engineering Foundation',
        'Python & C Programming Basics',
        'Modern Web Technologies (HTML5, CSS3, JavaScript)',
        'Social Media Management & Digital Marketing Campaigns',
        'AI-Assisted Content Production & Workflow Automation',
        'Collaborative Team Player & Quick Learner'
      ];

  const highlights = [
    {
      num: '01',
      icon: <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      title: 'Engineering Rigor',
      desc: 'B.Tech in EEE with hands-on exposure to circuits, microcontrollers, and solar technology.',
      accent: 'from-amber-500/20 to-orange-500/20'
    },
    {
      num: '02',
      icon: <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: 'Digital Marketing & Growth',
      desc: 'Proven background in managing social channels, executing campaigns, and audience engagement.',
      accent: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      num: '03',
      icon: <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Machine Learning & Tech',
      desc: 'Smart Bridge ML internship experience working with Python and predictive modeling workflows.',
      accent: 'from-purple-500/20 to-pink-500/20'
    },
    {
      num: '04',
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Energy Management',
      desc: 'Industrial training with BIGETA Energy Solutions in energy audits and power optimization.',
      accent: 'from-emerald-500/20 to-teal-500/20'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              About Me
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Engineering Foundations, Digital Strategy & Creative Execution
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Bridging technical understanding with digital engagement to drive modern technology solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio & Career Objective */}
          <div className="lg:col-span-7 space-y-8">
            {/* Career Objective Card */}
            <div className="group relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300">
              {/* Subtle decorative background glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Career Objective
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Professional Mission & Long-term Vision
                    </p>
                  </div>
                </div>

                <div className="relative pl-5 py-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                  <blockquote className="text-base sm:text-lg text-slate-800 dark:text-slate-200 italic font-medium leading-relaxed">
                    "{objective}"
                  </blockquote>
                </div>

                <div className="pt-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 border-t border-slate-100 dark:border-slate-800/60">
                  {settings.aboutShortBio && (
                    <p className="font-normal text-slate-800 dark:text-slate-200 pt-2">
                      {settings.aboutShortBio}
                    </p>
                  )}
                  {settings.aboutFullBio && (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      {settings.aboutFullBio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths Card */}
            <div className="group relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Key Strengths & Competencies
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Core Foundations & Interpersonal Capabilities
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {strengthsList.map((strength, idx) => (
                    <div
                      key={idx}
                      className="group/item flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-500/50 hover:scale-[1.02] transition-all duration-200 shadow-sm"
                    >
                      <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/item:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-300 transition-colors">
                        {strength}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:gap-5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl p-6 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Index Number Badge */}
                <span className="absolute top-5 right-6 text-xs font-black tracking-widest text-slate-300 dark:text-slate-700 group-hover:text-indigo-500/80 transition-colors font-mono select-none">
                  {item.num}
                </span>

                {/* Ambient corner glow */}
                <div
                  className={`pointer-events-none absolute -right-12 -bottom-12 h-28 w-28 rounded-full bg-gradient-to-br ${item.accent} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 shrink-0 border border-slate-200 dark:border-slate-700/60 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <div className="space-y-1.5 pr-6">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom accent hover line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 group-hover:h-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
