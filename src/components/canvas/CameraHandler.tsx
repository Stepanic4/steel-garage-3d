"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { damp3 } from "maath/easing";
import { useMemo } from "react";
import { Vector3 } from "three";
import { useGarageStore, type GarageFocus } from "@/store/useGarageStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const CAMERA_POSITIONS: Record<GarageFocus, [number, number, number]> = {
  // Теперь idle совпадает с начальным положением камеры в Scene.tsx
  idle: [0, 2.2, 8],
  // Чуть дальше, чтобы не "врезаться" в капот
  car: [0, 1.5, 7.5],
  barrel: [5, 1.8, 5],
  board: [-5, 1.8, 5],
};

const TARGET_POINTS: Record<GarageFocus, [number, number, number]> = {
  idle: [0, 0.5, 0],
  car: [0, 0.8, 0],
  barrel: [4, 0.8, -1.5],
  board: [-4, 0.8, -1.5],
};

export function CameraHandler() {
  const { camera, controls } = useThree();
  const currentFocus = useGarageStore((state) => state.currentFocus);
  const isOrbitInteracting = useGarageStore(
    (state) => state.isOrbitInteracting,
  );

  const tPos = useMemo(() => new Vector3(), []);
  const tLook = useMemo(() => new Vector3(), []);

  useFrame((_state, delta) => {
    if (!controls) return;

    const orbiControls = controls as unknown as OrbitControlsImpl;

    if (!isOrbitInteracting) {
      tPos.set(...CAMERA_POSITIONS[currentFocus]);
      tLook.set(...TARGET_POINTS[currentFocus]);

      // Двигаем позицию и цель. 0.35 — оптимальный баланс плавности.
      damp3(camera.position, tPos, 0.35, delta);
      damp3(orbiControls.target, tLook, 0.35, delta);
    }

    // Вызываем всегда для гладкости OrbitControls
    orbiControls.update();
  });

  return null;
}
