import React, { useState } from 'react';

interface BookletSubtitleProps {
  className?: string;
}

export const BookletSubtitle: React.FC<BookletSubtitleProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Flipped state triggers either on hover or on click toggle
  const isFlipped = isHovered || isClicked;

  // 7 Neat silver binding loops along the top edge
  const ringCount = 7;

  return (
    <div
      data-testid="hero-3d-booklet"
      data-flipped={isFlipped ? 'true' : 'false'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked((prev) => !prev)}
      className={`relative cursor-pointer select-none group inline-block ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
      title="Hover or click to flip card"
      aria-label="Interactive Card: Flip to reveal AI Web Developer"
    >
      {/* 
        Single Card Container:
        Occupies a fixed, constrained footprint (w-64 sm:w-72 md:w-80, h-13 sm:h-15)
        and flips strictly IN PLACE. Zero side spread, zero upward overflow.
      */}
      <div
        className="relative w-64 sm:w-72 md:w-80 h-13 sm:h-15"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Stationary Stacked Backing Sheet (Creates subtle paper thickness/depth without spreading) */}
        <div
          className="absolute inset-0 rounded-2xl bg-slate-300/80 border border-slate-400/60 shadow-[0_12px_30px_rgba(0,0,0,0.65)] pointer-events-none"
          style={{
            transform: 'translate3d(0, 3px, -8px)'
          }}
        />

        {/* Stationary Middle Paper Sheet */}
        <div
          className="absolute inset-0 rounded-2xl bg-slate-200/90 border border-slate-300 pointer-events-none"
          style={{
            transform: 'translate3d(0, 1.5px, -4px)'
          }}
        />

        {/* 
          In-Place Backward Flipping Card:
          Rotates tightly around 'center center' on the X axis.
          Top edge tilts backward into -Z depth and moves DOWNWARD into the center,
          guaranteeing ZERO upward reach towards PORTFOLIO above.
        */}
        <div
          data-testid="booklet-flipping-card"
          className="relative w-full h-full will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            transform: isFlipped ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transition: 'transform 0.85s cubic-bezier(0.34, 1.15, 0.64, 1)'
          }}
        >
          {/* ========================================================
              FRONT FACE: Strictly 'Graphic Designer'
              (Single page view, zero extra labels/counters)
          ======================================================== */}
          <div
            data-testid="booklet-front-face"
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EEF2F6] text-slate-900 border border-slate-300/90 shadow-md px-4 flex items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(0deg)'
            }}
          >
            {/* Clean Title: 'Graphic Designer' */}
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_#6366f1] shrink-0" />
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-950 font-sans leading-none whitespace-nowrap">
                Graphic Designer
              </span>
            </div>

            {/* Subtle paper specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none" />
          </div>

          {/* ========================================================
              BACK FACE: Strictly 'AI Web Developer'
              (Rotated 180deg around X so it lands right-side up when flipped backwards)
          ======================================================== */}
          <div
            data-testid="booklet-back-face"
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EEF2F6] text-slate-900 border-2 border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.25)] px-4 flex items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)'
            }}
          >
            {/* Clean Revealed Title: 'AI Web Developer' */}
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse shrink-0" />
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-950 font-sans leading-none whitespace-nowrap">
                AI Web Developer
              </span>
            </div>

            {/* Subtle paper specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-100/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Top Wire Rings along Top Edge (Stays fixed to give calendar/notepad binding) */}
        <div
          data-testid="booklet-spiral-rings"
          className="absolute -top-2 left-0 right-0 flex justify-evenly px-4 z-20 pointer-events-none"
        >
          {Array.from({ length: ringCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Metallic Silver Wire Loop */}
              <div className="w-1.5 sm:w-2 h-3.5 sm:h-4 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-400 border border-slate-400/80 shadow-[0_1px_3px_rgba(0,0,0,0.35)]" />
              {/* Hole punched in paper */}
              <div className="w-2 h-1 -mt-0.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
