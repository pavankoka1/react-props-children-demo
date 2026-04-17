"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  Edges,
  Environment,
  Float,
  Sparkles,
  useCursor,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { damp, sine } from "maath/easing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/** Match `oka` text: from-[#667eea] via-[#764ba2] to-[#4facfe] */
const THEME_START = "#667eea";
const THEME_MID = "#764ba2";
const THEME_END = "#4facfe";
const EDGE = "#c7d2fe";

const VERT_W = 0.078;
const VERT_H = 0.92;
const VERT_D = 0.082;
const HALF_H = VERT_H / 2;

const VERT_CENTER: [number, number, number] = [-0.2, 0, 0.03];

const REACH_X = 0.48;
const ARM_LEN = Math.sqrt(REACH_X * REACH_X + HALF_H * HALF_H);
const ARM_HALF = ARM_LEN / 2;
const ANGLE_UPPER = Math.atan2(HALF_H, REACH_X);
const ANGLE_LOWER = Math.atan2(-HALF_H, REACH_X);
const ARM_THICK = VERT_W;

/** Refined glass-metal: restrained sheen, readable at small sizes */
const physicalStem = {
  color: THEME_START,
  metalness: 0.42,
  roughness: 0.22,
  envMapIntensity: 0.78,
  clearcoat: 0.62,
  clearcoatRoughness: 0.12,
  emissive: THEME_START,
  emissiveIntensity: 0.08,
  iridescence: 0.22,
  iridescenceIOR: 1.12,
  iridescenceThicknessRange: [120, 220] as [number, number],
  sheen: 0.22,
  sheenRoughness: 0.35,
  sheenColor: "#c7d2fe",
} as const;

const physicalUpper = {
  ...physicalStem,
  color: THEME_MID,
  emissive: THEME_MID,
  emissiveIntensity: 0.09,
  sheenColor: "#ddd6fe",
} as const;

const physicalLower = {
  ...physicalStem,
  color: THEME_END,
  emissive: THEME_END,
  emissiveIntensity: 0.09,
  sheenColor: "#bae6fd",
} as const;

function EnergyRings({
  hovered,
  reduced,
}: {
  readonly hovered: boolean;
  readonly reduced: boolean;
}) {
  const aRef = useRef<THREE.Mesh>(null);
  const bRef = useRef<THREE.Mesh>(null);
  const cRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (reduced) return;
    const h = hovered ? 1 : 0.28;

    if (aRef.current) {
      aRef.current.rotation.z = t * (0.12 + h * 0.22);
      aRef.current.rotation.x = Math.PI / 2.08 + Math.sin(t * 0.45) * 0.018;
    }
    if (bRef.current) {
      bRef.current.rotation.z = -t * (0.16 + h * 0.28);
      bRef.current.rotation.x = Math.PI / 2.15;
    }
    if (cRef.current) {
      cRef.current.rotation.z = t * 0.07 + Math.sin(t * 0.65) * 0.06;
      cRef.current.rotation.x = Math.PI / 2.25;
    }
  });

  if (reduced) return null;

  return (
    <group position={[0, 0, -0.08]}>
      <mesh ref={aRef} rotation={[Math.PI / 2.05, 0, 0]}>
        <torusGeometry args={[0.62, 0.004, 6, 64]} />
        <meshBasicMaterial
          color={THEME_START}
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={bRef} rotation={[Math.PI / 2.05, 0, 0]}>
        <torusGeometry args={[0.72, 0.003, 6, 64]} />
        <meshBasicMaterial
          color={THEME_MID}
          transparent
          opacity={0.085}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={cRef} rotation={[Math.PI / 2.05, 0, 0]}>
        <torusGeometry args={[0.52, 0.0025, 6, 48]} />
        <meshBasicMaterial
          color={THEME_END}
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function KokaScene({ hovered }: { readonly hovered: boolean }) {
  const reduced = useReducedMotion();
  useCursor(hovered);

  const rootRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const matVert = useRef<THREE.MeshPhysicalMaterial>(null);
  const matUpper = useRef<THREE.MeshPhysicalMaterial>(null);
  const matLower = useRef<THREE.MeshPhysicalMaterial>(null);

  const scaleState = useRef({ value: 0.94 });
  const introProg = useRef({ v: 0 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (!reduced) {
      damp(introProg.current, "v", 1, 0.48, delta);
    } else {
      introProg.current.v = 1;
    }

    const intro = introProg.current.v;
    const easedIdle = sine.inOut(Math.sin(t * 0.55) * 0.5 + 0.5);
    const breath = 1 + (reduced ? 0 : easedIdle * 0.012);
    const hoverLift = hovered && !reduced ? 1.04 : 1;
    const targetScale = (0.94 + intro * 0.06) * breath * hoverLift;

    damp(
      scaleState.current,
      "value",
      targetScale,
      reduced ? 0.01 : 0.28,
      delta
    );
    if (rootRef.current) {
      rootRef.current.scale.setScalar(scaleState.current.value);
    }

    if (reduced) return;

    const phase = t * 0.85;
    const breatheEmissive =
      0.07 +
      sine.inOut(Math.sin(phase) * 0.5 + 0.5) * (0.035 + (hovered ? 0.03 : 0));

    const mVert = matVert.current;
    if (mVert) {
      mVert.emissiveIntensity = THREE.MathUtils.lerp(
        mVert.emissiveIntensity,
        breatheEmissive,
        0.08
      );
      mVert.iridescence = THREE.MathUtils.lerp(
        mVert.iridescence,
        0.2 + Math.sin(t * 0.45) * 0.04,
        0.06
      );
    }

    const upperPhase = t * 0.5 + 0.35;
    const lowerPhase = t * 0.5 + 0.7;
    const mU = matUpper.current;
    if (mU) {
      mU.emissiveIntensity = THREE.MathUtils.lerp(
        mU.emissiveIntensity,
        0.08 +
          sine.inOut(Math.sin(upperPhase) * 0.5 + 0.5) *
            (0.03 + (hovered ? 0.025 : 0)),
        0.08
      );
      mU.iridescence = THREE.MathUtils.lerp(
        mU.iridescence,
        0.2 + Math.sin(upperPhase * 0.8) * 0.04,
        0.05
      );
    }
    const mL = matLower.current;
    if (mL) {
      mL.emissiveIntensity = THREE.MathUtils.lerp(
        mL.emissiveIntensity,
        0.08 +
          sine.inOut(Math.sin(lowerPhase) * 0.5 + 0.5) *
            (0.03 + (hovered ? 0.025 : 0)),
        0.08
      );
      mL.iridescence = THREE.MathUtils.lerp(
        mL.iridescence,
        0.2 + Math.sin(lowerPhase * 0.8) * 0.04,
        0.05
      );
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.z = t * 0.1;
    }

    if (rimRef.current) {
      rimRef.current.position.x = 1.05 + Math.sin(t * 0.4) * 0.18;
      rimRef.current.position.y = 0.55 + Math.cos(t * 0.35) * 0.12;
      rimRef.current.intensity =
        0.32 + Math.sin(t * 0.7) * 0.06 + (hovered ? 0.1 : 0);
    }

    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(t * 0.18) * 0.018;
    }
  });

  const edgeProps = {
    threshold: 18,
    color: EDGE,
    transparent: true,
    opacity: 0.32,
    scale: 1.008,
  } as const;

  return (
    <group ref={rootRef}>
      <EnergyRings hovered={hovered} reduced={reduced} />

      <pointLight ref={rimRef} position={[1.15, 0.75, 1.65]} color="#f1f5f9" />
      <pointLight
        position={[-1.05, -0.55, 1.15]}
        intensity={0.36}
        color="#a5c4ff"
      />
      <directionalLight
        position={[2.4, 2.8, 1.9]}
        intensity={0.42}
        color="#f8fafc"
      />
      <ambientLight intensity={0.48} color="#e8edf5" />

      <mesh
        ref={orbitRef}
        rotation={[Math.PI / 2.05, 0, 0]}
        position={[0, 0, -0.12]}
      >
        <torusGeometry args={[0.68, 0.005, 8, 48]} />
        <meshBasicMaterial
          color={THEME_MID}
          transparent
          opacity={0.065}
          depthWrite={false}
        />
      </mesh>

      <mesh position={VERT_CENTER}>
        <boxGeometry args={[VERT_W, VERT_H, VERT_D]} />
        <meshPhysicalMaterial ref={matVert} {...physicalStem} />
        <Edges {...edgeProps} />
      </mesh>

      <group position={VERT_CENTER}>
        <group rotation={[0, 0, ANGLE_UPPER]}>
          <mesh position={[ARM_HALF, 0, 0]}>
            <boxGeometry args={[ARM_LEN, ARM_THICK, VERT_D]} />
            <meshPhysicalMaterial ref={matUpper} {...physicalUpper} />
            <Edges {...edgeProps} />
          </mesh>
        </group>
        <group rotation={[0, 0, ANGLE_LOWER]}>
          <mesh position={[ARM_HALF, 0, 0]}>
            <boxGeometry args={[ARM_LEN, ARM_THICK, VERT_D]} />
            <meshPhysicalMaterial ref={matLower} {...physicalLower} />
            <Edges {...edgeProps} />
          </mesh>
        </group>
      </group>

      {!reduced && (
        <Sparkles
          count={hovered ? 14 : 8}
          position={[0, 0, 0.18]}
          scale={hovered ? 1.08 : 0.98}
          size={hovered ? 1.35 : 1.1}
          speed={hovered ? 0.22 : 0.12}
          opacity={hovered ? 0.09 : 0.045}
          color="#e2e8f0"
        />
      )}
    </group>
  );
}

function Env() {
  return (
    <Environment
      preset="city"
      resolution={128}
      environmentIntensity={0.46}
      background={false}
    />
  );
}

function PostFX({ hovered }: { readonly hovered: boolean }) {
  const reduced = useReducedMotion();
  const chroma = useMemo(
    () =>
      new THREE.Vector2(
        reduced ? 0.00015 : hovered ? 0.00055 : 0.00028,
        reduced ? 0.00015 : hovered ? 0.00055 : 0.00028
      ),
    [hovered, reduced]
  );

  if (reduced) return null;

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.12}
        luminanceSmoothing={0.45}
        intensity={hovered ? 0.42 : 0.26}
        radius={0.42}
        mipmapBlur
      />
      <ChromaticAberration offset={chroma} />
      <Vignette eskil={false} offset={0.08} darkness={0.28} />
    </EffectComposer>
  );
}

export interface KokaMark3DProps {
  readonly hovered: boolean;
}

export function KokaMark3D({ hovered }: KokaMark3DProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative h-10 w-10 shrink-0 cursor-pointer select-none [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 1.88], fov: 39 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        style={{ touchAction: "none" }}
      >
        <Suspense fallback={null}>
          <Env />
        </Suspense>
        {reduced ? (
          <KokaScene hovered={false} />
        ) : (
          <Float
            speed={hovered ? 0.45 : 0.65}
            rotationIntensity={hovered ? 0.035 : 0.055}
            floatIntensity={hovered ? 0.04 : 0.06}
            floatingRange={[-0.012, 0.012]}
          >
            <KokaScene hovered={hovered} />
          </Float>
        )}
        <PostFX hovered={hovered} />
      </Canvas>
    </div>
  );
}
