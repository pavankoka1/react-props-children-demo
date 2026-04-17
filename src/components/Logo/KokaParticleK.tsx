"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useCallback, useEffect, useRef } from "react";

const N = 1000;
const CYCLE_MS = 12000;

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

/** Softer, more deliberate than cubic — reads “premium” on morphs. */
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

/** Graceful release instead of snappy expo on scatters. */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Outer silhouette traced from the reference PNG (OpenCV contour + simplify), normalized
 * into [M, 1-M]² to match clamp01() used elsewhere.
 */
const QUEEN_POLY: readonly [number, number][] = [
  [0.32125, 0.072222],
  [0.290694, 0.099722],
  [0.272361, 0.1425],
  [0.272361, 0.179167],
  [0.281528, 0.206667],
  [0.290694, 0.221944],
  [0.327361, 0.2525],
  [0.324306, 0.353333],
  [0.32125, 0.356389],
  [0.32125, 0.426667],
  [0.318194, 0.429722],
  [0.302917, 0.429722],
  [0.254028, 0.377778],
  [0.254028, 0.365556],
  [0.260139, 0.353333],
  [0.260139, 0.310556],
  [0.241806, 0.273889],
  [0.223472, 0.255556],
  [0.205139, 0.243333],
  [0.177639, 0.234167],
  [0.147083, 0.234167],
  [0.110417, 0.249444],
  [0.10125, 0.255556],
  [0.079861, 0.28],
  [0.070694, 0.298333],
  [0.067639, 0.319722],
  [0.064583, 0.322778],
  [0.067639, 0.359444],
  [0.085972, 0.393056],
  [0.095139, 0.405278],
  [0.107361, 0.414444],
  [0.116528, 0.4175],
  [0.122639, 0.423611],
  [0.137917, 0.426667],
  [0.144028, 0.435833],
  [0.144028, 0.441944],
  [0.150139, 0.448056],
  [0.153194, 0.463333],
  [0.174583, 0.509167],
  [0.177639, 0.524444],
  [0.186806, 0.536667],
  [0.186806, 0.545833],
  [0.195972, 0.561111],
  [0.195972, 0.567222],
  [0.202083, 0.573333],
  [0.205139, 0.588611],
  [0.223472, 0.625278],
  [0.23875, 0.671111],
  [0.260139, 0.713889],
  [0.260139, 0.723056],
  [0.26625, 0.729167],
  [0.26625, 0.744444],
  [0.260139, 0.750556],
  [0.244861, 0.753611],
  [0.214306, 0.771944],
  [0.202083, 0.784167],
  [0.186806, 0.808611],
  [0.186806, 0.817778],
  [0.177639, 0.845278],
  [0.177639, 0.936944],
  [0.180694, 0.94],
  [0.822361, 0.94],
  [0.822361, 0.845278],
  [0.819306, 0.842222],
  [0.819306, 0.826944],
  [0.813194, 0.808611],
  [0.800972, 0.787222],
  [0.782639, 0.768889],
  [0.758194, 0.753611],
  [0.736806, 0.7475],
  [0.73375, 0.744444],
  [0.73375, 0.732222],
  [0.749028, 0.698611],
  [0.749028, 0.6925],
  [0.755139, 0.686389],
  [0.758194, 0.671111],
  [0.767361, 0.655833],
  [0.767361, 0.646667],
  [0.776528, 0.634444],
  [0.776528, 0.628333],
  [0.797917, 0.5825],
  [0.800972, 0.567222],
  [0.807083, 0.561111],
  [0.819306, 0.524444],
  [0.831528, 0.503056],
  [0.831528, 0.493889],
  [0.84375, 0.4725],
  [0.84375, 0.466389],
  [0.859028, 0.432778],
  [0.865139, 0.426667],
  [0.883472, 0.420556],
  [0.907917, 0.402222],
  [0.92625, 0.374722],
  [0.932361, 0.356389],
  [0.932361, 0.344167],
  [0.935417, 0.341111],
  [0.935417, 0.319722],
  [0.923194, 0.283056],
  [0.917083, 0.28],
  [0.914028, 0.270833],
  [0.89875, 0.255556],
  [0.87125, 0.240278],
  [0.852917, 0.234167],
  [0.819306, 0.234167],
  [0.785694, 0.249444],
  [0.758194, 0.273889],
  [0.742917, 0.304444],
  [0.742917, 0.313611],
  [0.739861, 0.316667],
  [0.739861, 0.344167],
  [0.745972, 0.3625],
  [0.745972, 0.377778],
  [0.697083, 0.429722],
  [0.684861, 0.429722],
  [0.681806, 0.426667],
  [0.681806, 0.393056],
  [0.67875, 0.39],
  [0.67875, 0.356389],
  [0.675694, 0.353333],
  [0.672639, 0.2525],
  [0.70625, 0.225],
  [0.721528, 0.200556],
  [0.724583, 0.182222],
  [0.727639, 0.179167],
  [0.727639, 0.1425],
  [0.724583, 0.139444],
  [0.724583, 0.127222],
  [0.70625, 0.096667],
  [0.67875, 0.072222],
  [0.648194, 0.06],
  [0.602361, 0.06],
  [0.584028, 0.066111],
  [0.559583, 0.081389],
  [0.54125, 0.102778],
  [0.529028, 0.124167],
  [0.525972, 0.1425],
  [0.522917, 0.145556],
  [0.522917, 0.17],
  [0.535139, 0.209722],
  [0.550417, 0.228056],
  [0.550417, 0.246389],
  [0.54125, 0.273889],
  [0.535139, 0.283056],
  [0.535139, 0.292222],
  [0.525972, 0.310556],
  [0.519861, 0.335],
  [0.51375, 0.344167],
  [0.510694, 0.3625],
  [0.507639, 0.365556],
  [0.495417, 0.365556],
  [0.489306, 0.359444],
  [0.480139, 0.325833],
  [0.474028, 0.316667],
  [0.45875, 0.270833],
  [0.45875, 0.261667],
  [0.452639, 0.255556],
  [0.449583, 0.246389],
  [0.449583, 0.228056],
  [0.467917, 0.203611],
  [0.474028, 0.188333],
  [0.474028, 0.176111],
  [0.477083, 0.173056],
  [0.474028, 0.136389],
  [0.45875, 0.099722],
  [0.43125, 0.075278],
  [0.422083, 0.072222],
  [0.415972, 0.066111],
  [0.397639, 0.063056],
  [0.394583, 0.06],
  [0.354861, 0.06],
  [0.351806, 0.063056],
  [0.339583, 0.063056],
  [0.327361, 0.072222],
];

const QUEEN_CX = QUEEN_POLY.reduce((s, p) => s + p[0], 0) / QUEEN_POLY.length;
const QUEEN_CY = QUEEN_POLY.reduce((s, p) => s + p[1], 0) / QUEEN_POLY.length;

type CrownSeg = { type: "line"; a: [number, number]; b: [number, number] };

function crownSegLength(s: CrownSeg): number {
  const dx = s.b[0] - s.a[0];
  const dy = s.b[1] - s.a[1];
  return Math.hypot(dx, dy);
}

/** Point at fraction u ∈ [0,1] along segment; outward-ish normal for jitter (perpendicular). */
function crownPointAndNormal(
  s: CrownSeg,
  u: number
): { x: number; y: number; nx: number; ny: number; len: number } {
  const dx = s.b[0] - s.a[0];
  const dy = s.b[1] - s.a[1];
  const len = Math.hypot(dx, dy) || 0.001;
  const x = s.a[0] + dx * u;
  const y = s.a[1] + dy * u;
  return { x, y, nx: -dy / len, ny: dx / len, len };
}

function buildChessQueenPath(): CrownSeg[] {
  const n = QUEEN_POLY.length;
  const segs: CrownSeg[] = [];
  for (let i = 0; i < n; i++) {
    const a = QUEEN_POLY[i]!;
    const b = QUEEN_POLY[(i + 1) % n]!;
    segs.push({ type: "line", a: [a[0], a[1]], b: [b[0], b[1]] });
  }
  return segs;
}

/** Evenly sample N points along closed queen silhouette + thickness jitter */
function buildCrownTargets(outX: Float32Array, outY: Float32Array) {
  const segs = buildChessQueenPath();
  const lens = segs.map(crownSegLength);
  const total = lens.reduce((a, b) => a + b, 0);

  const thick = 0.014;
  const rand = mulberry32(4242);
  for (let i = 0; i < N; i++) {
    let d = (i / N) * total;
    let si = 0;
    while (d > lens[si]! && si < segs.length - 1) {
      d -= lens[si]!;
      si++;
    }
    const seg = segs[si]!;
    const L = lens[si]! || 0.001;
    const u = Math.min(1, d / L);
    const { x, y, nx, ny } = crownPointAndNormal(seg, u);
    const j = (rand() - 0.5) * thick;
    const px = x + nx * j + (rand() - 0.5) * 0.004;
    const py = y + ny * j + (rand() - 0.5) * 0.004;
    outX[i] = clamp01(px);
    outY[i] = clamp01(py);
  }
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

function buildKTargets(outX: Float32Array, outY: Float32Array, seed: number) {
  const stem = 420;
  const upper = 290;
  const lower = 290;
  let k = 0;
  const thick = 0.034;
  const stemX = 0.3;
  const rand = mulberry32(seed);

  for (let i = 0; i < stem && k < N; i++) {
    const t = i / stem;
    const y = 0.16 + t * 0.68;
    outX[k] = stemX + (rand() - 0.5) * thick;
    outY[k] = y + (rand() - 0.5) * thick * 0.55;
    k++;
  }
  const ux0 = stemX,
    uy0 = 0.4,
    ux1 = 0.76,
    uy1 = 0.84;
  for (let i = 0; i < upper && k < N; i++) {
    const t = (i + rand()) / upper;
    outX[k] = ux0 + (ux1 - ux0) * t + (rand() - 0.5) * thick;
    outY[k] = uy0 + (uy1 - uy0) * t + (rand() - 0.5) * thick;
    k++;
  }
  const lx0 = stemX,
    ly0 = 0.52,
    lx1 = 0.76,
    ly1 = 0.16;
  for (let i = 0; i < lower && k < N; i++) {
    const t = (i + rand()) / lower;
    outX[k] = lx0 + (lx1 - lx0) * t + (rand() - 0.5) * thick;
    outY[k] = ly0 + (ly1 - ly0) * t + (rand() - 0.5) * thick;
    k++;
  }
  while (k < N) {
    outX[k] = stemX + (rand() - 0.5) * thick;
    outY[k] = 0.5 + (rand() - 0.5) * 0.38;
    k++;
  }
}

/** Radial burst targets from a shape (for scatter phases) */
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

const CROWN_END = 0.15;
const SCATTER1_END = 0.29;
const FORM_K_END = 0.54;
const HOLD_K_END = 0.71;
const SCATTER2_END = 0.86;
/** Soft wave so formation doesn’t snap all at once (0…1 index). */
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

      const crownX = new Float32Array(N);
      const crownY = new Float32Array(N);
      const kx = new Float32Array(N);
      const ky = new Float32Array(N);
      const initSeed = seedRef.current;
      buildCrownTargets(crownX, crownY);
      buildKTargets(kx, ky, initSeed);

      const burst1X = new Float32Array(N);
      const burst1Y = new Float32Array(N);
      const burst2X = new Float32Array(N);
      const burst2Y = new Float32Array(N);

      const px = new Float32Array(N);
      const py = new Float32Array(N);
      buildBurstFrom(crownX, crownY, burst1X, burst1Y, initSeed, 0.11);
      buildBurstFrom(kx, ky, burst2X, burst2Y, initSeed + 777, 0.1);

      px.set(crownX);
      py.set(crownY);

      const t0 = performance.now();
      let prevU = -1;

      const loop = (now: number) => {
        const elapsed = now - t0;
        const u = (elapsed % CYCLE_MS) / CYCLE_MS;

        if (prevU >= 0 && u < prevU) {
          seedRef.current += 11;
          buildCrownTargets(crownX, crownY);
          buildKTargets(kx, ky, seedRef.current);
          buildBurstFrom(
            crownX,
            crownY,
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
          px.set(crownX);
          py.set(crownY);
        }
        prevU = u;

        ctx.clearRect(0, 0, w, h);

        if (u < CROWN_END) {
          const breathe = 1 + 0.0065 * Math.sin(elapsed * 0.00185);
          for (let i = 0; i < N; i++) {
            px[i] = clamp01(QUEEN_CX + (crownX[i] - QUEEN_CX) * breathe);
            py[i] = clamp01(QUEEN_CY + (crownY[i] - QUEEN_CY) * breathe);
          }
        } else if (u < SCATTER1_END) {
          const t = easeOutCubic((u - CROWN_END) / (SCATTER1_END - CROWN_END));
          for (let i = 0; i < N; i++) {
            px[i] = clamp01(crownX[i] + (burst1X[i] - crownX[i]) * t);
            py[i] = clamp01(crownY[i] + (burst1Y[i] - crownY[i]) * t);
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
            px[i] = clamp01(burst2X[i] + (crownX[i] - burst2X[i]) * t);
            py[i] = clamp01(burst2Y[i] + (crownY[i] - burst2Y[i]) * t);
          }
        }

        const pulse = hovered ? 1.055 : 1;

        for (let i = 0; i < N; i++) {
          const [cx, cy] = toCanvas(px[i], py[i]);
          const hue = i % 3;
          ctx.fillStyle = hue === 0 ? THEME_A : hue === 1 ? THEME_B : THEME_C;
          ctx.globalAlpha = 0.38 + (i % 5) * 0.042;
          const r = (hovered ? 1.22 : 0.98) * pulse * (0.78 + (i % 7) * 0.022);
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
          ctx.fillStyle = THEME_A;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, hovered ? 1.18 : 0.95, 0, Math.PI * 2);
          ctx.fill();
        }
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
