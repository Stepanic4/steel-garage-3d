"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { useGarageStore } from "@/store/useGarageStore";
import { Garage } from "./Garage";
import { CameraHandler } from "./CameraHandler";

export function Scene() {
  const setManualControl = useGarageStore((state) => state.setManualControl);

  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mediaQuery = window.matchMedia("(max-width: 767px)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );

  return (
    <div className="absolute inset-0 w-full h-full bg-sky-950">
      <Canvas
        shadows
        // На мобилках строго dpr 1, иначе OOM краш
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: isMobile ? [0, 2.4, 10] : [0, 2.2, 8], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 5, 20]} />

          <Environment preset="city" />
          <ambientLight intensity={0.4} />

          <rectAreaLight
            intensity={20}
            width={10}
            height={10}
            position={[0, 7, 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="#ffffff"
          />

          <spotLight
            position={[0, 5, 12]}
            angle={0.5}
            penumbra={1}
            intensity={100}
            color="#ffffff"
            castShadow
          />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[60, 60]} />
            <MeshReflectorMaterial
              mirror={isMobile ? 0.4 : 0.8}
              blur={isMobile ? [100, 50] : [400, 100]}
              resolution={isMobile ? 128 : 512}
              mixBlur={isMobile ? 2 : 10}
              mixStrength={isMobile ? 10 : 40}
              roughness={0.4}
              depthScale={1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.2}
              color="#080808"
              metalness={0.5}
            />
          </mesh>

          {/* frames={1} запекает тени на мобилках в первый кадр, снимая нагрузку в цикле */}
          <ContactShadows
            opacity={0.6}
            scale={15}
            blur={isMobile ? 1 : 2.4}
            far={4}
            frames={isMobile ? 1 : Infinity}
          />

          <Garage />
          <CameraHandler />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={4}
            maxDistance={15}
            target={[0, 0.5, 0]} // Жесткая фиксация стартового таргета
            onStart={() => setManualControl(true)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
