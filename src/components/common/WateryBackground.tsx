import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  swaySpeed: number;
  swayDistance: number;
  swayOffset: number;
  opacity: number;
  hue: number;
}

interface WateryBackgroundProps {
  className?: string;
}

export const WateryBackground: React.FC<WateryBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate subtle, translucent floating water bubbles
    const bubbleCount = Math.min(Math.floor(width / 35), 45);
    const bubbles: Bubble[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 4 + Math.random() * 14,
        speed: 0.35 + Math.random() * 0.7,
        swaySpeed: 0.008 + Math.random() * 0.015,
        swayDistance: 15 + Math.random() * 30,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.12 + Math.random() * 0.22,
        hue: 195 + Math.random() * 35 // cyan to sky-blue range
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render subtle watery caustics gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.015)');
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.01)');
      gradient.addColorStop(1, 'rgba(14, 165, 233, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render each floating bubble
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // Move upward
        b.y -= b.speed;
        // Horizontal gentle sinusoidal sway
        const currentX = b.x + Math.sin(time * b.swaySpeed + b.swayOffset) * b.swayDistance;

        // Reset bubble to bottom once it floats above the viewport
        if (b.y + b.radius < 0) {
          b.y = height + b.radius + 10;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);

        // Soft watery radial gradient for 3D sphere look
        const radGrad = ctx.createRadialGradient(
          currentX - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          currentX,
          b.y,
          b.radius
        );
        radGrad.addColorStop(0, `hsla(${b.hue}, 90%, 95%, ${b.opacity * 0.9})`);
        radGrad.addColorStop(0.3, `hsla(${b.hue}, 80%, 75%, ${b.opacity * 0.4})`);
        radGrad.addColorStop(0.8, `hsla(${b.hue}, 85%, 60%, ${b.opacity * 0.2})`);
        radGrad.addColorStop(1, `hsla(${b.hue}, 90%, 50%, ${b.opacity * 0.6})`);

        ctx.fillStyle = radGrad;
        ctx.fill();

        // Delicate outer rim
        ctx.strokeStyle = `hsla(${b.hue}, 90%, 85%, ${b.opacity * 0.75})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glossy highlight arc (specular reflection)
        ctx.beginPath();
        ctx.arc(
          currentX - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.45,
          Math.PI * 1.1,
          Math.PI * 1.85
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.95})`;
        ctx.lineWidth = Math.max(1, b.radius * 0.15);
        ctx.stroke();

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-75 transition-opacity duration-700 ${className}`}
    />
  );
};
