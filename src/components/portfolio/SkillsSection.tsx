import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code2,
  Globe,
  TrendingUp,
  Sparkles,
  Cpu,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { Skill } from '../../types';
import { WaterTapGraphic } from './WaterTapGraphic';

interface SkillsSectionProps {
  skills?: Skill[];
}

interface CategoryDefinition {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  theme: {
    accent: string;
    border: string;
    bg: string;
    pillBg: string;
    pillBorder: string;
    pillText: string;
    glow: string;
    dropletColor: string;
  };
  skills: { id: string; name: string }[];
}

// The 5 exact categories and verified skills specified in the requirements
const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'cat-programming',
    name: 'Programming',
    tagline: 'Core Algorithmic Foundations',
    icon: <Code2 className="w-5 h-5 text-indigo-400" />,
    theme: {
      accent: 'from-indigo-500 to-violet-600',
      border: 'border-indigo-500/30 hover:border-indigo-500/60',
      bg: 'bg-indigo-950/20',
      pillBg: 'bg-indigo-500/10 hover:bg-indigo-500/20',
      pillBorder: 'border-indigo-500/30 hover:border-indigo-400',
      pillText: 'text-indigo-200 hover:text-white',
      glow: 'rgba(99, 102, 241, 0.25)',
      dropletColor: '#818cf8',
    },
    skills: [
      { id: 'prog-1', name: 'Python' },
      { id: 'prog-2', name: 'C' },
    ],
  },
  {
    id: 'cat-web',
    name: 'Web Development',
    tagline: 'Modern Interface Architecture',
    icon: <Globe className="w-5 h-5 text-sky-400" />,
    theme: {
      accent: 'from-sky-500 to-cyan-600',
      border: 'border-sky-500/30 hover:border-sky-500/60',
      bg: 'bg-sky-950/20',
      pillBg: 'bg-sky-500/10 hover:bg-sky-500/20',
      pillBorder: 'border-sky-500/30 hover:border-sky-400',
      pillText: 'text-sky-200 hover:text-white',
      glow: 'rgba(14, 165, 233, 0.25)',
      dropletColor: '#38bdf8',
    },
    skills: [
      { id: 'web-1', name: 'HTML5' },
      { id: 'web-2', name: 'CSS3' },
      { id: 'web-3', name: 'JavaScript' },
    ],
  },
  {
    id: 'cat-marketing',
    name: 'Digital Marketing',
    tagline: 'Strategic Growth & Campaigns',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    theme: {
      accent: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bg: 'bg-emerald-950/20',
      pillBg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      pillBorder: 'border-emerald-500/30 hover:border-emerald-400',
      pillText: 'text-emerald-200 hover:text-white',
      glow: 'rgba(16, 185, 129, 0.25)',
      dropletColor: '#34d399',
    },
    skills: [
      { id: 'mkt-1', name: 'Social Media Marketing' },
      { id: 'mkt-2', name: 'Digital Marketing Management' },
      { id: 'mkt-3', name: 'Campaign Planning & Strategy' },
    ],
  },
  {
    id: 'cat-creative',
    name: 'Creative & Productivity',
    tagline: 'Visual Content & Productivity Workflows',
    icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    theme: {
      accent: 'from-pink-500 to-rose-600',
      border: 'border-pink-500/30 hover:border-pink-500/60',
      bg: 'bg-pink-950/20',
      pillBg: 'bg-pink-500/10 hover:bg-pink-500/20',
      pillBorder: 'border-pink-500/30 hover:border-pink-400',
      pillText: 'text-pink-200 hover:text-white',
      glow: 'rgba(236, 72, 153, 0.25)',
      dropletColor: '#f472b6',
    },
    skills: [
      { id: 'cre-1', name: 'Canva' },
      { id: 'cre-2', name: 'Microsoft PowerPoint' },
      { id: 'cre-3', name: 'Microsoft Excel' },
      { id: 'cre-4', name: 'AI Tools for Content Creation' },
    ],
  },
  {
    id: 'cat-tools',
    name: 'Technical Tools',
    tagline: 'Engineering Simulation & Modeling',
    icon: <Cpu className="w-5 h-5 text-amber-400" />,
    theme: {
      accent: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bg: 'bg-amber-950/20',
      pillBg: 'bg-amber-500/10 hover:bg-amber-500/20',
      pillBorder: 'border-amber-500/30 hover:border-amber-400',
      pillText: 'text-amber-200 hover:text-white',
      glow: 'rgba(245, 158, 11, 0.25)',
      dropletColor: '#fbbf24',
    },
    skills: [
      { id: 'tool-1', name: 'MATLAB' },
      { id: 'tool-2', name: 'Basic Machine Learning' },
      { id: 'tool-3', name: 'ProgeCAD' },
    ],
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills: _externalSkills = [] }) => {
  const [isOn, setIsOn] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [flowKey, setFlowKey] = useState<number>(1);
  const [isPumping, setIsPumping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);

  // References for measuring coordinates from tap spout to each skill pill
  const spoutRef = useRef<HTMLDivElement | null>(null);
  const skillRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const defaultCategories = DEFAULT_CATEGORIES;

  // Optional zero-dependency Web Audio API synthesizer for glassy water droplet chime
  const playWaterChime = useCallback((pitch = 540) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.7, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // Audio context blocked or unsupported
    }
  }, [soundEnabled]);

  // Total count of all 15 competencies
  const totalSkillsCount = defaultCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  // Compute trajectories from spout to each individual skill pill
  const updateTrajectories = useCallback(() => {
    if (!spoutRef.current) return;
    const spoutRect = spoutRef.current.getBoundingClientRect();
    const spoutCenterX = spoutRect.left + spoutRect.width / 2;
    const spoutCenterY = spoutRect.top + spoutRect.height / 2;

    let index = 0;
    defaultCategories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        const el = skillRefs.current[skill.id];
        if (el) {
          const pillRect = el.getBoundingClientRect();
          const pillCenterX = pillRect.left + pillRect.width / 2;
          const pillCenterY = pillRect.top + pillRect.height / 2;

          const dx = spoutCenterX - pillCenterX;
          const dy = spoutCenterY - pillCenterY;

          // Set custom CSS properties on each pill
          el.style.setProperty('--flow-x', `${dx}px`);
          el.style.setProperty('--flow-y', `${dy}px`);
          // Slight natural rotation while in flight
          const rot = ((index % 3) - 1) * 14;
          el.style.setProperty('--rot', `${rot}`);

          index++;
        }
      });
    });
  }, [defaultCategories]);

  // Recalculate on load, resize, or flow re-trigger
  useEffect(() => {
    // Short delay to let DOM render natural flex positions
    const timer = setTimeout(() => {
      updateTrajectories();
    }, 60);

    const handleResize = () => {
      updateTrajectories();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [flowKey, updateTrajectories]);

  // Handle Turn On / Turn Off toggle
  const handleToggle = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    if (nextState) {
      setHasLanded(false);
      setFlowKey((prev) => prev + 1);
      playWaterChime(480);
    }
  };

  // Handle Pump Tap (re-pour skills)
  const handlePump = () => {
    setIsPumping(true);
    setIsOn(true);
    setHasLanded(false);
    setFlowKey((prev) => prev + 1);
    playWaterChime(580);
    setTimeout(() => {
      setIsPumping(false);
    }, 700);
  };

  // Mark when all droplets have arrived
  useEffect(() => {
    if (isOn) {
      const finishTimer = setTimeout(() => {
        setHasLanded(true);
      }, 2300);
      return () => clearTimeout(finishTimer);
    }
  }, [flowKey, isOn]);

  // Filter categories
  const categoriesList = ['All', ...defaultCategories.map((c) => c.name)];
  const displayedCategories =
    activeCategory === 'All'
      ? defaultCategories
      : defaultCategories.filter((c) => c.name === activeCategory);

  // Flat skill index helper for staggered drop timing
  let runningSkillIndex = 0;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-500 selection:bg-sky-500 selection:text-white"
    >
      {/* Dynamic Water Caustic Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-950/60 border border-sky-400/30 text-sky-600 dark:text-sky-300 shadow-sm backdrop-blur-md">
            <Droplets className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Interactive Skill Dispenser &bull; Tap Theme
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Technical & Marketing Capabilities
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Interact with the faucet to dispense verified engineering competencies, modern web development skills, and strategic digital marketing tools.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30 scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-white border-slate-200 dark:border-slate-800 hover:border-sky-500/40 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Center Stage: The Interactive Water Tap Graphic */}
        <div className="mb-12">
          <WaterTapGraphic
            isOn={isOn}
            onToggle={handleToggle}
            onPump={handlePump}
            spoutRef={spoutRef}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            isPumping={isPumping}
          />
        </div>

        {/* Reservoir Status & Capacity Bar */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-8 px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOn ? 'bg-sky-400' : 'bg-slate-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isOn ? 'bg-sky-500' : 'bg-slate-500'
                }`}
              />
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isOn ? 'Water Tap Active' : 'Water Tap Closed'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              &bull; {totalSkillsCount} skills ready across 5 organized categories
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
            <span className="hidden sm:inline">Collection Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
              {hasLanded ? '100% Collected & Aligned' : isOn ? 'Dispensing Stream...' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Neat Category Alignment: Organized Receptacles Grid */}
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Top Row: 3 Categories (Programming, Web Development, Digital Marketing) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCategories.slice(0, 3).map((category) => (
              <div
                key={category.id}
                className={`group relative rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border ${category.theme.border} shadow-lg shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Subtle Water Filling Level at Bottom */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${category.theme.accent} opacity-80`}
                />

                <div>
                  {/* Category Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {category.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {category.skills.length} skills
                    </span>
                  </div>

                  {/* Designated Shelf / Receptacle for Skills */}
                  <div className="flex flex-wrap gap-2.5 min-h-[72px] items-start pt-1">
                    {category.skills.map((skill) => {
                      const thisIndex = runningSkillIndex++;
                      // Delay staggered like water drops
                      const delayMs = thisIndex * 120;

                      return (
                        <div
                          key={skill.id}
                          ref={(el) => {
                            skillRefs.current[skill.id] = el;
                          }}
                          className={`skill-pill-tag group/pill relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm border cursor-pointer select-none ${
                            category.theme.pillBg
                          } ${category.theme.pillBorder} ${category.theme.pillText} ${
                            isOn ? 'skill-drop-animated' : 'opacity-90'
                          }`}
                          style={{
                            animationDelay: `${delayMs}ms`,
                            animationFillMode: 'both',
                          }}
                          onMouseEnter={() => playWaterChime(600 + thisIndex * 30)}
                        >
                          {/* Water droplet indicator */}
                          <span
                            className="w-2 h-2 rounded-full shrink-0 shadow-sm group-hover/pill:scale-125 transition-transform"
                            style={{ backgroundColor: category.theme.dropletColor }}
                          />
                          <span className="tracking-tight">{skill.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-60 group-hover/pill:opacity-100 transition-opacity text-sky-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer: Verified Badge */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Competency</span>
                  </div>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-semibold">
                    Bhausri Bezawada
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 2 Categories (Creative & Productivity, Technical Tools) — Perfectly Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {displayedCategories.slice(3, 5).map((category) => (
              <div
                key={category.id}
                className={`group relative rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border ${category.theme.border} shadow-lg shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Subtle Water Filling Level at Bottom */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${category.theme.accent} opacity-80`}
                />

                <div>
                  {/* Category Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {category.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {category.skills.length} skills
                    </span>
                  </div>

                  {/* Designated Shelf / Receptacle for Skills */}
                  <div className="flex flex-wrap gap-2.5 min-h-[72px] items-start pt-1">
                    {category.skills.map((skill) => {
                      const thisIndex = runningSkillIndex++;
                      const delayMs = thisIndex * 120;

                      return (
                        <div
                          key={skill.id}
                          ref={(el) => {
                            skillRefs.current[skill.id] = el;
                          }}
                          className={`skill-pill-tag group/pill relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm border cursor-pointer select-none ${
                            category.theme.pillBg
                          } ${category.theme.pillBorder} ${category.theme.pillText} ${
                            isOn ? 'skill-drop-animated' : 'opacity-90'
                          }`}
                          style={{
                            animationDelay: `${delayMs}ms`,
                            animationFillMode: 'both',
                          }}
                          onMouseEnter={() => playWaterChime(600 + thisIndex * 30)}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0 shadow-sm group-hover/pill:scale-125 transition-transform"
                            style={{ backgroundColor: category.theme.dropletColor }}
                          />
                          <span className="tracking-tight">{skill.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-60 group-hover/pill:opacity-100 transition-opacity text-sky-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Competency</span>
                  </div>
                  <span className="font-mono text-sky-500 dark:text-sky-400 font-semibold">
                    Bhausri Bezawada
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Helper Banner at Bottom */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/60 dark:bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 backdrop-blur-md shadow-lg">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              Click the faucet or <strong className="text-white">Pump Skills</strong> anytime to re-pour the skill droplet cascade.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
