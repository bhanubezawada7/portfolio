import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { ParticleSphereCanvas } from './ParticleSphereCanvas';
import { BookletSubtitle } from './BookletSubtitle';

interface HeroSectionProps {
  settings: SiteSettings;
  resumeUrl?: string;
}

type AnimStep = 'dot' | 'bhanu' | 'portfolio' | 'complete';

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const [animStep, setAnimStep] = useState<AnimStep>('dot');
  const [replayKey, setReplayKey] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  // Dedicated refs for interactive mouse-tracking text elements
  const bhanuTextRef = useRef<HTMLHeadingElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const portfolioTextRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Target values derived from mouse position
  const targetRef = useRef({
    rotX: 0,
    rotY: 0,
    shiftX: 0,
    shiftY: 0,
    glareX: 50,
    glareY: 50,
    rawMouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    rawMouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    normX: 0,
    normY: 0,
  });

  // Current interpolated values for silky-smooth 60+ FPS motion
  const currentRef = useRef({
    rotX: 0,
    rotY: 0,
    shiftX: 0,
    shiftY: 0,
    glareX: 50,
    glareY: 50,
    rawMouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    rawMouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    normX: 0,
    normY: 0,
  });

  const animFrameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  // 1. Choreographed Animation Sequence
  useEffect(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    // Step 2: Dot transitions into 3D Particle Sphere + Quote + single 'Bhanu' reveal (950ms)
    const t1 = window.setTimeout(() => {
      setAnimStep('bhanu');
    }, 950);

    // Step 3: Initial 3D sphere + quote + 'Bhanu' reveal transitions into 'PORTFOLIO' & photo view (4800ms)
    const t2 = window.setTimeout(() => {
      setAnimStep('portfolio');
    }, 4800);

    // Step 4: Fade in subtitle 'AI Web Developer' right below 'PORTFOLIO' (6000ms)
    const t3 = window.setTimeout(() => {
      setAnimStep('complete');
    }, 6000);

    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, [replayKey]);

  // 2. Interactive Magnetic 3D Parallax Tracking for Text, Photo Card, and Cyan-Blue Lighting
  useEffect(() => {
    const updateMotion = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const ease = 0.085; // Buttery smooth spring damping
      current.rotX += (target.rotX - current.rotX) * ease;
      current.rotY += (target.rotY - current.rotY) * ease;
      current.shiftX += (target.shiftX - current.shiftX) * ease;
      current.shiftY += (target.shiftY - current.shiftY) * ease;
      current.glareX += (target.glareX - current.glareX) * ease;
      current.glareY += (target.glareY - current.glareY) * ease;
      current.normX += (target.normX - current.normX) * ease;
      current.normY += (target.normY - current.normY) * ease;
      current.rawMouseX += (target.rawMouseX - current.rawMouseX) * 0.08;
      current.rawMouseY += (target.rawMouseY - current.rawMouseY) * 0.08;

      // 1. Profile photo card 3D tilt
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) rotateX(${current.rotX.toFixed(
          2
        )}deg) rotateY(${current.rotY.toFixed(2)}deg) translate3d(${current.shiftX.toFixed(
          2
        )}px, ${current.shiftY.toFixed(2)}px, 0)`;
      }

      if (imageRef.current) {
        imageRef.current.style.transform = `scale(1.06) translate3d(${(-current.shiftX * 0.4).toFixed(
          2
        )}px, ${(-current.shiftY * 0.4).toFixed(2)}px, 15px)`;
      }

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle 240px at ${current.glareX.toFixed(
          1
        )}% ${current.glareY.toFixed(1)}%, rgba(0, 229, 255, 0.28) 0%, rgba(255, 255, 255, 0) 70%)`;
      }

      // 2. Middle Layer Quote: 'Thoughtfully Designed. Purposefully Built.' - Smooth multi-plane parallax depth
      if (quoteRef.current) {
        const qShiftX = current.normX * 16;
        const qShiftY = current.normY * 11;
        const qRotX = -current.normY * 7;
        const qRotY = current.normX * 9;
        quoteRef.current.style.transform = `perspective(1200px) rotateX(${qRotX.toFixed(
          2
        )}deg) rotateY(${qRotY.toFixed(2)}deg) translate3d(${qShiftX.toFixed(
          2
        )}px, ${qShiftY.toFixed(2)}px, 15px)`;
      }

      // 3. Foreground Name 'BHANU': Magnetic 3D shift, tilt & glowing cyan-blue chromatic shadow
      if (bhanuTextRef.current) {
        const bShiftX = current.normX * 24;
        const bShiftY = current.normY * 18;
        const bRotX = -current.normY * 12;
        const bRotY = current.normX * 16;
        bhanuTextRef.current.style.transform = `perspective(1200px) rotateX(${bRotX.toFixed(
          2
        )}deg) rotateY(${bRotY.toFixed(2)}deg) translate3d(${bShiftX.toFixed(
          2
        )}px, ${bShiftY.toFixed(2)}px, 30px)`;
        bhanuTextRef.current.style.filter = `drop-shadow(${(-current.normX * 10).toFixed(
          1
        )}px ${(-current.normY * 10).toFixed(1)}px 30px rgba(0, 229, 255, 0.85)) drop-shadow(${(
          current.normX * 12
        ).toFixed(1)}px ${(current.normY * 12).toFixed(1)}px 60px rgba(0, 86, 179, 0.7))`;
      }

      // 4. Interactive text 'PORTFOLIO': 3D parallax shift, tilt, and cyan-blue specular glow
      if (portfolioTextRef.current) {
        const pShiftX = current.normX * 18;
        const pShiftY = current.normY * 12;
        const pRotX = -current.normY * 10;
        const pRotY = current.normX * 14;
        portfolioTextRef.current.style.transform = `perspective(1200px) rotateX(${pRotX.toFixed(
          2
        )}deg) rotateY(${pRotY.toFixed(2)}deg) translate3d(${pShiftX.toFixed(
          2
        )}px, ${pShiftY.toFixed(2)}px, 20px)`;
        portfolioTextRef.current.style.filter = `drop-shadow(${(-current.normX * 8).toFixed(
          1
        )}px ${(-current.normY * 8).toFixed(1)}px 24px rgba(0, 229, 255, 0.65)) drop-shadow(${(
          current.normX * 10
        ).toFixed(1)}px ${(current.normY * 10).toFixed(1)}px 45px rgba(0, 86, 179, 0.5))`;
      }

      // 5. Interactive text 'AI Web Developer': Multi-plane parallax shift for 3D depth separation
      if (subtitleRef.current) {
        const sShiftX = current.normX * 24;
        const sShiftY = current.normY * 15;
        const sRotX = -current.normY * 8;
        const sRotY = current.normX * 11;
        subtitleRef.current.style.transform = `perspective(1200px) rotateX(${sRotX.toFixed(
          2
        )}deg) rotateY(${sRotY.toFixed(2)}deg) translate3d(${sShiftX.toFixed(
          2
        )}px, ${sShiftY.toFixed(2)}px, 10px)`;
      }

      // 6. Dynamic cursor ambient spotlight in background
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${current.rawMouseX.toFixed(
          1
        )}px ${current.rawMouseY.toFixed(1)}px, rgba(0, 229, 255, 0.12), rgba(0, 86, 179, 0.08) 35%, transparent 70%)`;
      }

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    const handleMouseMove = (e: MouseEvent) => {
      const hero = sectionRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const heroCenterX = rect.left + rect.width / 2;
      const heroCenterY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to +1 relative to center
      const normX = Math.max(-1, Math.min(1, (e.clientX - heroCenterX) / (window.innerWidth * 0.45)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - heroCenterY) / (window.innerHeight * 0.45)));

      const maxTilt = 16;
      const maxShift = 12;

      targetRef.current = {
        rotX: -normY * maxTilt,
        rotY: normX * maxTilt,
        shiftX: normX * maxShift,
        shiftY: normY * maxShift,
        glareX: 50 + normX * 35,
        glareY: 50 + normY * 35,
        rawMouseX: e.clientX - rect.left,
        rawMouseY: e.clientY - rect.top,
        normX,
        normY,
      };
    };

    const handleMouseLeave = () => {
      targetRef.current = {
        rotX: 0,
        rotY: 0,
        shiftX: 0,
        shiftY: 0,
        glareX: 50,
        glareY: 50,
        rawMouseX: window.innerWidth / 2,
        rawMouseY: window.innerHeight / 2,
        normX: 0,
        normY: 0,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleReplay = () => {
    setAnimStep('dot');
    setReplayKey((prev) => prev + 1);
  };

  const isDot = animStep === 'dot';
  const isBhanu = animStep === 'bhanu';
  const isPortfolio = animStep === 'portfolio' || animStep === 'complete';
  const isComplete = animStep === 'complete';

  const portraitUrl = settings.heroPortrait || '/assets/bhausri_portrait.jpg';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen max-h-screen min-h-[580px] w-full bg-[#030712] text-white flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden select-none"
    >
      {/* ========================================================
          BACKGROUND LAYER 1: Interactive 3D Particle Sphere Canvas
          Active during 'bhanu' phase, and smoothly blends as ambient
          interactive depth behind subsequent content and scrolls into About Me
      ======================================================== */}
      <ParticleSphereCanvas
        active={!isDot}
        className={`z-0 transition-opacity duration-700 ${
          isDot ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      />

      {/* Ambient Lighting Spheres - Rich Cyan to Royal Blue Theme (#00E5FF to #0056B3) */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {/* Dynamic interactive mouse spotlight */}
        <div ref={spotlightRef} className="absolute inset-0 transition-opacity duration-500" />

        {/* Ambient Royal Blue to Electric Cyan Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#0056B3]/25 via-[#00E5FF]/20 to-transparent blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#00E5FF]/12 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#0056B3]/15 blur-[140px] rounded-full" />
      </div>

      {/* Top Utility: Replay Button for user testing */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-30">
        <button
          onClick={handleReplay}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-700/80 hover:border-[#00E5FF]/50 backdrop-blur-md transition-all shadow-md group focus:outline-none cursor-pointer"
          title="Replay cinematic intro animation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#00E5FF] group-hover:-rotate-90 transition-transform duration-300" />
          <span>Replay Intro</span>
        </button>
      </div>

      {/* Main Staging Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        {/* ========================================================
            Phase 1 & 2: Dropping Dot -> Expands into:
            1) 3D Particle Sphere in Background
            2) Quote: 'Thoughtfully Designed. Purposefully Built.' in Middle
            3) ONLY ONE Single 'BHANU' name prominently in Foreground
        ======================================================== */}
        {(isDot || isBhanu) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            {isDot && (
              <div className="dot-drop flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dot-pulse shadow-[0_0_30px_#00E5FF,0_0_60px_#0056B3]" />
              </div>
            )}

            {isBhanu && (
              <div
                className="transition-all duration-700 ease-out transform scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-500 w-full max-w-3xl px-4 flex flex-col items-center justify-center pointer-events-auto"
                style={{ perspective: '1200px' }}
              >
                {/* ----------------------------------------------------
                    FOREGROUND LAYER: ONLY ONE Single Name 'BHANU'
                    Prominently in Front - styled like user reference
                ---------------------------------------------------- */}
                <h2
                  ref={bhanuTextRef}
                  className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.25em] sm:tracking-[0.32em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00E5FF] uppercase leading-none select-none filter drop-shadow-[0_0_40px_rgba(0,229,255,0.85)] cursor-default transition-transform duration-75 text-center pl-[0.25em] mb-4 sm:mb-6"
                  style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, filter',
                  }}
                  aria-label="Bhanu"
                >
                  BHANU
                </h2>

                {/* ----------------------------------------------------
                    MIDDLE LAYER: Quote on top of 3D Particle Sphere
                    "Thoughtfully Designed. Purposefully Built."
                ---------------------------------------------------- */}
                <div
                  ref={quoteRef}
                  className="relative z-20 text-center max-w-xl px-4 select-none pointer-events-none transition-transform duration-75"
                  style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <p className="font-sans text-xl sm:text-2xl md:text-3xl font-light text-white tracking-wide leading-relaxed drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                    Thoughtfully{' '}
                    <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-[#00E5FF]">
                      Designed.
                    </span>
                    <br />
                    Purposefully{' '}
                    <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-100 to-[#38BDF8]">
                      Built.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            Phase 3: Profile Photo Revealed with 3D Mouse Tracking
            Rich Cyan to Royal Blue Gradient Border & Accents
        ======================================================== */}
        <div
          className={`relative flex flex-col items-center justify-center transition-all duration-1000 ease-out transform ${
            isPortfolio
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 -translate-y-6 pointer-events-none'
          }`}
          style={{ perspective: '1200px' }}
        >
          <div
            id="hero-sphere-target"
            ref={cardRef}
            className="relative group rounded-3xl p-1 bg-gradient-to-tr from-[#0056B3]/50 via-[#00E5FF]/35 to-[#38BDF8]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_45px_rgba(0,229,255,0.3)] border border-[#00E5FF]/30 transition-all duration-300 hover:shadow-[0_25px_65px_rgba(0,0,0,0.9),0_0_60px_rgba(0,229,255,0.55)] hover:border-[#00E5FF]/60"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {/* Framed Image Container: Proportioned so nothing gets cut off */}
            <div className="relative w-44 h-56 sm:w-52 sm:h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
              <img
                ref={imageRef}
                src={portraitUrl}
                alt="Bhanu"
                className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-75"
                style={{ willChange: 'transform' }}
                loading="eager"
              />

              {/* Dynamic Specular Cyan Glare Layer */}
              <div
                ref={glareRef}
                className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                style={{ willChange: 'background' }}
              />

              {/* Subtle bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ========================================================
            Phase 4: 'PORTFOLIO' Moves DOWN to sit Strictly Below Photo
            Guaranteed ZERO overlap with face + Smooth Parallax Tracking
        ======================================================== */}
        <div
          className={`text-center flex flex-col items-center transition-all duration-1000 ease-out transform ${
            isPortfolio
              ? 'opacity-100 translate-y-0 mt-4 sm:mt-6'
              : 'opacity-0 -translate-y-24 pointer-events-none'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Main Title: Premium Elegant Modern 'PORTFOLIO' Typography with Interactive Mouse Tracking */}
          <h1
            ref={portfolioTextRef}
            className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.25em] sm:tracking-[0.32em] uppercase leading-none select-none transition-transform duration-75"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0F7FA 25%, #00E5FF 60%, #0056B3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transformStyle: 'preserve-3d',
              willChange: 'transform, filter',
            }}
          >
            PORTFOLIO
          </h1>

          {/* Subtitle: 3D Animated Booklet / Page Turn UI in place of static subtitle */}
          <div
            ref={subtitleRef}
            className={`mt-5 sm:mt-7 transition-all duration-800 ease-out flex justify-center ${
              isComplete
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-3 blur-xs'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <BookletSubtitle />
          </div>
        </div>
      </div>
    </section>
  );
};
