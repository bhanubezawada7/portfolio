import React from 'react';
import { Droplets, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface WaterTapGraphicProps {
  isOn: boolean;
  onToggle: () => void;
  onPump: () => void;
  spoutRef: React.RefObject<HTMLDivElement | null>;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isPumping?: boolean;
}

export const WaterTapGraphic: React.FC<WaterTapGraphicProps> = ({
  isOn,
  onToggle,
  onPump,
  spoutRef,
  soundEnabled,
  onToggleSound,
  isPumping = false,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Top Controls Bar: Turn on / off Toggle, Pump Button, Sound */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 z-20">
        {/* The Toggle Button (matching reference video screenshot) */}
        <button
          id="tap-toggle-btn"
          type="button"
          onClick={onToggle}
          className={`group flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md cursor-pointer border ${
            isOn
              ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20 shadow-emerald-500/10'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-500'
          }`}
          title={isOn ? 'Click to close tap' : 'Click to open tap'}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isOn
                ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse'
                : 'bg-slate-400 dark:bg-slate-500'
            }`}
          />
          <span>{isOn ? 'Turn off' : 'Turn on'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ml-1">
            {isOn ? 'FLOWING' : 'IDLE'}
          </span>
        </button>

        {/* Pump / Re-pour Action Button */}
        <button
          id="tap-pump-btn"
          type="button"
          onClick={onPump}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
            isPumping
              ? 'bg-sky-500 text-white border-sky-400 scale-95 shadow-lg shadow-sky-500/30'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:text-sky-500 shadow-sm'
          }`}
          title="Pump more skills out of the tap"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isPumping ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
          <span>Pump Skills</span>
          <Sparkles className="w-3 h-3 text-amber-400 animate-bounce" />
        </button>

        {/* Sound toggle button */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`p-2 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
            soundEnabled
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Mute water sounds' : 'Enable water sounds'}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Modern Water Tap Graphic (High Detail SVG) */}
      <div
        className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        onClick={onToggle}
        title="Click the tap to turn on/off"
      >
        <svg
          viewBox="0 0 320 260"
          className="w-64 h-52 sm:w-80 sm:h-64 drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Matte Dark Gunmetal / Slate Gradients */}
            <linearGradient id="tapBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="25%" stopColor="#334155" />
              <stop offset="45%" stopColor="#475569" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="tapSpoutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="tapLeverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="tapFlangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="tapChromeTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Glowing Water Stream Gradient */}
            <linearGradient id="waterStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>

            {/* Filter for water glow */}
            <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wall Mount Base Flange on Left */}
          <rect x="80" y="145" width="12" height="36" rx="4" fill="url(#tapFlangeGrad)" stroke="#475569" strokeWidth="1" />
          <rect x="84" y="151" width="5" height="24" rx="2" fill="#0f172a" />

          {/* Horizontal Supply Pipe */}
          <path
            d="M 92 153 L 135 153 C 145 153 145 157 145 167 L 145 175 L 125 175 L 125 169 C 125 167 121 167 92 167 Z"
            fill="url(#tapBodyGrad)"
          />

          {/* Lower Decorative Ring */}
          <rect x="125" y="170" width="22" height="6" rx="2" fill="url(#tapChromeTrim)" opacity="0.85" />

          {/* Vertical Main Stem / Valve Column */}
          <rect x="126" y="85" width="20" height="90" rx="3" fill="url(#tapBodyGrad)" />
          {/* Specular Highlight Strip along main stem */}
          <rect x="131" y="86" width="3" height="88" fill="#94a3b8" opacity="0.4" />

          {/* Stem Middle Junction Ring */}
          <rect x="124" y="112" width="24" height="6" rx="2" fill="url(#tapChromeTrim)" opacity="0.85" />

          {/* Top Valve Cap Ring */}
          <rect x="122" y="80" width="28" height="8" rx="3" fill="url(#tapBodyGrad)" stroke="#475569" strokeWidth="1" />
          <ellipse cx="136" cy="80" rx="14" ry="4" fill="url(#tapChromeTrim)" />

          {/* Interactive Rotatable Handle / Lever */}
          <g
            className="transition-transform duration-500 ease-out origin-[136px_78px]"
            style={{
              transform: isOn ? 'rotate(-38deg)' : 'rotate(0deg)',
            }}
          >
            {/* Lever Pivot Node */}
            <circle cx="136" cy="78" r="9" fill="url(#tapBodyGrad)" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="136" cy="78" r="4" fill="url(#tapChromeTrim)" />

            {/* Lever Stick / Handle bar pointing up-right */}
            <path
              d="M 134 76 L 195 44 C 200 41 204 45 200 49 L 140 82 Z"
              fill="url(#tapLeverGrad)"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Handle Tip Knob */}
            <circle cx="198" cy="46" r="6" fill="url(#tapChromeTrim)" />
          </g>

          {/* Curved Gooseneck Spout Body */}
          {/* Extends from stem at y=115, curves to right and turns down */}
          <path
            d="M 146 114 C 185 114 216 122 216 155 L 216 182 L 198 182 L 198 155 C 198 134 175 130 146 130 Z"
            fill="url(#tapBodyGrad)"
          />
          {/* Curved Specular Highlight on Spout */}
          <path
            d="M 148 118 C 182 118 210 125 210 155 L 210 180"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.45"
            fill="none"
          />

          {/* Aerator Nozzle at Spout Tip */}
          <rect x="195" y="180" width="24" height="12" rx="2" fill="url(#tapChromeTrim)" />
          <rect x="197" y="190" width="20" height="4" rx="1" fill="#0f172a" />
          {/* Aerator mesh lines */}
          <line x1="200" y1="192" x2="214" y2="192" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Dynamic Flowing Water Stream when Tap is ON */}
          {isOn && (
            <g filter="url(#waterGlow)">
              {/* Central smooth water stream */}
              <path
                d="M 201 194 Q 200 220 203 260 L 211 260 Q 214 220 213 194 Z"
                fill="url(#waterStreamGrad)"
                className="animate-pulse"
                opacity="0.9"
              />

              {/* Shimmering core jet */}
              <line
                x1="207"
                y1="194"
                x2="207"
                y2="260"
                stroke="#e0f2fe"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                className="water-stream-dash"
              />

              {/* Falling droplets cascading down from the nozzle */}
              <circle cx="204" cy="206" r="2.2" fill="#e0f2fe" className="water-drop-anim-1" />
              <circle cx="210" cy="216" r="2.8" fill="#7dd3fc" className="water-drop-anim-2" />
              <circle cx="205" cy="232" r="3.2" fill="#38bdf8" className="water-drop-anim-3" />
              <circle cx="209" cy="250" r="2.5" fill="#bae6fd" className="water-drop-anim-1" />

              {/* Aerator nozzle mist splash */}
              <ellipse cx="207" cy="195" rx="7" ry="2" fill="#e0f2fe" opacity="0.8" className="animate-ping" />
            </g>
          )}

          {/* Idle Drip when OFF (subtle realistic water bead at nozzle) */}
          {!isOn && (
            <g>
              <ellipse cx="207" cy="195" rx="3.5" ry="2" fill="#38bdf8" opacity="0.75" />
              <circle cx="207" cy="199" r="2.2" fill="#7dd3fc" className="idle-drip-anim" />
            </g>
          )}
        </svg>

        {/* The Exact Spout Anchor Div (Used for absolute positioning coordinates of skill trajectories) */}
        <div
          ref={spoutRef}
          id="tap-spout-anchor"
          className="absolute pointer-events-none"
          style={{
            left: '64.5%',
            top: '74%',
            width: '12px',
            height: '12px',
          }}
        />

        {/* Interactive Click Hint */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/70 text-[11px] font-medium text-slate-300 backdrop-blur-md shadow-lg pointer-events-none group-hover:border-indigo-400 group-hover:text-white transition-all">
          <Droplets className="w-3 h-3 text-sky-400 animate-bounce" />
          <span>{isOn ? 'Tap is ON — Skills Flowing' : 'Click Tap to Flow Skills'}</span>
        </div>
      </div>
    </div>
  );
};
