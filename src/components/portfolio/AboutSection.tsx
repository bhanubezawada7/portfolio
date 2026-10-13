import React from 'react';
import { Target, CheckCircle2, Zap, Brain, Sparkles, BookOpen } from 'lucide-react';
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
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Engineering Rigor',
      desc: 'B.Tech in EEE with hands-on exposure to circuits, microcontrollers, and solar technology.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: 'Digital Marketing & Growth',
      desc: 'Proven background in managing social channels, executing campaigns, and audience engagement.'
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      title: 'Machine Learning & Tech',
      desc: 'Smart Bridge ML internship experience working with Python and predictive modeling workflows.'
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      title: 'Energy Management',
      desc: 'Industrial training with BIGETA Energy Solutions in energy audits and power optimization.'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            About Me
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Engineering Foundations, Digital Strategy & Creative Execution
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Bridging technical understanding with digital engagement to drive modern technology solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio & Career Objective */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Career Objective
              </h3>
              <blockquote className="text-base text-slate-300 italic border-l-2 border-indigo-500 pl-4 py-1 leading-relaxed">
                "{objective}"
              </blockquote>
              <div className="pt-2 text-sm sm:text-base text-slate-300 leading-relaxed space-y-3">
                <p>{settings.aboutShortBio}</p>
                <p className="text-slate-400">{settings.aboutFullBio}</p>
              </div>
            </div>

            {/* Strengths Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-100">Key Strengths & Competencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strengthsList.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-slate-800/80 shrink-0 border border-slate-700/50">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
