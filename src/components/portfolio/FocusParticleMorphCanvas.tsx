import React, { useEffect, useRef } from 'react';

export type FocusDomainId = 'eee' | 'digital' | 'ml' | 'energy';

interface FocusParticleMorphCanvasProps {
  activeDomain: FocusDomainId;
  className?: string;
}

interface Particle3D {
  // Current 3D position
  x: number;
  y: number;
  z: number;
  // Target 3D position
  targetX: number;
  targetY: number;
  targetZ: number;
  // Current colors
  r: number;
  g: number;
  b: number;
  alpha: number;
  radius: number;
  // Target colors
  targetR: number;
  targetG: number;
  targetB: number;
  targetAlpha: number;
  targetRadius: number;
  // Dynamic twinkle
  twinklePhase: number;
  twinkleSpeed: number;
}

const PARTICLE_COUNT = 1800;

// Generator for target positions and colors for each domain
function computeTargetShape(domain: FocusDomainId, count: number): Array<{
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  radius: number;
}> {
  const targets: Array<{
    x: number;
    y: number;
    z: number;
    r: number;
    g: number;
    b: number;
    alpha: number;
    radius: number;
  }> = [];

  switch (domain) {
    case 'eee': {
      // 1. Engineering Rigor: 3D Electromagnetic Dynamo Torus + 2 Orbital Flux Rings
      // 1200 particles on Torus, 600 on dual orbital flux rings
      const torusCount = 1200;
      const ringCount = count - torusCount;

      for (let i = 0; i < torusCount; i++) {
        const u = (i / torusCount) * Math.PI * 2;
        const v = ((i * 23) % torusCount / torusCount) * Math.PI * 2;
        const R = 0.95;
        const r = 0.38 + (Math.sin(i * 1.5) * 0.05);

        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u) * 0.9;
        const z = r * Math.sin(v);

        // Electric Amber / Deep Gold / Cyan sparks
        const isCyan = i % 7 === 0;
        targets.push({
          x,
          y,
          z,
          r: isCyan ? 0 : 245,
          g: isCyan ? 229 : 158 + (i % 50),
          b: isCyan ? 255 : 11,
          alpha: 0.75 + Math.random() * 0.25,
          radius: isCyan ? 1.5 : 1.1 + Math.random() * 0.6
        });
      }

      // Orbital electron flux loops
      for (let i = 0; i < ringCount; i++) {
        const isRingA = i < ringCount / 2;
        const theta = (i / (ringCount / 2)) * Math.PI * 2;
        const radius = 1.38 + (Math.random() - 0.5) * 0.08;
        const tilt = isRingA ? Math.PI / 4 : -Math.PI / 4;

        const lx = Math.cos(theta) * radius;
        const ly = Math.sin(theta) * radius * Math.cos(tilt);
        const lz = Math.sin(theta) * radius * Math.sin(tilt);

        targets.push({
          x: lx,
          y: ly,
          z: lz,
          r: isRingA ? 0 : 255,
          g: isRingA ? 229 : 215,
          b: isRingA ? 255 : 0,
          alpha: 0.85,
          radius: 1.4 + Math.random() * 0.5
        });
      }
      break;
    }

    case 'digital': {
      // 2. Digital Marketing & Growth: 3D Ascending Growth Spiral + Exponential Arrow Crest
      // Canvas Y goes down, so growth ascends from positive Y (bottom) to negative Y (top)
      const spiralCount = 1300;
      const arrowCount = count - spiralCount;

      for (let i = 0; i < spiralCount; i++) {
        const t = i / spiralCount; // 0 (start) to 1 (peak)
        const y = 1.15 - 2.3 * t; // Rises from bottom (+1.15) to top (-1.15)
        const r = 0.22 + 0.95 * Math.pow(t, 1.35) + (Math.sin(i * 0.5) * 0.04);
        const theta = 5.4 * Math.PI * t;

        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        // Indigo, Royal Blue, Radiant Violet, Electric Pink
        const cVal = i % 4;
        let cr = 99, cg = 102, cb = 241; // Indigo
        if (cVal === 1) { cr = 168; cg = 85; cb = 247; } // Violet
        else if (cVal === 2) { cr = 236; cg = 72; cb = 153; } // Pink
        else if (cVal === 3) { cr = 56; cg = 189; cb = 248; } // Cyan

        targets.push({
          x,
          y,
          z,
          r: cr,
          g: cg,
          b: cb,
          alpha: 0.7 + t * 0.3,
          radius: 1.1 + t * 0.7
        });
      }

      // Radiating Apex Growth Arrow at the top (negative Y)
      for (let i = 0; i < arrowCount; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const prog = (i / arrowCount);
        const ax = side * prog * 0.75;
        const ay = -1.25 - (1 - prog) * 0.45; // Pointing upwards into the sky
        const az = (Math.random() - 0.5) * 0.25;

        targets.push({
          x: ax,
          y: ay,
          z: az,
          r: 255,
          g: 255,
          b: 255,
          alpha: 0.95,
          radius: 1.5 + Math.random() * 0.8
        });
      }
      break;
    }

    case 'ml': {
      // 3. Machine Learning & Tech: 3D Multi-Layer Neural Network & Synapse Graph
      // 4 layers of nodes: Input (-1.15), Hidden1 (-0.38), Hidden2 (0.38), Output (1.15)
      const layers = [
        { x: -1.15, nodes: [-0.75, -0.25, 0.25, 0.75] },
        { x: -0.38, nodes: [-0.9, -0.54, -0.18, 0.18, 0.54, 0.9] },
        { x: 0.38, nodes: [-0.9, -0.54, -0.18, 0.18, 0.54, 0.9] },
        { x: 1.15, nodes: [-0.75, -0.25, 0.25, 0.75] },
      ];

      // 700 particles clustered around node clusters
      const clusterCount = 700;
      const allNodes: Array<{ x: number; y: number; z: number }> = [];
      layers.forEach(l => {
        l.nodes.forEach(ny => {
          allNodes.push({ x: l.x, y: ny, z: (Math.sin(ny * 3) * 0.2) });
        });
      });

      for (let i = 0; i < clusterCount; i++) {
        const node = allNodes[i % allNodes.length];
        const rad = 0.08 + Math.random() * 0.06;
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;

        const x = node.x + rad * Math.sin(v) * Math.cos(u);
        const y = node.y + rad * Math.sin(v) * Math.sin(u);
        const z = node.z + rad * Math.cos(v);

        // Electric Cyan & Pure White
        const isWhite = i % 5 === 0;
        targets.push({
          x,
          y,
          z,
          r: isWhite ? 255 : 0,
          g: isWhite ? 255 : 229,
          b: 255,
          alpha: 0.9,
          radius: isWhite ? 1.7 : 1.3
        });
      }

      // Synapse connection pathways between adjacent layers
      const synapseCount = count - clusterCount;
      for (let i = 0; i < synapseCount; i++) {
        const layerIdx = i % 3; // 0->1, 1->2, 2->3
        const srcLayer = layers[layerIdx];
        const dstLayer = layers[layerIdx + 1];

        const srcY = srcLayer.nodes[(i * 3) % srcLayer.nodes.length];
        const dstY = dstLayer.nodes[(i * 5) % dstLayer.nodes.length];

        const s = Math.random(); // interpolation along connection
        const x = srcLayer.x + (dstLayer.x - srcLayer.x) * s;
        const y = srcY + (dstY - srcY) * s + (Math.sin(s * Math.PI) * 0.04);
        const z = (Math.sin(y * 4) * 0.15) + (Math.random() - 0.5) * 0.06;

        targets.push({
          x,
          y,
          z,
          r: 168,
          g: 85,
          b: 247, // Neon purple synapse
          alpha: 0.65 + Math.sin(s * Math.PI) * 0.3,
          radius: 0.9 + Math.random() * 0.5
        });
      }
      break;
    }

    case 'energy': {
      // 4. Energy Management: 3D Renewable Solar Pulse Sphere + Helical Magnetic Grid Lines
      const coreCount = 1000;
      const flareCount = count - coreCount;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

      // Core pulsating sun sphere
      for (let i = 0; i < coreCount; i++) {
        const y = 1 - (i / (coreCount - 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        const sphereR = 0.68 + (Math.random() - 0.5) * 0.06;

        const x = Math.cos(theta) * radiusAtY * sphereR;
        const z = Math.sin(theta) * radiusAtY * sphereR;
        const py = y * sphereR;

        // Emerald Green, Luminous Teal, Solar Lime
        const isTeal = i % 3 === 0;
        targets.push({
          x,
          y: py,
          z,
          r: isTeal ? 20 : 16,
          g: isTeal ? 184 : 185,
          b: isTeal ? 166 : 129,
          alpha: 0.8,
          radius: 1.2 + Math.random() * 0.6
        });
      }

      // Radiating helical solar flare rings and power grid loops
      for (let i = 0; i < flareCount; i++) {
        const theta = (i / flareCount) * Math.PI * 6;
        const flareR = 0.72 + (i / flareCount) * 0.65;
        const flareY = Math.sin(theta * 1.5) * 0.55;

        const x = Math.cos(theta) * flareR;
        const z = Math.sin(theta) * flareR;
        const y = flareY;

        targets.push({
          x,
          y,
          z,
          r: 132,
          g: 204,
          b: 22, // Solar lime
          alpha: 0.75,
          radius: 1.3 + Math.random() * 0.5
        });
      }
      break;
    }
  }

  return targets;
}

export const FocusParticleMorphCanvas: React.FC<FocusParticleMorphCanvasProps> = ({
  activeDomain,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle3D[]>([]);

  // 3D rotation & interactive mouse tracking state
  const rotRef = useRef({
    x: 0.15,
    y: 0,
    targetX: 0.15,
    targetY: 0,
    shiftX: 0,
    shiftY: 0,
    targetShiftX: 0,
    targetShiftY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragRotStartX: 0,
    dragRotStartY: 0
  });

  // 1. Initialize particles once on mount
  useEffect(() => {
    const initialTargets = computeTargetShape(activeDomain, PARTICLE_COUNT);
    const particles: Particle3D[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = initialTargets[i] || initialTargets[0];
      particles.push({
        x: t.x,
        y: t.y,
        z: t.z,
        targetX: t.x,
        targetY: t.y,
        targetZ: t.z,
        r: t.r,
        g: t.g,
        b: t.b,
        alpha: t.alpha,
        radius: t.radius,
        targetR: t.r,
        targetG: t.g,
        targetB: t.b,
        targetAlpha: t.alpha,
        targetRadius: t.radius,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04
      });
    }

    particlesRef.current = particles;
  }, []);

  // 2. Seamlessly morph particles whenever activeDomain changes
  useEffect(() => {
    if (particlesRef.current.length === 0) return;

    const newTargets = computeTargetShape(activeDomain, PARTICLE_COUNT);
    const particles = particlesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const target = newTargets[i] || newTargets[0];
      const p = particles[i];
      p.targetX = target.x;
      p.targetY = target.y;
      p.targetZ = target.z;
      p.targetR = target.r;
      p.targetG = target.g;
      p.targetB = target.b;
      p.targetAlpha = target.alpha;
      p.targetRadius = target.radius;
    }
  }, [activeDomain]);

  // 3. Interactive Mouse Movement Tracking
  const handleMouseMoveCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.5)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.5)));

    rotRef.current.targetY = normX * 0.95;
    rotRef.current.targetX = -normY * 0.75;
    rotRef.current.targetShiftX = normX * 28;
    rotRef.current.targetShiftY = normY * 18;
  };

  const handleMouseLeaveCanvas = () => {
    rotRef.current.targetX = 0.15;
    rotRef.current.targetY = 0;
    rotRef.current.targetShiftX = 0;
    rotRef.current.targetShiftY = 0;
  };

  // Drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    rotRef.current.isDragging = true;
    rotRef.current.dragStartX = e.clientX;
    rotRef.current.dragStartY = e.clientY;
    rotRef.current.dragRotStartX = rotRef.current.x;
    rotRef.current.dragRotStartY = rotRef.current.y;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (rotRef.current.isDragging) {
      const dx = e.clientX - rotRef.current.dragStartX;
      const dy = e.clientY - rotRef.current.dragStartY;
      rotRef.current.y = rotRef.current.dragRotStartY + dx * 0.008;
      rotRef.current.x = rotRef.current.dragRotStartX + dy * 0.008;
    } else {
      handleMouseMoveCanvas(e);
    }
  };

  const handleMouseUp = () => {
    rotRef.current.isDragging = false;
  };

  // 4. Main 3D Particle Morphing Render Loop
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

      // Continuous ambient rotation around Y axis
      rot.y += 0.004;

      // Smooth interpolation for mouse-tracking rotation & shift
      rot.x += (rot.targetX - rot.x) * 0.06;
      rot.shiftX += (rot.targetShiftX - rot.shiftX) * 0.06;
      rot.shiftY += (rot.targetShiftY - rot.shiftY) * 0.06;

      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);

      // Adaptive scale based on canvas dimensions
      const isMobile = width < 640;
      const baseScale = Math.min(width, height) * (isMobile ? 0.32 : 0.34);
      const centerX = width * 0.5 + rot.shiftX;
      const centerY = height * 0.5 + rot.shiftY;
      const fov = 380;

      // Liquid morphing factor: 0.062 per frame delivers ~700ms buttery smooth morph
      const morphEase = 0.062;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Morph current 3D position toward target
        p.x += (p.targetX - p.x) * morphEase;
        p.y += (p.targetY - p.y) * morphEase;
        p.z += (p.targetZ - p.z) * morphEase;
        p.r += (p.targetR - p.r) * morphEase;
        p.g += (p.targetG - p.g) * morphEase;
        p.b += (p.targetB - p.b) * morphEase;
        p.alpha += (p.targetAlpha - p.alpha) * morphEase;
        p.radius += (p.targetRadius - p.radius) * morphEase;

        // 1. Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // 2. Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // 3. 3D Perspective Projection
        const scale = fov / (fov + z2 * baseScale + baseScale * 0.25);
        const projX = centerX + x1 * baseScale * scale;
        const projY = centerY + y2 * baseScale * scale;

        // 4. Depth shading & dynamic twinkle
        const normZ = (z2 + 1) * 0.5; // 0 (far) to 1 (near)
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.85 + 0.15 * Math.sin(p.twinklePhase);

        const currentAlpha = Math.max(0.12, Math.min(1, p.alpha * (0.35 + normZ * 0.65) * twinkle));
        const currentRadius = Math.max(0.6, p.radius * scale * (0.7 + normZ * 0.55));

        // Draw particle
        ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${currentAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(projX * dpr, projY * dpr, currentRadius * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Corona glow on frontal bright particles
        if (normZ > 0.65 && currentRadius > 1.4) {
          ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${(currentAlpha * 0.28).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(projX * dpr, projY * dpr, currentRadius * 1.85 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // 5. Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 500;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeaveCanvas}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        aria-label="Interactive 3D particle morph animation"
      />
    </div>
  );
};
