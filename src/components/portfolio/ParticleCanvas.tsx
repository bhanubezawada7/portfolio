import React, { useEffect, useRef, useState, useCallback } from 'react';

export type IntroPhase = 'scattered' | 'converging' | 'formed' | 'interactive';

interface ParticleCanvasProps {
  phase: IntroPhase;
  portraitSrc?: string;
  onImageLoaded?: () => void;
  className?: string;
}

interface Particle {
  // Target position on screen
  tx: number;
  ty: number;
  // Starting scattered position
  sx: number;
  sy: number;
  // Current dynamic position
  x: number;
  y: number;
  // Velocity for spring physics
  vx: number;
  vy: number;
  // Rendering properties
  radius: number;
  baseRadius: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  baseAlpha: number;
  luminance: number;
  // Shimmer / twinkle
  twinklePhase: number;
  twinkleSpeed: number;
  isHighlight: boolean;
  // Animation delay & 3D depth factor
  delay: number;
  depth: number;
}

interface AmbientStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinklePhase: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  phase,
  portraitSrc = '/assets/bhausri_cutout.png',
  onImageLoaded,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const phaseRef = useRef<IntroPhase>(phase);
  const convergenceStartTimeRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; tiltX: number; tiltY: number }>({
    x: -9999,
    y: -9999,
    active: false,
    tiltX: 0,
    tiltY: 0
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Keep phaseRef in sync with phase prop
  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 'converging' && convergenceStartTimeRef.current === null) {
      convergenceStartTimeRef.current = performance.now();
    } else if (phase === 'scattered') {
      convergenceStartTimeRef.current = null;
      // Re-scatter particles
      const canvas = canvasRef.current;
      if (canvas && particlesRef.current.length > 0) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        for (const p of particlesRef.current) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.min(w, h) * (0.6 + Math.random() * 0.9);
          p.sx = w * 0.5 + Math.cos(angle) * dist;
          p.sy = h * 0.45 + Math.sin(angle) * dist;
          p.x = p.sx;
          p.y = p.sy;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = (Math.random() - 0.5) * 1.5;
        }
      }
    }
  }, [phase]);

  // Load and sample image into particles
  const initParticles = useCallback((img: HTMLImageElement, width: number, height: number) => {
    // Determine sample resolution based on viewport width
    const isMobile = width < 640;
    const isTablet = width < 1024;
    // Step size: 2 for desktop (~11,000 particles), 3 for mobile (~5,000 particles)
    const step = isMobile ? 3 : isTablet ? 2 : 2;

    const offW = Math.round(180 / (step === 3 ? 1.4 : 1));
    const offH = Math.round((offW * img.naturalHeight) / img.naturalWidth);

    const offscreen = document.createElement('canvas');
    offscreen.width = offW;
    offscreen.height = offH;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.drawImage(img, 0, 0, offW, offH);
    const imgData = offCtx.getImageData(0, 0, offW, offH);
    const data = imgData.data;

    // Calculate display dimensions on main canvas
    // Profile photo should sit prominently behind/framing the title
    const maxHeroHeight = isMobile ? height * 0.6 : height * 0.72;
    const maxHeroWidth = isMobile ? width * 0.88 : Math.min(width * 0.52, 540);

    const aspect = img.naturalWidth / img.naturalHeight;
    let targetW = maxHeroHeight * aspect;
    let targetH = maxHeroHeight;

    if (targetW > maxHeroWidth) {
      targetW = maxHeroWidth;
      targetH = targetW / aspect;
    }

    // Center horizontally, position in the upper-mid region so the head and face
    // rise behind and above the center-chest "PORTFOLIO" typography
    const startX = (width - targetW) * 0.5;
    const startY = isMobile ? height * 0.08 : height * 0.06;

    const newParticles: Particle[] = [];

    for (let py = 0; py < offH; py += 1) {
      for (let px = 0; px < offW; px += 1) {
        const idx = (py * offW + px) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        // Filter background pixels:
        // If cutout has transparency, use alpha > 40
        // Fallback filter for plain studio wall if alpha is 255
        if (a < 40) continue;

        const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        const brightness = (r + g + b) / 3;
        // If it's a solid grey studio wall pixel, skip
        if (brightness > 200 && maxDiff < 14 && a > 240) continue;

        // Target coordinates on screen
        const tx = startX + (px / offW) * targetW;
        const ty = startY + (py / offH) * targetH;

        // Scatter starting position: random cosmic dispersion outward
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.min(width, height) * (0.6 + Math.random() * 0.9);
        const sx = width * 0.5 + Math.cos(angle) * dist;
        const sy = height * 0.45 + Math.sin(angle) * dist;

        // Luminance for particle intensity
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const isHighlight = lum > 190;

        // Subtle color tuning:
        // Highlights sparkle in pure diamond-white / luminous cyan-silver
        // Midtones preserve skin radiance + futuristic starlight
        let pr = r;
        let pg = g;
        let pb = b;
        if (isHighlight) {
          pr = Math.min(255, r * 0.6 + 130);
          pg = Math.min(255, g * 0.6 + 135);
          pb = Math.min(255, b * 0.6 + 160);
        } else {
          pr = Math.min(255, r * 0.85 + 40);
          pg = Math.min(255, g * 0.85 + 40);
          pb = Math.min(255, b * 0.85 + 65);
        }

        // Particle size based on brightness and device
        const baseRadius = isHighlight
          ? isMobile ? 1.4 : 1.9
          : isMobile ? 0.9 : 1.35;

        // Normalized distance from face center for cinematic inward cascade
        const distFromCenter = Math.hypot(tx - (startX + targetW * 0.5), ty - (startY + targetH * 0.4));
        const maxDist = Math.hypot(targetW * 0.5, targetH * 0.5);
        const normDist = Math.min(1, distFromCenter / maxDist);

        // Staggered delay: particles assemble starting from face outwards
        const delay = normDist * 0.5 + Math.random() * 0.35;

        newParticles.push({
          tx,
          ty,
          sx,
          sy,
          x: sx,
          y: sy,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: baseRadius,
          baseRadius,
          r: pr,
          g: pg,
          b: pb,
          alpha: isHighlight ? 0.95 : 0.65,
          baseAlpha: isHighlight ? 0.95 : 0.65,
          luminance: lum,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.03 + Math.random() * 0.05,
          isHighlight,
          delay,
          depth: 0.5 + (lum / 255) * 0.7
        });
      }
    }

    particlesRef.current = newParticles;

    // Ambient floating stars for rich cosmic depth
    const ambientCount = isMobile ? 35 : 70;
    const stars: AmbientStar[] = [];
    for (let i = 0; i < ambientCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 0.8 + Math.random() * 1.2,
        alpha: 0.2 + Math.random() * 0.5,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    ambientStarsRef.current = stars;
    setIsLoaded(true);
    onImageLoaded?.();
  }, [onImageLoaded]);

  // Load image with fallback
  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoaded = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      initParticles(img, w, h);
    };

    img.onload = handleLoaded;
    img.onerror = () => {
      // Fallback to standard portrait if cutout fails
      if (portraitSrc !== '/assets/bhausri_portrait.jpg') {
        img.src = '/assets/bhausri_portrait.jpg';
      }
    };

    img.src = portraitSrc;

    return () => {
      isCancelled = true;
    };
  }, [portraitSrc, initParticles]);

  // Main animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clear with obsidian background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentPhase = phaseRef.current;
      const particles = particlesRef.current;
      const stars = ambientStarsRef.current;
      const mouse = mouseRef.current;

      // 1. Render subtle ambient stardust
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        s.twinklePhase += 0.04;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));

        ctx.fillStyle = `rgba(165, 180, 252, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x * dpr, s.y * dpr, s.radius * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Calculate convergence progress (0 to 1) over ~1.8 seconds
      let convergenceProgress = 0;
      if (currentPhase === 'converging') {
        if (!convergenceStartTimeRef.current) {
          convergenceStartTimeRef.current = now;
        }
        const elapsed = (now - convergenceStartTimeRef.current) / 1000;
        convergenceProgress = Math.min(1, elapsed / 1.6);
      } else if (currentPhase === 'formed' || currentPhase === 'interactive') {
        convergenceProgress = 1;
      }

      const isInteractive = currentPhase === 'interactive' || currentPhase === 'formed';

      // Parallax offset from mouse tilt
      const parallaxFactorX = mouse.tiltX * 18;
      const parallaxFactorY = mouse.tiltY * 14;

      // 2. Render Portrait Particles
      const mouseRepelRadius = width < 640 ? 70 : 100;
      const mouseRepelRadiusSq = mouseRepelRadius * mouseRepelRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (currentPhase === 'scattered') {
          // Floating nebula state: gentle ambient drift around starting point
          p.x += p.vx * dt * 30;
          p.y += p.vy * dt * 30;

          // Soft boundary bounce
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        } else if (convergenceProgress < 1) {
          // Inward cinematic streaming with cubic easing
          // Apply individual delay for progressive wave effect
          const particleProgress = Math.max(0, Math.min(1, (convergenceProgress - p.delay * 0.4) / (1 - p.delay * 0.4)));
          // Cubic ease-out
          const ease = 1 - Math.pow(1 - particleProgress, 3);

          // Add a subtle spiral vortex during flight
          const spiralAngle = (1 - ease) * Math.PI * 0.8;
          const directX = p.sx + (p.tx - p.sx) * ease;
          const directY = p.sy + (p.ty - p.sy) * ease;

          const cosA = Math.cos(spiralAngle);
          const sinA = Math.sin(spiralAngle);
          const offsetX = (p.sx - p.tx) * (1 - ease) * 0.2;
          const offsetY = (p.sy - p.ty) * (1 - ease) * 0.2;

          p.x = directX + (offsetX * cosA - offsetY * sinA);
          p.y = directY + (offsetX * sinA + offsetY * cosA);
        } else {
          // Formed & Interactive State: Spring physics + Parallax + Mouse Repulsion
          const targetX = p.tx + parallaxFactorX * p.depth;
          const targetY = p.ty + parallaxFactorY * p.depth;

          // Spring pull towards target position
          const spring = 0.08;
          const friction = 0.82;

          p.vx += (targetX - p.x) * spring;
          p.vy += (targetY - p.y) * spring;

          // Mouse interaction (repel)
          if (isInteractive && mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouseRepelRadiusSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / mouseRepelRadius) * 22;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Shimmer / Twinkle modulation
        p.twinklePhase += p.twinkleSpeed;
        const shimmer = 0.8 + 0.25 * Math.sin(p.twinklePhase);
        const finalAlpha = Math.min(1, p.baseAlpha * shimmer);

        // Draw particle
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.radius * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Extra glowing corona on intense highlights (eyes, smile, jewelry)
        if (p.isHighlight && shimmer > 0.95 && convergenceProgress > 0.7) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * finalAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x * dpr, p.y * dpr, p.radius * 1.8 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Reload/resample particles for new size if loaded
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        initParticles(img, w, h);
      };
      img.src = portraitSrc;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [portraitSrc, initParticles]);

  // Handle Mouse / Touch interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      mouseRef.current = {
        x,
        y,
        active: true,
        tiltX: normX,
        tiltY: normY
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
        active: false,
        tiltX: 0,
        tiltY: 0
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          active: true,
          tiltX: (touch.clientX / window.innerWidth) * 2 - 1,
          tiltY: (touch.clientY / window.innerHeight) * 2 - 1
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
      mouseRef.current.tiltX = 0;
      mouseRef.current.tiltY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />
    </div>
  );
};
