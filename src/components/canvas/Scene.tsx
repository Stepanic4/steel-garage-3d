"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  CameraControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { Garage } from "./Garage";
import { CameraHandler } from "./CameraHandler";
import { useGarageStore } from "@/store/useGarageStore";

export function Scene() {
  // Инициализируем без блокировки рендера
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Проверяем сразу на клиенте
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: isMobile ? [0, 2.4, 10] : [0, 2.2, 8], fov: 42 }}
        // Жестко отключаем сглаживание на мобилках для спасения WebGL контекста
        gl={{ antialias: !isMobile, toneMapping: ACESFilmicToneMapping }}
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
            castShadow={!isMobile}
          />

          {isMobile ? (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[60, 60]} />
              <meshStandardMaterial color="#080808" roughness={1} />
            </mesh>
          ) : (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[60, 60]} />
              <MeshReflectorMaterial
                mirror={0.8}
                blur={[400, 100]}
                resolution={512}
                mixBlur={10}
                mixStrength={40}
                roughness={0.4}
                depthScale={1}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.2}
                color="#080808"
                metalness={0.5}
              />
            </mesh>
          )}

          {!isMobile && (
            <ContactShadows opacity={0.6} scale={15} blur={2.4} far={4} />
          )}

          <Garage />
          <CameraHandler />

          <CameraControls
            makeDefault
            maxPolarAngle={Math.PI / 2.1}
            minDistance={4}
            maxDistance={15}
            onStart={() => useGarageStore.getState().setManualControl(true)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
