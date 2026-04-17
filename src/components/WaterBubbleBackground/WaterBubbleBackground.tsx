"use client";

import { useEffect, useRef } from "react";

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
    const bubbles: Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      alpha: number;
      hue: number;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    const colors = [
      { h: 243, s: 76, l: 66 },
      { h: 270, s: 59, l: 52 },
      { h: 199, s: 98, l: 64 },
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBubbles();
    };

    const initBubbles = () => {
      bubbles.length = 0;
      const count = Math.floor((width * height) / 45000);
      for (let i = 0; i < count; i++) {
        const c = colors[i % colors.length];
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1.2,
          speed: Math.random() * 0.12 + 0.04,
          alpha: Math.random() * 0.06 + 0.025,
          hue: c.h,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.025 + 0.008,
        });
      }
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const b of bubbles) {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.2;

        if (b.y < -b.radius * 2) {
          b.y = height + b.radius * 2;
          b.x = Math.random() * width;
        }

        const gradient = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          0,
          b.x,
          b.y,
          b.radius * 2
        );
        gradient.addColorStop(0, `hsla(${b.hue}, 70%, 80%, ${b.alpha * 1.5})`);
        gradient.addColorStop(0.5, `hsla(${b.hue}, 60%, 60%, ${b.alpha})`);
        gradient.addColorStop(1, `hsla(${b.hue}, 50%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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
