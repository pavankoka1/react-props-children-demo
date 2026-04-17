"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useCallback, useEffect, useRef } from "react";

const N = 1000;
const CYCLE_MS = 12000;

/** Particle trio — snitch + K share the same palette (no phase shift). */
const THEME_A = "#7b8ce8";
const THEME_B = "#8b6bb5";
const THEME_C = "#6ba8e8";

const M = 0.06;

function clamp01(v: number) {
  return Math.min(1 - M, Math.max(M, v));
}

function clampUnit(t: number) {
  return Math.min(1, Math.max(0, t));
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Golden snitch: solid core + two quadratic wing ribbons (stylized). */
function buildSnitchTargets(outX: Float32Array, outY: Float32Array) {
  const rand = mulberry32(13131);
  let k = 0;
  const cx = 0.5;
  const cy = 0.5;

  const coreN = 380;
  for (let i = 0; i < coreN && k < N; i++) {
    const a = (i / coreN) * Math.PI * 2;
    const r = 0.082 + (rand() - 0.5) * 0.022;
    outX[k] = clamp01(cx + Math.cos(a) * r + (rand() - 0.5) * 0.01);
    outY[k] = clamp01(cy + Math.sin(a) * r + (rand() - 0.5) * 0.01);
    k++;
  }

  const wingEach = Math.floor((N - k) / 2);

  const fillWing = (x0: number, x1: number, cxw: number) => {
    for (let i = 0; i < wingEach && k < N; i++) {
      const t = i / wingEach;
      const y1 = 0.24 + Math.sin(t * Math.PI) * 0.09;
      const cywY = 0.35 + Math.cos(t * Math.PI * 0.5) * 0.04;
      const u = t;
      const omt = 1 - u;
      const x = omt * omt * x0 + 2 * omt * u * cxw + u * u * x1;
      const y = omt * omt * cy + 2 * omt * u * cywY + u * u * y1;
      outX[k] = clamp01(x + (rand() - 0.5) * 0.026);
      outY[k] = clamp01(y + (rand() - 0.5) * 0.026);
      k++;
    }
  };

  fillWing(0.41, 0.03, 0.2);
  fillWing(0.59, 0.97, 0.8);

  while (k < N) {
    outX[k] = clamp01(cx + (rand() - 0.5) * 0.05);
    outY[k] = clamp01(cy + (rand() - 0.5) * 0.05);
    k++;
  }
}

const SNITCH_CX = 0.5;
const SNITCH_CY = 0.5;

/** Elegant K: tall stem, balanced diagonals, tighter stroke noise. */
function buildKTargets(outX: Float32Array, outY: Float32Array, seed: number) {
  const stem = 400;
  const upper = 300;
  const lower = 300;
  let k = 0;
  const thick = 0.024;
  const stemX = 0.345;
  const rand = mulberry32(seed);

  for (let i = 0; i < stem && k < N; i++) {
    const t = i / stem;
    const y = 0.12 + t * 0.76;
    outX[k] = stemX + (rand() - 0.5) * thick;
    outY[k] = y + (rand() - 0.5) * thick * 0.48;
    k++;
  }
  const ux0 = stemX;
  const uy0 = 0.4;
  const ux1 = 0.745;
  const uy1 = 0.155;
  for (let i = 0; i < upper && k < N; i++) {
    const t = (i + 0.5 * (rand() - 0.5)) / upper;
    outX[k] = ux0 + (ux1 - ux0) * t + (rand() - 0.5) * thick;
    outY[k] = uy0 + (uy1 - uy0) * t + (rand() - 0.5) * thick * 0.75;
    k++;
  }
  const lx0 = stemX;
  const ly0 = 0.5;
  const lx1 = 0.745;
  const ly1 = 0.845;
  for (let i = 0; i < lower && k < N; i++) {
    const t = (i + 0.5 * (rand() - 0.5)) / lower;
    outX[k] = lx0 + (lx1 - lx0) * t + (rand() - 0.5) * thick;
    outY[k] = ly0 + (ly1 - ly0) * t + (rand() - 0.5) * thick * 0.75;
    k++;
  }
  while (k < N) {
    outX[k] = stemX + (rand() - 0.5) * thick;
    outY[k] = 0.48 + (rand() - 0.5) * 0.3;
    k++;
  }
}

function buildBurstFrom(
  baseX: Float32Array,
  baseY: Float32Array,
  outX: Float32Array,
  outY: Float32Array,
  seed: number,
  strength: number
) {
  const rand = mulberry32(seed);
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < N; i++) {
    cx += baseX[i];
    cy += baseY[i];
  }
  cx /= N;
  cy /= N;
  for (let i = 0; i < N; i++) {
    const dx = baseX[i] - cx;
    const dy = baseY[i] - cy;
    const d = Math.hypot(dx, dy) + 0.02;
    const ux = dx / d;
    const uy = dy / d;
    const ang = rand() * Math.PI * 2;
    const spr = strength * (0.5 + rand() * 0.75);
    const ox = Math.cos(ang) * spr * 0.28;
    const oy = Math.sin(ang) * spr * 0.28;
    outX[i] = clamp01(baseX[i] + ux * spr + ox);
    outY[i] = clamp01(baseY[i] + uy * spr + oy);
  }
}

const SNITCH_BREATHE_END = 0.15;
const SCATTER1_END = 0.29;
const FORM_K_END = 0.54;
const HOLD_K_END = 0.71;
const SCATTER2_END = 0.86;
const FORM_STAGGER = 0.09;

export interface KokaParticleKProps {
  readonly hovered: boolean;
}

export function KokaParticleK({ hovered }: KokaParticleKProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef(0);
  const seedRef = useRef(90210);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const scale = Math.min(w, h);
      const pad = scale * 0.06;
      const toCanvas = (nx: number, ny: number) => [
        pad + nx * (w - 2 * pad),
        pad + ny * (h - 2 * pad),
      ];

      const snitchX = new Float32Array(N);
      const snitchY = new Float32Array(N);
      const kx = new Float32Array(N);
      const ky = new Float32Array(N);
      const initSeed = seedRef.current;
      buildSnitchTargets(snitchX, snitchY);
      buildKTargets(kx, ky, initSeed);

      const burst1X = new Float32Array(N);
      const burst1Y = new Float32Array(N);
      const burst2X = new Float32Array(N);
      const burst2Y = new Float32Array(N);

      const px = new Float32Array(N);
      const py = new Float32Array(N);
      buildBurstFrom(snitchX, snitchY, burst1X, burst1Y, initSeed, 0.11);
      buildBurstFrom(kx, ky, burst2X, burst2Y, initSeed + 777, 0.1);

      px.set(snitchX);
      py.set(snitchY);

      const t0 = performance.now();
      let prevU = -1;

      const loop = (now: number) => {
        const elapsed = now - t0;
        const u = (elapsed % CYCLE_MS) / CYCLE_MS;

        if (prevU >= 0 && u < prevU) {
          seedRef.current += 11;
          buildSnitchTargets(snitchX, snitchY);
          buildKTargets(kx, ky, seedRef.current);
          buildBurstFrom(
            snitchX,
            snitchY,
            burst1X,
            burst1Y,
            seedRef.current,
            hovered ? 0.13 : 0.11
          );
          buildBurstFrom(
            kx,
            ky,
            burst2X,
            burst2Y,
            seedRef.current + 333,
            hovered ? 0.12 : 0.1
          );
          px.set(snitchX);
          py.set(snitchY);
        }
        prevU = u;

        ctx.clearRect(0, 0, w, h);

        if (u < SNITCH_BREATHE_END) {
          const flutter = 1 + 0.004 * Math.sin(elapsed * 0.0033);
          const breathe = 1 + 0.0065 * Math.sin(elapsed * 0.00185);
          const comb = breathe * flutter;
          for (let i = 0; i < N; i++) {
            px[i] = clamp01(
              SNITCH_CX + (snitchX[i] - SNITCH_CX) * comb
            );
            py[i] = clamp01(
              SNITCH_CY + (snitchY[i] - SNITCH_CY) * comb
            );
          }
        } else if (u < SCATTER1_END) {
          const t = easeOutCubic(
            (u - SNITCH_BREATHE_END) / (SCATTER1_END - SNITCH_BREATHE_END)
          );
          for (let i = 0; i < N; i++) {
            px[i] = clamp01(snitchX[i] + (burst1X[i] - snitchX[i]) * t);
            py[i] = clamp01(snitchY[i] + (burst1Y[i] - snitchY[i]) * t);
          }
        } else if (u < FORM_K_END) {
          const span = FORM_K_END - SCATTER1_END;
          const localRaw = (u - SCATTER1_END) / span;
          for (let i = 0; i < N; i++) {
            const stagger = (i / N) * FORM_STAGGER;
            const local =
              localRaw < stagger ? 0 : (localRaw - stagger) / (1 - stagger);
            const t = easeInOutQuint(clampUnit(local));
            px[i] = clamp01(burst1X[i] + (kx[i] - burst1X[i]) * t);
            py[i] = clamp01(burst1Y[i] + (ky[i] - burst1Y[i]) * t);
          }
        } else if (u < HOLD_K_END) {
          for (let i = 0; i < N; i++) {
            px[i] = kx[i];
            py[i] = ky[i];
          }
        } else if (u < SCATTER2_END) {
          const t = easeOutCubic(
            (u - HOLD_K_END) / (SCATTER2_END - HOLD_K_END)
          );
          for (let i = 0; i < N; i++) {
            px[i] = clamp01(kx[i] + (burst2X[i] - kx[i]) * t);
            py[i] = clamp01(ky[i] + (burst2Y[i] - ky[i]) * t);
          }
        } else {
          const span = 1 - SCATTER2_END;
          const localRaw = (u - SCATTER2_END) / span;
          for (let i = 0; i < N; i++) {
            const stagger = (i / N) * FORM_STAGGER;
            const local =
              localRaw < stagger ? 0 : (localRaw - stagger) / (1 - stagger);
            const t = easeInOutQuint(clampUnit(local));
            px[i] = clamp01(burst2X[i] + (snitchX[i] - burst2X[i]) * t);
            py[i] = clamp01(burst2Y[i] + (snitchY[i] - burst2Y[i]) * t);
          }
        }

        const pulse = hovered ? 1.055 : 1;

        for (let i = 0; i < N; i++) {
          const [cx, cy] = toCanvas(px[i], py[i]);
          const hue = i % 3;
          ctx.fillStyle = hue === 0 ? THEME_A : hue === 1 ? THEME_B : THEME_C;
          ctx.globalAlpha = 0.38 + (i % 5) * 0.042;
          const r =
            (hovered ? 1.22 : 0.98) * pulse * (0.78 + (i % 7) * 0.022);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        rafRef.current = requestAnimationFrame(loop);
      };

      if (reduced) {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < N; i += 4) {
          const [cx, cy] = toCanvas(kx[i], ky[i]);
          const hue = i % 3;
          ctx.fillStyle = hue === 0 ? THEME_A : hue === 1 ? THEME_B : THEME_C;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, hovered ? 1.18 : 0.95, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [hovered, reduced]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    const size = 160;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, size, size);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ width: 40, height: 40 }}
      aria-hidden
    />
  );
}
