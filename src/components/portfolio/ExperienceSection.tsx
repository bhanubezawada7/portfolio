import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Brain,
  Zap,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceSectionProps {
  experience?: Experience[];
}

interface ExperienceCardData {
  id: string;
  num: string;
  role: string;
  shortTitle: string;
  organization: string;
  period: string;
  typeBadge: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  icon: React.ReactNode;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience: _experience }) => {
  // Active card index: 0 = Social Media Manager, 1 = ML Intern, 2 = Energy Audit Intern
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardOffsets, setCardOffsets] = useState<number[]>([0, 0, 0]);

  const experienceCards: ExperienceCardData[] = [
    {
      id: 'exp-smm',
      num: '01',
      role: 'Social Media Manager',
      shortTitle: 'Social Media',
      organization: 'Digital Marketing Specialist',
      period: 'Ongoing',
      typeBadge: 'Professional Role',
      summary:
        'Orchestrated multi-channel growth campaigns and visual brand assets delivering measurable audience reach.',
      highlights: [
        'Executed publishing calendars across Instagram, Facebook, and LinkedIn.',
        'Designed 100+ creative assets, carousel graphics, and promotional visuals.',
        'Tracked impression velocity and CTR to continually optimize engagement.'
      ],
      technologies: ['Canva', 'Meta Suite', 'Content Strategy', 'Social Analytics'],
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'exp-ml',
      num: '02',
      role: 'Machine Learning Intern',
      shortTitle: 'ML Intern',
      organization: 'Smart Bridge Education',
      period: '2 Months',
      typeBadge: 'Virtual Internship',
      summary:
        'Completed intensive virtual internship in predictive pipelines and automated data preprocessing in Python.',
      highlights: [
        'Cleaned and engineered dataset features using Pandas and NumPy.',
        'Trained and validated supervised Random Forest and Regression models.',
        'Evaluated accuracy metrics and cross-validation with Scikit-Learn.'
      ],
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Jupyter'],
      icon: <Brain className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'exp-energy',
      num: '03',
      role: 'Energy Audit Intern',
      shortTitle: 'Energy Audit',
      organization: 'BIGETA Energy Solutions',
      period: 'Industrial Training',
      typeBadge: 'Field Internship',
      summary:
        'Conducted specialized industrial electrical audits, transformer inspections, and load evaluations.',
      highlights: [
        'Analyzed electrical distribution profiles to identify transformer losses.',
        'Evaluated power factor discrepancies to recommend capacitor placement.',
        'Formulated actionable roadmaps reducing industrial thermal waste.'
      ],
      technologies: ['Power Flow Analysis', 'Energy Auditing', 'Harmonics', 'Excel'],
      icon: <Zap className="w-5 h-5 text-emerald-400" />
    }
  ];

  // Dynamically compute exact card offsets so sliding hides previous cards completely to the left
  useEffect(() => {
    const updateOffsets = () => {
      if (!trackRef.current) return;
      const cards = trackRef.current.children;
      const offsets: number[] = [];
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i] as HTMLElement;
        offsets.push(el.offsetLeft);
      }
      setCardOffsets(offsets);
    };

    updateOffsets();
    window.addEventListener('resize', updateOffsets);
    return () => window.removeEventListener('resize', updateOffsets);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(experienceCards.length - 1, prev + 1));
  };

  return (
    <section
      id="experience"
      className="py-20 md:py-24 relative overflow-hidden transition-colors duration-300 select-none"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Step 1: Clean Up & Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/70 shadow-sm">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-indigo-300">
                Section 05
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Experience
            </h2>
          </div>

          {/* Navigation Controls: Left & Right Carets */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 shadow-inner">
              0{activeIndex + 1} / 0{experienceCards.length}
            </span>

            {/* Left Caret Button */}
            <button
              type="button"
              data-testid="exp-nav-prev"
              aria-label="Previous Experience"
              disabled={activeIndex === 0}
              onClick={handlePrev}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                activeIndex === 0
                  ? 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-40'
                  : 'bg-slate-900/90 text-white border-slate-700/80 hover:bg-indigo-600 hover:border-indigo-400 shadow-md hover:scale-105 active:scale-95'
              }`}
              title="Slide previous card into view"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Caret Button */}
            <button
              type="button"
              data-testid="exp-nav-next"
              aria-label="Next Experience"
              disabled={activeIndex === experienceCards.length - 1}
              onClick={handleNext}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                activeIndex === experienceCards.length - 1
                  ? 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-40'
                  : 'bg-slate-900/90 text-white border-slate-700/80 hover:bg-indigo-600 hover:border-indigo-400 shadow-md hover:scale-105 active:scale-95'
              }`}
              title="Slide to next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 2: Sleek, Compact Card-Sliding Layout (Previous Cards Slide Left and Hide) */}
        <div className="relative overflow-hidden w-full rounded-[2.2rem] py-2">
          {/* Sliding Track: Translates left by offset of active card */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-4 sm:gap-6 transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(-${cardOffsets[activeIndex] || 0}px)`
            }}
          >
            {experienceCards.map((card, index) => {
              const isActive = index === activeIndex;

              if (isActive) {
                // Active Card: Compact, sleek, highlighted with rich blue tint
                return (
                  <div
                    key={card.id}
                    data-testid={`experience-card-${card.num}`}
                    data-active="true"
                    className="relative w-[320px] sm:w-[420px] md:w-[460px] shrink-0 rounded-[2rem] p-6 sm:p-7 bg-gradient-to-br from-[#1b2352] via-[#24306d] to-[#151c42] text-white border-2 border-indigo-400/50 shadow-[0_20px_50px_rgba(15,23,65,0.7),0_0_30px_rgba(99,102,241,0.22)] ring-1 ring-white/10 flex flex-col justify-between overflow-hidden transition-all duration-500"
                  >
                    {/* Header: Number + Pill + Duration + Arrow */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-400/25">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black tracking-widest text-indigo-300">
                            {card.num}
                          </span>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-100 border border-indigo-300/40">
                            {card.typeBadge}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                            <Calendar className="w-3 h-3 text-cyan-300" />
                            {card.period}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Role & Org */}
                      <div className="flex items-center gap-3.5 my-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-400/40 shadow-inner flex items-center justify-center shrink-0">
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                            {card.role}
                          </h3>
                          <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {card.organization}
                          </p>
                        </div>
                      </div>

                      {/* Simplified Summary */}
                      <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal mb-3.5">
                        {card.summary}
                      </p>
                    </div>

                    {/* Highlights & Tools Grid */}
                    <div className="space-y-3 pt-1">
                      {/* Crisp Highlights */}
                      <div className="p-3 rounded-xl bg-[#141b44]/70 border border-indigo-400/25 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1 pb-1 border-b border-indigo-400/20">
                          <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                          Key Highlights
                        </div>
                        <ul className="space-y-1">
                          {card.highlights.map((hl, hIdx) => (
                            <li
                              key={hIdx}
                              className="text-[11px] text-indigo-100/90 flex items-start gap-1.5 leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shrink-0 mt-1" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Core Tools */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-mono text-indigo-300 mr-1">Tools:</span>
                        {card.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/15 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Upcoming Preview Card (on the right): Sleek, compact card peeking into view
              return (
                <div
                  key={card.id}
                  data-testid={`experience-card-${card.num}`}
                  data-active="false"
                  onClick={() => setActiveIndex(index)}
                  className="relative w-[320px] sm:w-[420px] md:w-[460px] shrink-0 rounded-[2rem] p-6 sm:p-7 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-400/50 shadow-lg flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 opacity-75 hover:opacity-100 group"
                  title={`Click to view ${card.role}`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-mono font-black text-slate-500 group-hover:text-cyan-400 transition-colors">
                        {card.num}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:rotate-45 transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Icon & Title */}
                    <div className="my-5 space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-400/50 transition-all">
                        {card.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {card.role}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {card.organization}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {card.summary}
                    </p>
                  </div>

                  {/* Bottom: Click to view prompt */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-300 transition-colors">
                    <span>Click to view details</span>
                    <span className="font-mono text-xs">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
