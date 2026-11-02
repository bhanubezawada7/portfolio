import React, { useState, useRef } from 'react';
import {
  Code2,
  Palette,
  Share2,
  Sparkles,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import type { SiteSettings } from '../../types';

interface AboutSectionProps {
  settings?: SiteSettings;
  resumeUrl?: string;
}

interface SkillCardData {
  num: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  accentGlow: string;
  badgeBorder: string;
  badgeBg: string;
  cardBorderHover: string;
}

interface InteractiveCardProps extends SkillCardData {
  index: number;
}

const InteractiveSkillCard: React.FC<InteractiveCardProps> = ({
  num,
  title,
  category,
  description,
  tags,
  icon,
  accentGlow,
  badgeBorder,
  badgeBg,
  cardBorderHover
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -normY * 11;
    const rotY = normX * 11;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2
      )}deg) scale3d(1.025, 1.025, 1.025)`
    );

    setGlareStyle({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid={`skill-card-${num}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform'
      }}
      className={`group relative rounded-[2rem] p-7 sm:p-8 bg-gradient-to-b from-slate-900/90 via-[#0a0f26]/90 to-[#060a1a]/95 backdrop-blur-2xl border border-slate-800/80 ${cardBorderHover} shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden cursor-pointer select-none`}
    >
      {/* Specular glare following mouse cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle 240px at ${glareStyle.x}% ${glareStyle.y}%, rgba(0, 229, 255, 0.22), transparent 70%)`
        }}
      />

      {/* Ambient background aura */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 w-52 h-52 rounded-full ${accentGlow} blur-3xl opacity-20 group-hover:opacity-45 transition-opacity duration-500`}
      />

      {/* Card Content Top */}
      <div className="relative z-10 space-y-6">
        {/* Top Header: Number, Category Pill & Slanted Action Arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
              {num}
            </span>
            <span
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${badgeBg} ${badgeBorder}`}
            >
              {category}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:rotate-45 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-4 pt-1">
          <div className="w-13 h-13 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300">
            {icon}
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-100 transition-colors">
              {title}
            </h4>
          </div>
        </div>

        {/* Short clean description */}
        <p className="text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors">
          {description}
        </p>
      </div>

      {/* Tech / Capability Chips */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60 group-hover:border-slate-600 transition-colors font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings: _settings
}) => {
  // Initially, the skills cards section is hidden
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const skillsCards: SkillCardData[] = [
    {
      num: '01',
      title: 'Web Development',
      category: 'Engineering & AI',
      description:
        'Building responsive, high-performance web applications with clean modern architectures, interactive 3D elements, and robust codebases.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'],
      icon: <Code2 className="w-6 h-6 text-cyan-400" />,
      accentGlow: 'bg-cyan-500',
      badgeBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/10 text-cyan-300',
      cardBorderHover: 'hover:border-cyan-400/60'
    },
    {
      num: '02',
      title: 'Graphic Design',
      category: 'Visual & UI Design',
      description:
        'Crafting high-impact visual branding, creative assets, and intuitive UI aesthetics tailored for engaging digital experiences.',
      tags: ['Canva', 'Figma', 'UI Aesthetics', 'Visual Branding'],
      icon: <Palette className="w-6 h-6 text-indigo-400" />,
      accentGlow: 'bg-indigo-500',
      badgeBorder: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/10 text-indigo-300',
      cardBorderHover: 'hover:border-indigo-400/60'
    },
    {
      num: '03',
      title: 'Social Media Marketing',
      category: 'Digital Strategy',
      description:
        'Formulating targeted content workflows, multi-channel growth campaigns, and data-driven audience engagement strategies.',
      tags: ['Content Strategy', 'Audience Growth', 'Meta Suite', 'Analytics'],
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
      accentGlow: 'bg-purple-500',
      badgeBorder: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/10 text-purple-300',
      cardBorderHover: 'hover:border-purple-400/60'
    }
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300 select-none"
    >
      {/* Ambient background light gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Step 2: New Clean, Side-Aligned 'About Me' Layout with 3D Sphere on the Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Side-Aligned Heading, Role, Bio & Button */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Subtle Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/70 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-300">
                Section 02 — Overview
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              About Me
            </h2>

            {/* Subtitle: AI Web Developer */}
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 tracking-tight">
              AI Web Developer
            </h3>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
              Hi, my name is Bhanusri Bezawada. I am an AI Web Developer specializing in building
              modern web applications, intuitive digital interfaces, and high-impact technology solutions.
              Combining an engineering mindset with applied AI workflows and creative strategy, I focus on
              crafting scalable, user-centric digital experiences.
            </p>

            {/* Prominent Highlighted 'Read More' Button */}
            <div className="pt-3">
              <button
                type="button"
                data-testid="read-more-btn"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:shadow-[0_0_36px_rgba(0,229,255,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-cyan-300/40"
                aria-expanded={isExpanded}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-cyan-200' : 'text-white'
                    }`}
                  />
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Right Column: Dedicated 3D Particle Sphere Landing Stage in About Me */}
          <div
            id="about-sphere-target"
            data-testid="about-sphere-target"
            className="lg:col-span-5 relative w-full h-[360px] sm:h-[400px] lg:h-[450px] flex items-center justify-center pointer-events-none"
          >
            {/* Ambient radial aura behind the sphere in About Me */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#00E5FF]/15 via-[#0056B3]/15 to-transparent blur-3xl pointer-events-none" />

            {/* Subtle radar / status badge below sphere */}
            <div className="absolute bottom-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300 shadow-md backdrop-blur-md pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span>Interactive 3D Sphere Matrix</span>
            </div>
          </div>
        </div>

        {/* Step 3: Interactive Skills Cards (On Click) */}
        {isExpanded && (
          <div
            id="skills-cards-container"
            data-testid="skills-cards-container"
            className="pt-4 transition-all duration-700 ease-out animate-in fade-in slide-in-from-top-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {skillsCards.map((card, index) => (
                <InteractiveSkillCard key={card.title} index={index} {...card} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
