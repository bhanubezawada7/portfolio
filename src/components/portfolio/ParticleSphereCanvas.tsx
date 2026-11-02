import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ParticleSphereCanvasProps {
  className?: string;
  active?: boolean;
}

interface SphereParticle {
  // Base 3D spherical coordinates (-1 to +1 unit sphere)
  baseX: number;
  baseY: number;
  baseZ: number;
  // Current 3D coordinates
  x: number;
  y: number;
  z: number;
  // Visual appearance
  radius: number;
  r: number;
  g: number;
  b: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

export const ParticleSphereCanvas: React.FC<ParticleSphereCanvasProps> = ({
  className = '',
  active = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Rotation angles & momentum
  const rotRef = useRef({
    x: 0.2,
    y: 0,
    targetX: 0.2,
    targetY: 0,
    shiftX: 0,
    shiftY: 0,
    targetShiftX: 0,
    targetShiftY: 0
  });

  const particlesRef = useRef<SphereParticle[]>([]);

  // Initialize 3D particles on a spherical shell using Fibonacci distribution
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const count = isMobile ? 1400 : 2200;
    const particles: SphereParticle[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

    for (let i = 0; i < count; i++) {
      // Uniform distribution on sphere
      const y = 1 - (i / (count - 1)) * 2; // -1 to +1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      // Volumetric cloud thickness: small radial jitter creates authentic cosmic stardust volume
      const radialVariation = 0.92 + Math.random() * 0.16;

      const x = Math.cos(theta) * radiusAtY * radialVariation;
      const z = Math.sin(theta) * radiusAtY * radialVariation;
      const py = y * radialVariation;

      // Color scheme: Diamond white, Electric Cyan, Soft Lavender Starlight
      const colorRand = Math.random();
      let r = 255;
      let g = 255;
      let b = 255;
      let baseAlpha = 0.75 + Math.random() * 0.25;
      let radius = isMobile ? 0.9 + Math.random() * 0.8 : 1.1 + Math.random() * 1.2;

      if (colorRand < 0.55) {
        // Pure diamond starlight white
        r = 255;
        g = 255;
        b = 255;
        radius = isMobile ? 1.0 + Math.random() * 0.9 : 1.3 + Math.random() * 1.3;
      } else if (colorRand < 0.82) {
        // Electric Cyan (#00E5FF / #38BDF8)
        r = 0;
        g = 229;
        b = 255;
        baseAlpha = 0.9;
        radius = isMobile ? 1.1 + Math.random() * 0.8 : 1.4 + Math.random() * 1.1;
      } else {
        // Soft violet / blue nebula starlight (#A5B4FC)
        r = 165;
        g = 180;
        b = 252;
        baseAlpha = 0.7;
      }

      particles.push({
        baseX: x,
        baseY: py,
        baseZ: z,
        x,
        y: py,
        z,
        radius,
        r,
        g,
        b,
        baseAlpha,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04
      });
    }

    particlesRef.current = particles;
  }, []);

  // Global window mouse movement tracking for 3D sphere rotation in both Hero & About Me
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const normX = Math.max(-1, Math.min(1, (e.clientX / w) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, (e.clientY / h) * 2 - 1));

      rotRef.current.targetY = normX * 0.85;
      rotRef.current.targetX = -normY * 0.7;
      rotRef.current.targetShiftX = normX * 30;
      rotRef.current.targetShiftY = normY * 20;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Main 3D Animation Render Loop with Seamless Scroll Transition between Hero and About Me
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rot = rotRef.current;
      const particles = particlesRef.current;

      // Idle continuous rotation around Y axis
      rot.y += 0.0035;

      // Smooth interpolation for mouse-tracking rotation & shift
      rot.x += (rot.targetX - rot.x) * 0.06;
      rot.shiftX += (rot.targetShiftX - rot.shiftX) * 0.06;
      rot.shiftY += (rot.targetShiftY - rot.shiftY) * 0.06;

      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);

      // Dynamic Scroll Positioning: Smooth transition from Hero to right side of About Me
      const isMobile = width < 1024;
      const heroEl = document.getElementById('hero-sphere-target');
      const aboutEl = document.getElementById('about-sphere-target');

      // Default Hero center: behind photo / middle of screen
      let hCenterX = width * 0.5;
      let hCenterY = height * 0.44;
      let hRadius = Math.min(width, height) * (isMobile ? 0.36 : 0.32);

      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        hCenterX = rect.left + rect.width * 0.5;
        hCenterY = rect.top + rect.height * 0.48;
      }

      // Default About Me center: right side on desktop, center on mobile
      let aCenterX = isMobile ? width * 0.5 : width * 0.74;
      let aCenterY = height * 0.5;
      let aRadius = Math.min(width, height) * (isMobile ? 0.32 : 0.28);

      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        aCenterX = rect.left + rect.width * 0.5;
        aCenterY = rect.top + rect.height * 0.5;
        aRadius = Math.min(rect.width, rect.height) * 0.44;
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const heroHeight = height;

      // Smooth scroll progress from 0 (Hero) to 1 (About Me)
      const rawProgress = Math.max(0, Math.min(1, scrollY / (heroHeight * 0.72)));
      // Smoothstep easing for liquid organic motion
      const smoothProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      // Interpolate center and radius
      const baseCenterX = hCenterX + (aCenterX - hCenterX) * smoothProgress;
      const baseCenterY = hCenterY + (aCenterY - hCenterY) * smoothProgress;
      const baseRadius = hRadius + (aRadius - hRadius) * smoothProgress;

      // Apply mouse tracking shift
      const centerX = baseCenterX + rot.shiftX;
      const centerY = baseCenterY + rot.shiftY;
      const sphereRadius = baseRadius;

      // Fade out smoothly if user scrolls past the About Me section (e.g. into Skills or Education)
      let sectionAlpha = 1;
      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        if (rect.bottom < 200) {
          sectionAlpha = Math.max(0, Math.min(1, (rect.bottom + 50) / 250));
        }
      }

      const fov = 420;

      // Render 3D particles with perspective projection
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Rotate around Y axis
        const x1 = p.baseX * cosY + p.baseZ * sinY;
        const z1 = -p.baseX * sinY + p.baseZ * cosY;

        // 2. Rotate around X axis
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = p.baseY * sinX + z1 * cosX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        // 3. Perspective projection
        const scale = fov / (fov + z2 * sphereRadius + sphereRadius * 0.3);
        const projX = centerX + x1 * sphereRadius * scale;
        const projY = centerY + y2 * sphereRadius * scale;

        // 4. Depth-based sizing & alpha
        const normZ = (z2 + 1) * 0.5; // 0 to 1
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.82 + 0.18 * Math.sin(p.twinklePhase);

        const currentAlpha = Math.max(
          0,
          Math.min(1, p.baseAlpha * (0.35 + normZ * 0.65) * twinkle * sectionAlpha)
        );
        const currentRadius = Math.max(0.6, p.radius * scale * (0.7 + normZ * 0.5));

        // Skip completely transparent points
        if (currentAlpha <= 0.01) continue;

        // Draw particle
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${currentAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(projX * dpr, projY * dpr, currentRadius * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Extra glowing corona on frontal bright cyan / white highlights
        if (normZ > 0.65 && p.r > 200 && currentRadius > 1.3) {
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${(currentAlpha * 0.32).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(projX * dpr, projY * dpr, currentRadius * 1.8 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ambient Central Core Glow around the current interpolated center
      if (sectionAlpha > 0.05) {
        const coreGradient = ctx.createRadialGradient(
          centerX * dpr,
          centerY * dpr,
          0,
          centerX * dpr,
          centerY * dpr,
          sphereRadius * 0.85 * dpr
        );
        coreGradient.addColorStop(0, `rgba(0, 229, 255, ${(0.09 * sectionAlpha).toFixed(3)})`);
        coreGradient.addColorStop(0.5, `rgba(0, 86, 179, ${(0.05 * sectionAlpha).toFixed(3)})`);
        coreGradient.addColorStop(1, 'rgba(3, 7, 18, 0)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX * dpr, centerY * dpr, sphereRadius * 0.85 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Handle Resize: Keep canvas matching full viewport at all times
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
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Safe SSR / Node test check
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 pointer-events-none z-[4] transition-opacity duration-700 ${
        active ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ willChange: 'opacity' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none select-none"
        aria-label="Interactive 3D particle sphere"
      />
    </div>,
    document.body
  );
};
