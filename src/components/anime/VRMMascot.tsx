import { useRef, useEffect, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";
import { useAppStore } from "../../store/appStore";

interface VRMMascotProps {
  streakDays: number;
  visible: boolean;
}

/** Map streak days → VRM expression preset name */
function getTargetExpression(days: number): string {
  if (days >= 90) return "surprised";
  if (days >= 30) return "relaxed";
  if (days >= 7) return "happy";
  if (days >= 1) return "neutral";
  return "neutral";
}

/** Streak-to-expression label for the badge overlay */
function getExpressionLabel(days: number): string {
  if (days >= 90) return "Legendary";
  if (days >= 30) return "Proud";
  if (days >= 14) return "Confident";
  if (days >= 7) return "Happy";
  if (days >= 3) return "Encouraged";
  if (days >= 1) return "Hopeful";
  return "Neutral";
}

// ─── Inner Three.js scene component ──────────────────────────────────────────

interface VRMModelProps {
  url: string;
  streakDays: number;
}

function VRMModel({ url, streakDays }: VRMModelProps) {
  const vrmRef = useRef<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const blinkTimer = useRef(0);
  const { scene } = useThree();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM | undefined;
        if (!vrm) return;

        // Clean up previous model
        if (vrmRef.current) {
          scene.remove(vrmRef.current.scene);
        }

        vrmRef.current = vrm;

        // Rotate to face camera (VRM models face +Z by default)
        vrm.scene.rotation.y = Math.PI;

        // Position the model so head+shoulders are in view
        vrm.scene.position.set(0, -0.65, 0);

        scene.add(vrm.scene);

        // Create animation mixer for future use
        mixerRef.current = new THREE.AnimationMixer(vrm.scene);
      },
      undefined,
      (error) => {
        console.warn("VRM load error:", error);
      }
    );

    return () => {
      if (vrmRef.current) {
        scene.remove(vrmRef.current.scene);
        vrmRef.current = null;
      }
    };
  }, [url, scene]);

  useFrame((_, delta) => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    // ── Breathing / idle bob ──
    const time = performance.now() / 1000;
    vrm.scene.position.y = -0.65 + Math.sin(time * 0.8) * 0.01;

    // ── Expression based on streak ──
    const target = getTargetExpression(streakDays);
    if (vrm.expressionManager) {
      // Reset all standard expressions first
      for (const name of ["happy", "angry", "sad", "relaxed", "surprised", "neutral"]) {
        vrm.expressionManager.setValue(name, 0);
      }
      vrm.expressionManager.setValue(target, 1.0);
    }

    // ── Random blink every 3-6 seconds ──
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      // Start a blink
      if (vrm.expressionManager) {
        vrm.expressionManager.setValue("blink", 1.0);
        // Schedule unblink
        setTimeout(() => {
          if (vrmRef.current?.expressionManager) {
            vrmRef.current.expressionManager.setValue("blink", 0);
          }
        }, 150);
      }
      blinkTimer.current = 3 + Math.random() * 3; // 3-6 seconds
    }

    // Update VRM
    vrm.update(delta);

    // Update mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return null; // Model is added to scene directly
}

// ─── Loading fallback ────────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#f472b6" wireframe />
    </mesh>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function VRMMascot({ streakDays, visible }: VRMMascotProps) {
  const mascotGender = useAppStore((s) => s.mascotGender);
  const [hasError, setHasError] = useState(false);

  const modelUrl =
    mascotGender === "girl" ? "/models/girl.vrm" : "/models/boy.vrm";

  const expression = getExpressionLabel(streakDays);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (!visible) return null;

  // Fallback placeholder if 3D loading fails
  if (hasError) {
    const emoji = mascotGender === "girl" ? "\uD83D\uDC67" : "\uD83D\uDC66";
    return (
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl select-none"
        style={{
          width: 200,
          height: 300,
          background: "linear-gradient(135deg, #8b5cf6 0%, #f472b6 100%)",
        }}
      >
        <span
          className="text-[80px] leading-none"
          style={{ animation: "mascotFloat 3s ease-in-out infinite" }}
        >
          {emoji}
        </span>
        <span
          className="mt-3 rounded-full px-3 py-0.5 font-anime text-xs font-medium"
          style={{ backgroundColor: "rgba(254,243,199,0.2)", color: "#fef3c7" }}
        >
          {expression}
        </span>
        <style>{`
          @keyframes mascotFloat {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: 200, height: 300 }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.3, 1.8], fov: 25 }}
        style={{ borderRadius: 12 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
        onError={handleError}
      >
        {/* Lighting for anime cel-shade look */}
        <ambientLight intensity={0.7} color="#ffffff" />
        <directionalLight position={[2, 3, 2]} intensity={0.9} />
        <hemisphereLight
          color="#fef3c7"
          groundColor="#0d0015"
          intensity={0.4}
        />

        <Suspense fallback={<LoadingFallback />}>
          <VRMModel url={modelUrl} streakDays={streakDays} />
        </Suspense>
      </Canvas>

      {/* Expression badge overlay */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span
          className="rounded-full px-3 py-0.5 font-anime text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.5)",
            color: "#fef3c7",
          }}
        >
          {expression}
        </span>
      </div>
    </div>
  );
}
