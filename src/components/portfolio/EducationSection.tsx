import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import type { Education } from '../../types';

interface EducationSectionProps {
  education?: Education[];
}

interface EducationCardConfig {
  id: string;
  cardNum: string;
  closedTitle: string;
  expandedTitle: string;
  institution: string;
  branch?: string;
  location: string;
  period: string;
  grade: string;
  categoryTag: string;
  image: string;
  fallbackImage: string;
  description: string;
  highlights: string[];
  accentColor: string;
  badgeBg: string;
  tagColor: string;
  glowBorder: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education: _education }) => {
  // Default to Card 3 (B.Tech - EEE) expanded, or null if all are collapsed
  const [expandedIndex, setExpandedIndex] = useState<number | null>(2);

  const cards: EducationCardConfig[] = [
    {
      id: 'ssc',
      cardNum: '01',
      closedTitle: '10th Class',
      expandedTitle: '10th Class (SSC)',
      institution: 'SVR English Medium High School, Gudlavalleru',
      branch: 'Secondary Schooling',
      location: 'Gudlavalleru, Andhra Pradesh',
      period: '2019',
      grade: 'CGPA: 9.3',
      categoryTag: '01 • SECONDARY SCHOOL',
      image: '/assets/education/Colorful School Courtyard Playground.png',
      fallbackImage: '/Colorful School Courtyard Playground.png',
      description:
        'Completed secondary education with top honors (9.3 CGPA) at SVR English Medium High School, building disciplined academic rigor and strong fundamentals in science and mathematics.',
      highlights: [
        'SVR English Medium High School, Gudlavalleru',
        'Top Academic Distinction with 9.3 CGPA',
        'Excellence in Mathematics & Fundamental Sciences',
        'Active Participation in Science Exhibitions'
      ],
      accentColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
      glowBorder: 'border-emerald-500/70 shadow-emerald-500/20'
    },
    {
      id: 'inter',
      cardNum: '02',
      closedTitle: 'Intermediate',
      expandedTitle: 'Intermediate (MPC)',
      institution: 'Narayana Junior College, Gudivada',
      branch: 'MPC (Mathematics, Physics, Chemistry)',
      location: 'Gudivada, Andhra Pradesh',
      period: '2019 – 2021',
      grade: 'CGPA: 8.0',
      categoryTag: '02 • HIGHER SECONDARY',
      image: '/assets/education/Screenshot 2026-10-30 125309.jpg',
      fallbackImage: '/Screenshot 2026-10-30 125309.jpg',
      description:
        'Rigorous pre-engineering coursework covering differential calculus, physical mechanics, electromagnetism, and chemical sciences, establishing analytical and computational foundations.',
      highlights: [
        'Narayana Junior College, Gudivada',
        'MPC (Mathematics, Physics, Chemistry)',
        'CGPA: 8.0 Higher Secondary Distinction',
        'Differential Calculus, Optics & Physical Sciences'
      ],
      accentColor: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      tagColor: 'text-purple-400 border-purple-500/30 bg-purple-950/60',
      glowBorder: 'border-purple-500/70 shadow-purple-500/20'
    },
    {
      id: 'btech',
      cardNum: '03',
      closedTitle: 'B.Tech - EEE',
      expandedTitle: 'B.Tech — Electrical and Electronics Engineering',
      institution: 'Seshadri Rao Gudlavalleru Engineering College (SRGEC)',
      branch: 'Electrical and Electronics Engineering',
      location: 'Gudlavalleru, Andhra Pradesh',
      period: '2021–2025',
      grade: 'CGPA: 7.8',
      categoryTag: '03 • UNDERGRADUATE DEGREE',
      image: '/assets/education/Screenshot 2026-10-30 125347.jpg',
      fallbackImage: '/Screenshot 2026-10-30 125347.jpg',
      description:
        'Comprehensive 4-year engineering program covering circuits & systems, power electronics, control engineering, microcontrollers, embedded hardware, and renewable energy technologies.',
      highlights: [
        'Seshadri Rao Gudlavalleru Engineering College (SRGEC)',
        'Electrical and Electronics Engineering (EEE)',
        '2021–2025 Engineering Graduation • CGPA: 7.8',
        'EV Wireless Charging & Solar Tracking Prototypes'
      ],
      accentColor: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/60',
      glowBorder: 'border-cyan-500/70 shadow-cyan-500/20'
    }
  ];

  const handleCardClick = (idx: number) => {
    // If user clicks a narrow card, smoothly expand it; if already expanded, collapse to narrow
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-sm shadow-sm">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Academic Background
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Education &amp; Qualifications
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Interactive academic journey showcasing secondary schooling, higher secondary MPC foundations, and B.Tech in Electrical and Electronics Engineering.
          </p>

          {/* Quick switcher navigation pills & Hint */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {cards.map((card, idx) => {
              const isSelected = expandedIndex === idx;
              return (
                <button
                  key={card.id}
                  type="button"
                  data-card-index={idx}
                  data-card-id={card.id}
                  onClick={() => setExpandedIndex(idx)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-400/50'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="font-mono text-[11px] opacity-80">{card.cardNum}</span>
                  <span>{card.closedTitle}</span>
                  {isSelected && <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />}
                </button>
              );
            })}

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 ml-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Click card to expand</span>
            </div>
          </div>
        </div>

        {/* EXPANDING CARDS / ACCORDION CONTAINER */}
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 min-h-[520px] md:h-[580px] select-none">
          {cards.map((card, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={card.id}
                role="button"
                tabIndex={0}
                data-card-index={idx}
                data-card-id={card.id}
                aria-expanded={isExpanded}
                aria-label={`${card.closedTitle} qualification card - click to ${isExpanded ? 'collapse' : 'expand'}`}
                onClick={() => handleCardClick(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(idx);
                  }
                }}
                className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex-grow,flex-basis,width] group ${
                  isExpanded
                    ? 'flex-[3.5] md:flex-[3.5] border-2 ring-4 ring-indigo-500/15 ' + card.glowBorder
                    : 'flex-1 md:flex-1 h-24 md:h-auto border border-white/15 hover:border-indigo-400/60 hover:shadow-xl hover:scale-[1.01]'
                }`}
                style={{
                  backgroundImage: `url("${encodeURI(card.image)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Background Image Element for crisp high-resolution rendering and fallback */}
                <img
                  src={card.image}
                  alt={card.closedTitle}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to root path if needed
                    const target = e.currentTarget;
                    if (target.src !== card.fallbackImage) {
                      target.src = card.fallbackImage;
                    }
                  }}
                />

                {/* Dark Contrast Overlay: ensures white text and badges are razor-sharp */}
                <div
                  className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
                    isExpanded
                      ? 'bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/45 backdrop-blur-[1.5px]'
                      : 'bg-gradient-to-t from-black/85 via-black/45 to-black/25 group-hover:from-black/90 group-hover:via-black/50'
                  }`}
                />

                {/* Subtle colorful ambient gradient on bottom corner when expanded */}
                {isExpanded && (
                  <div
                    className={`absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-tl ${card.accentColor} blur-2xl pointer-events-none rounded-full`}
                  />
                )}

                {/* CLOSED STATE: Show only the background image and title '10th Class' / 'Intermediate' / 'B.Tech - EEE' */}
                {!isExpanded && (
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-row md:flex-col justify-between items-center z-10 pointer-events-none">
                    {/* Top Circle Number Badge */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg">
                      {card.cardNum}
                    </div>

                    {/* Closed Title: Reads horizontally on mobile row or vertically in desktop column */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
                      <span
                        className="text-white font-extrabold text-base sm:text-lg md:text-xl tracking-wider select-none whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:[writing-mode:vertical-rl] md:rotate-180 transition-transform duration-500 group-hover:scale-105"
                      >
                        {card.closedTitle}
                      </span>
                    </div>

                    {/* Bottom Action Icon / Expand hint */}
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* EXPANDED STATE: Reveal details smoothly */}
                {isExpanded && (
                  <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto overflow-x-hidden animate-fadeIn">
                    {/* Watermark Number in background */}
                    <div className="absolute top-4 right-8 font-mono font-black text-7xl sm:text-8xl text-white/5 pointer-events-none select-none">
                      {card.cardNum}
                    </div>

                    {/* Top Metadata Badges: Category Tag, Period, Grade */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md shadow-xs ${card.tagColor}`}>
                          {card.categoryTag}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-200 border border-slate-700/80 backdrop-blur-md shadow-xs">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          {card.period}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${card.badgeBg}`}>
                          <Award className="w-3.5 h-3.5" />
                          {card.grade}
                        </span>
                      </div>

                      {/* Title & Institution Details */}
                      <div className="space-y-2 pt-2">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                          {card.expandedTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-sm sm:text-base text-slate-200 font-medium">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {card.id === 'ssc' ? (
                              <Building2 className="w-4 h-4 text-emerald-400" />
                            ) : card.id === 'inter' ? (
                              <BookOpen className="w-4 h-4 text-purple-400" />
                            ) : (
                              <GraduationCap className="w-4 h-4 text-cyan-400" />
                            )}
                            {card.institution}
                          </span>

                          {card.location && (
                            <span className="flex items-center gap-1 text-slate-300 font-normal text-xs sm:text-sm">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                              {card.location}
                            </span>
                          )}
                        </div>

                        {card.branch && card.id !== 'ssc' && (
                          <div className="text-xs sm:text-sm text-indigo-300 font-semibold tracking-wide">
                            Specialization: {card.branch}
                          </div>
                        )}
                      </div>

                      {/* Narrative Description */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal pt-1 max-w-2xl">
                        {card.description}
                      </p>
                    </div>

                    {/* Key Highlights & Academic Milestones */}
                    <div className="pt-6 border-t border-white/10 mt-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Key Highlights &amp; Academic Milestones:</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {card.highlights.map((highlight, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/75 border border-white/10 backdrop-blur-md shadow-xs text-xs text-slate-100 font-medium hover:border-white/20 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
