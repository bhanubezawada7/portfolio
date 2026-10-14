import React from 'react';
import { ArrowRight, FileDown, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import type { SiteSettings } from '../../types';

interface HeroSectionProps {
  settings: SiteSettings;
  resumeUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, resumeUrl = '/assets/bhanu_resume.pdf' }) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Dynamic Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {settings.availabilityStatus || 'Available for Opportunities'}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400 flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Electrical & Electronics Engineering Graduate</span>
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Hi, I'm{' '}
                <span className="gradient-text">
                  {settings.ownerName || 'Bhausri Bezawada'}
                </span>
              </h1>
            </div>

            {/* Professional Headline & Bio */}
            <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-2xl mx-auto lg:mx-0">
              {settings.heroHeadline}
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {settings.heroBio}
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a href="#contact">
                <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Contact Me
                </Button>
              </a>
              <a href="#projects">
                <Button size="lg" variant="secondary">
                  View Projects
                </Button>
              </a>
              <a
                href={settings.resumeUrl || resumeUrl}
                download="Bhanu_Bezawada_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" icon={<FileDown className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}>
                  Download Resume
                </Button>
              </a>
            </div>

            {/* Key stats / highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">7.8</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">B.Tech CGPA</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">3+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Core Projects</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">2</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Industry Internships</p>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Portrait with Luxury Framing */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              {/* Outer decorative layered glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-65 transition duration-500" />

              {/* Portrait container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                <img
                  src={settings.heroPortrait || '/assets/bhausri_portrait.jpg'}
                  alt={`Portrait of ${settings.ownerName}`}
                  className="w-full h-auto object-cover aspect-[3/4] transition duration-500 group-hover:scale-102"
                  loading="eager"
                  fetchPriority="high"
                />
                
                {/* Subtle Overlay badge at bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent p-4 text-center">
                  <p className="text-sm font-semibold text-white">Bhausri Bezawada</p>
                  <p className="text-xs text-indigo-300">B.Tech EEE • Digital Marketer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
