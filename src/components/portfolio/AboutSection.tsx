import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Zap,
  Brain,
  Sparkles,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';
import type { SiteSettings } from '../../types';

interface AboutSectionProps {
  settings: SiteSettings;
}

interface HighlightItem {
  id: string;
  num: string;
  title: string;
  category: string;
  desc: string;
  tags: string[];
  icon: React.ReactNode;
  accentBg: string;
  badgeBg: string;
  borderHover: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

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

  const highlights: HighlightItem[] = [
    {
      id: 'eee',
      num: '01',
      title: 'Engineering Rigor',
      category: 'Electrical & Electronics Engineering',
      desc: 'B.Tech in EEE with hands-on exposure to circuits, microcontrollers, and solar technology.',
      tags: ['Circuit Design', 'Microcontrollers', 'Solar PV', 'Embedded Systems'],
      icon: <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      accentBg: 'from-amber-500/20 via-orange-500/10 to-transparent',
      badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      borderHover: 'hover:border-amber-500/50'
    },
    {
      id: 'digital',
      num: '02',
      title: 'Digital Marketing & Growth',
      category: 'Social Strategy & Brand Engagement',
      desc: 'Proven background in managing social channels, executing campaigns, and audience engagement.',
      tags: ['Social Strategy', 'Content Production', 'Audience Reach', 'Canva Graphics'],
      icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      accentBg: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      badgeBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      borderHover: 'hover:border-indigo-500/50'
    },
    {
      id: 'ml',
      num: '03',
      title: 'Machine Learning & Tech',
      category: 'Predictive Modeling & Automation',
      desc: 'Smart Bridge ML internship experience working with Python and predictive modeling workflows.',
      tags: ['Python', 'Predictive Modeling', 'Data Analysis', 'Model Validation'],
      icon: <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      accentBg: 'from-purple-500/20 via-pink-500/10 to-transparent',
      badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      borderHover: 'hover:border-purple-500/50'
    },
    {
      id: 'energy',
      num: '04',
      title: 'Energy Management',
      category: 'Industrial Optimization & Audits',
      desc: 'Industrial training with BIGETA Energy Solutions in energy audits and power optimization.',
      tags: ['Energy Auditing', 'Power Optimization', 'Efficiency Protocols', 'Solar Tracking'],
      icon: <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      accentBg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/50'
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % highlights.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const handleCardClick = (idx: number) => {
    if (idx === activeIndex) {
      // Clicking the active card slides smoothly to the next card
      handleNext();
    } else {
      setActiveIndex(idx);
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background light spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/90 dark:border-indigo-800/70 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Section 02 — About Me
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Engineering Foundations, Digital Strategy & Creative Execution
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Bridging technical precision with digital engagement to craft dynamic technology solutions and drive measurable growth.
          </p>
        </div>

        {/* 1. HORIZONTAL CAREER OBJECTIVE HERO CARD (Widescreen 3D Elevated Layout) */}
        <div className="relative group perspective-1200">
          <div className="relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12 bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 elevation-3d transition-all duration-500 hover:border-indigo-500/40">
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-transparent blur-3xl group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Mission, Target Badge & Stylized Quote */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/90 dark:border-indigo-800/70 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Career Objective
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Mission
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                      Professional Mission & Long-term Vision
                    </p>
                  </div>
                </div>

                {/* Stylized Horizontal Quote Callout */}
                <div className="relative p-6 sm:p-7 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 shadow-sm overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                  <blockquote className="text-base sm:text-lg lg:text-xl text-slate-800 dark:text-slate-100 italic font-semibold leading-relaxed tracking-normal pl-2">
                    "{objective}"
                  </blockquote>
                </div>

                {/* Verified Target Attributes */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/50 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    B.Tech EEE Graduate (SRGEC)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/50 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Ready for Industry Impact
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Immediate Availability
                  </span>
                </div>
              </div>

              {/* Right Column: Academic & Experience Summary */}
              <div className="lg:col-span-5 h-full">
                <div className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/60 shadow-inner space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/60">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        Profile Trajectory
                      </span>
                      <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        SRGEC • 2024
                      </span>
                    </div>

                    {settings.aboutShortBio && (
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                        {settings.aboutShortBio}
                      </p>
                    )}

                    {settings.aboutFullBio && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {settings.aboutFullBio}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/60">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Verified Highlights
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['SRGEC Gudlavalleru', 'Smart Bridge ML', 'BIGETA Energy Solutions', 'Social Media Strategy'].map(
                        (tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-medium shadow-2xs"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE 3D ROTATE & SLIDE SHOWCASE (Core Focus Areas) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Specialized Domains
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Core Focus Areas & Experience
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click any card to slide and rotate through domains in 3D perspective.
              </p>
            </div>

            {/* Navigation Controls & Hint */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                Click card to slide next
              </span>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous domain card"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next domain card"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Domain Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {highlights.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500/60 shadow-md scale-[1.02]'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.num}
                    </span>
                    <div className="scale-75 origin-top-right">{item.icon}</div>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? 'text-indigo-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3D ROTATING & SLIDING STAGE */}
          <div className="relative w-full h-[400px] sm:h-[360px] md:h-[340px] perspective-1400 flex items-center justify-center overflow-visible select-none py-4">
            {highlights.map((item, idx) => {
              // Calculate relative circular offset: 0 = active, 1 = right (next), 3 = left (prev), 2 = back
              const offset = (idx - activeIndex + highlights.length) % highlights.length;
              const isActive = offset === 0;
              const isNext = offset === 1;
              const isPrev = offset === highlights.length - 1; // 3
              const isBack = offset === 2;

              let transformStyles = '';
              let zIndexClass = 'z-10';
              let opacityClass = 'opacity-0 pointer-events-none scale-75';

              if (isActive) {
                transformStyles = 'translate-x-0 scale-100 rotate-y-0';
                zIndexClass = 'z-30';
                opacityClass = 'opacity-100 cursor-pointer';
              } else if (isNext) {
                transformStyles =
                  'translate-x-[45%] sm:translate-x-[55%] md:translate-x-[62%] scale-[0.88] -rotate-y-[18deg]';
                zIndexClass = 'z-20';
                opacityClass = 'opacity-65 hover:opacity-95 cursor-pointer';
              } else if (isPrev) {
                transformStyles =
                  '-translate-x-[45%] sm:-translate-x-[55%] md:-translate-x-[62%] scale-[0.88] rotate-y-[18deg]';
                zIndexClass = 'z-20';
                opacityClass = 'opacity-65 hover:opacity-95 cursor-pointer';
              } else if (isBack) {
                transformStyles = 'translate-x-0 scale-75 rotate-y-0 translate-y-8';
                zIndexClass = 'z-0';
                opacityClass = 'opacity-0 pointer-events-none';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(idx)}
                  className={`absolute w-full max-w-2xl px-3 sm:px-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d ${transformStyles} ${zIndexClass} ${opacityClass}`}
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border transition-all duration-500 ${
                      isActive
                        ? 'border-indigo-500/60 dark:border-indigo-500/50 elevation-3d ring-1 ring-indigo-500/20'
                        : 'border-slate-200/90 dark:border-slate-800/80 shadow-xl'
                    } ${item.borderHover}`}
                  >
                    {/* Corner gradient ambient glow */}
                    <div
                      className={`pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-gradient-to-br ${item.accentBg} blur-2xl transition-opacity duration-500`}
                    />

                    {/* Top Row: Index, Domain Badge & Click Action Indicator */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black font-mono tracking-widest text-slate-400 dark:text-slate-500">
                          {item.num}
                        </span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badgeBg}`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {isActive ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/80 shadow-xs">
                          <span>Click to slide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          Click to view
                        </span>
                      )}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex items-start gap-4 sm:gap-5 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/90 shrink-0 border border-slate-200 dark:border-slate-700/80 shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Key Domain Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/70">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
                        Core Competencies:
                      </span>
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom gradient highlight bar */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Pagination Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {highlights.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 h-2.5 bg-indigo-600 dark:bg-indigo-400'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. KEY STRENGTHS & COMPETENCIES (3D Elevated Interactive Cards Grid) */}
        <div className="relative group">
          <div className="relative overflow-hidden rounded-3xl p-7 sm:p-10 bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 elevation-3d transition-all duration-500 hover:border-indigo-500/40">
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-3xl group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/90 dark:border-emerald-800/70 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Key Strengths & Competencies
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                      Core Foundations, Interpersonal Capabilities & Technical Aptitude
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                  {strengthsList.length} Verified Attributes
                </span>
              </div>

              {/* 3D Elevated Strengths Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strengthsList.map((strength, idx) => (
                  <div
                    key={idx}
                    className="group/item relative flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-default"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors leading-snug block">
                        {strength}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                        Core Competency #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
