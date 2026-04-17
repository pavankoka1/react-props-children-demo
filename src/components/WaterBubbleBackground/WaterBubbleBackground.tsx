"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background: soft rising “bubbles” + a sparse drifting node mesh
 * (particle-portrait–inspired field, but Canvas2D only — no WebGL).
 * Colors follow :root theme (--theme-*-rgb / brand gradient).
 */
const BRAND_HUES = [
  { h: 231, s: 52, l: 62 },
  { h: 268, s: 48, l: 54 },
  { h: 199, s: 90, l: 64 },
];

type Bubble = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  hue: { h: number; s: number; l: number };
  wobble: number;
  wobbleSpeed: number;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function WaterBubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    let width = 0;
    let height = 0;
    const bubbles: Bubble[] = [];
    const nodes: Node[] = [];

    const mqReduce =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reduceMotion = mqReduce?.matches ?? false;

    const EDGE_MAX = 145;
    const NODE_COUNT_DIV = 52000;

    const initBubbles = () => {
      bubbles.length = 0;
      const count = Math.max(
        12,
        Math.floor((width * height) / 42000)
      );
      for (let i = 0; i < count; i++) {
        const hue = BRAND_HUES[i % BRAND_HUES.length];
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.4 + 1.1,
          speed: Math.random() * 0.11 + 0.035,
          alpha: Math.random() * 0.055 + 0.022,
          hue,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.022 + 0.006,
        });
      }
    };

    const initNodes = () => {
      nodes.length = 0;
      const n = Math.max(
        18,
        Math.floor((width * height) / NODE_COUNT_DIV)
      );
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
        });
      }
    };

    const drawNetwork = () => {
      const [r, g, b] = [102, 126, 234];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const bnode = nodes[j];
          const dx = a.x - bnode.x;
          const dy = a.y - bnode.y;
          const d = Math.hypot(dx, dy);
          if (d < EDGE_MAX && d > 0) {
            const t = 1 - d / EDGE_MAX;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.045 * t * t})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bnode.x, bnode.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawBubbles = () => {
      for (const b of bubbles) {
        const { h, s, l } = b.hue;
        const gradient = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          0,
          b.x,
          b.y,
          b.radius * 2
        );
        gradient.addColorStop(
          0,
          `hsla(${h}, ${s}%, ${l + 12}%, ${b.alpha * 1.45})`
        );
        gradient.addColorStop(0.55, `hsla(${h}, ${s}%, ${l}%, ${b.alpha})`);
        gradient.addColorStop(1, `hsla(${h}, ${s}%, ${l - 8}%, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const stepNodes = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }
    };

    const stepBubbles = () => {
      for (const b of bubbles) {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.18;
        if (b.y < -b.radius * 3) {
          b.y = height + b.radius * 2;
          b.x = Math.random() * width;
        }
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      if (!reduceMotion) stepNodes();
      drawNetwork();
      if (!reduceMotion) stepBubbles();
      drawBubbles();
    };

    let animationId = 0;

    const loop = () => {
      frame();
      animationId = requestAnimationFrame(loop);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBubbles();
      initNodes();
      ctx.clearRect(0, 0, width, height);
      drawNetwork();
      drawBubbles();
    };

    const onReduceChange = () => {
      reduceMotion = mqReduce?.matches ?? false;
      cancelAnimationFrame(animationId);
      resize();
      if (!reduceMotion) loop();
    };

    resize();
    window.addEventListener("resize", resize);
    mqReduce?.addEventListener("change", onReduceChange);

    if (!reduceMotion) {
      loop();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      mqReduce?.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
