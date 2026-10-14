import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MousePointerClick,
  Zap
} from 'lucide-react';
import type { Education } from '../../types';
import { initialEducation } from '../../data/initialData';

interface EducationSectionProps {
  education?: Education[];
}

interface EducationStageConfig {
  id: string;
  stepNum: string;
  stageLabel: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  status: string;
  icon: React.ReactNode;
  accentGradient: string;
  badgeStyle: string;
  borderHover: string;
  highlights: string[];
  description: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  // Always ensure we have the 3 verified education records even if Firestore is unseeded
  const items = education && education.length > 0
    ? education.filter((e) => e.published).sort((a, b) => a.sortOrder - b.sortOrder)
    : initialEducation;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Rich metadata configuration for each education tier
  const educationStages: EducationStageConfig[] = [
    {
      id: 'btech',
      stepNum: '01',
      stageLabel: 'Graduation Degree',
      degree: 'Bachelor of Technology (B.Tech) — Electrical and Electronics Engineering (EEE)',
      institution: 'Seshadri Rao Gudlavalleru Engineering College (SRGEC)',
      location: 'Gudlavalleru, Andhra Pradesh',
      period: '2021 – 2025',
      grade: 'CGPA: 7.8',
      status: 'Graduated Engineering Scholar',
      icon: <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
      accentGradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      badgeStyle: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      borderHover: 'hover:border-indigo-500/60',
      description:
        'Comprehensive study of circuit theory, electrical machines, power systems, control engineering, renewable energy, and embedded microcontrollers.',
      highlights: [
        'Circuits & Systems & Power Electronics',
        'Ultracapacitor-Based EV Wireless Charging Prototype',
        'Automated Solar Tracker using Servos & Sensors',
        'Microcontroller Programming (8051 & Arduino)'
      ]
    },
    {
      id: 'inter',
      stepNum: '02',
      stageLabel: 'Higher Secondary',
      degree: 'Intermediate — MPC (Mathematics, Physics, Chemistry)',
      institution: 'Narayana Junior College, Gudivada',
      location: 'Gudivada, Andhra Pradesh',
      period: '2019 – 2021',
      grade: 'CGPA: 8.0',
      status: 'Higher Secondary Distinction',
      icon: <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
      accentGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      badgeStyle: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      borderHover: 'hover:border-purple-500/60',
      description:
        'Rigorous pre-engineering foundation covering higher mathematics, physical mechanics, chemical sciences, and analytical problem-solving.',
      highlights: [
        'Differential Calculus & Coordinate Geometry',
        'Electromagnetism, Optics & Modern Physics',
        'Chemical Kinetics & Analytical Chemistry',
        'Competitive Exam Preparation & Problem Solving'
      ]
    },
    {
      id: 'ssc',
      stepNum: '03',
      stageLabel: 'Secondary School',
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Board of Secondary Education',
      location: 'Andhra Pradesh, India',
      period: '2019',
      grade: 'CGPA: 9.3',
      status: 'Top Academic Distinction',
      icon: <Award className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
      accentGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/60',
      description:
        'Completed secondary education with top honors (9.3 CGPA), establishing academic discipline and core scientific fundamentals.',
      highlights: [
        'Top Academic Honors with 9.3 CGPA Distinction',
        'Excellence in Mathematics & Fundamental Sciences',
        'Strong Foundation in Communication & Problem Solving',
        'Active Participation in Science Exhibitions'
      ]
    }
  ];

  // Merge any dynamic data from props if available
  const stages = educationStages.map((stage, idx) => {
    const matchingItem = items[idx];
    if (!matchingItem) return stage;
    return {
      ...stage,
      degree: matchingItem.degree || stage.degree,
      institution: matchingItem.institution || stage.institution,
      location: matchingItem.location || stage.location,
      period: matchingItem.period || stage.period,
      grade: matchingItem.grade || stage.grade,
      description: matchingItem.description || stage.description
    };
  });

  const totalCards = stages.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const handleCardClick = (idx: number) => {
    if (idx === currentIndex) {
      // Clicking the active card slides smoothly to the next card
      handleNext();
    } else {
      setCurrentIndex(idx);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/90 dark:border-indigo-800/70 shadow-sm">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Academic Background
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Education & Qualifications
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Academic achievements and technical foundation from secondary school through engineering graduation.
          </p>
        </div>

        {/* Interactive Step Switcher & Timeline Bar */}
        <div className="max-w-4xl mx-auto">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            {stages.map((stage, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  )}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-mono font-extrabold ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      STAGE {stage.stepNum}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {stage.period}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-extrabold tracking-tight truncate ${
                      isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {stage.stageLabel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {stage.grade}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls Bar with Navigation & Helper Hint */}
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/60">
                <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                Click card or Next to slide
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 mr-1">
                {currentIndex + 1} / {totalCards}
              </span>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous qualification card"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next qualification card"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D PERSPECTIVE SLIDER CAROUSEL STAGE */}
        <div
          className="relative w-full max-w-4xl mx-auto h-[460px] sm:h-[430px] md:h-[410px] perspective-1400 flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {stages.map((stage, idx) => {
            // Circular relative offset: 0 = center/active, 1 = right/next, 2 = left/prev
            const offset = (idx - currentIndex + totalCards) % totalCards;
            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === 2; // For 3 items: offset 2 is previous

            let transformClass = '';
            let zIndexClass = 'z-10';
            let opacityClass = 'opacity-0 pointer-events-none scale-75';

            if (isActive) {
              transformClass = 'translate-x-0 scale-100 rotate-y-0';
              zIndexClass = 'z-30';
              opacityClass = 'opacity-100 cursor-pointer';
            } else if (isNext) {
              transformClass =
                'translate-x-[45%] sm:translate-x-[55%] md:translate-x-[62%] scale-[0.88] -rotate-y-[18deg]';
              zIndexClass = 'z-20';
              opacityClass = 'opacity-60 hover:opacity-95 cursor-pointer';
            } else if (isPrev) {
              transformClass =
                '-translate-x-[45%] sm:-translate-x-[55%] md:-translate-x-[62%] scale-[0.88] rotate-y-[18deg]';
              zIndexClass = 'z-20';
              opacityClass = 'opacity-60 hover:opacity-95 cursor-pointer';
            }

            return (
              <div
                key={stage.id}
                onClick={() => handleCardClick(idx)}
                className={`absolute w-full px-2 sm:px-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d ${transformClass} ${zIndexClass} ${opacityClass}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl p-6 sm:p-9 lg:p-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border transition-all duration-500 ${
                    isActive
                      ? 'border-indigo-500/60 dark:border-indigo-500/50 elevation-3d ring-1 ring-indigo-500/20'
                      : 'border-slate-200/90 dark:border-slate-800/80 shadow-xl'
                  } ${stage.borderHover}`}
                >
                  {/* Ambient corner light sphere */}
                  <div
                    className={`pointer-events-none absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-gradient-to-br ${stage.accentGradient} blur-2xl transition-opacity duration-500`}
                  />

                  {/* Top Bar: Timeline Period, Status Tag & Interactive Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {stage.period}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${stage.badgeStyle} shadow-xs`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {stage.grade}
                      </span>
                    </div>

                    {isActive ? (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/80 shadow-xs">
                        <span>Click card to slide next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Click to view
                      </span>
                    )}
                  </div>

                  {/* Degree Title & Institution Details */}
                  <div className="flex items-start gap-4 sm:gap-5 mb-5 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 shrink-0 border border-indigo-200/90 dark:border-indigo-800/70 shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                      {stage.icon}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {stage.degree}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          {stage.institution}
                        </span>
                        {stage.location && (
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            {stage.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Narrative Description */}
                  {stage.description && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5 relative z-10 font-normal">
                      {stage.description}
                    </p>
                  )}

                  {/* Key Highlights / Coursework Grid */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/70 relative z-10">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                      Key Highlights & Coursework:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stage.highlights.map((itemText, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50 shadow-2xs text-xs text-slate-800 dark:text-slate-200 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{itemText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent glow bar */}
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

        {/* Dynamic Dot Pagination Indicator */}
        <div className="flex items-center justify-center gap-2.5 pt-4">
          {stages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to education slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-9 h-2.5 bg-indigo-600 dark:bg-indigo-400 shadow-sm shadow-indigo-500/50'
                  : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
