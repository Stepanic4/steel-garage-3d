"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { damp3 } from "maath/easing";
import { useMemo } from "react";
import { Vector3 } from "three";
import { useGarageStore, type GarageFocus } from "@/store/useGarageStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const CAMERA_POSITIONS: Record<GarageFocus, [number, number, number]> = {
  idle: [0, 2.2, 8],
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
  const isManualControl = useGarageStore((state) => state.isManualControl);

  const tPos = useMemo(() => new Vector3(), []);
  const tLook = useMemo(() => new Vector3(), []);

  useFrame((_state, delta) => {
    if (!controls) return;

    const orbitControls = controls as unknown as OrbitControlsImpl;

    // Интерполируем координаты, только если юзер не перехватил управление
    if (!isManualControl) {
      tPos.set(...CAMERA_POSITIONS[currentFocus]);
      tLook.set(...TARGET_POINTS[currentFocus]);

      damp3(camera.position, tPos, 0.35, delta);
      damp3(orbitControls.target, tLook, 0.35, delta);
    }

    orbitControls.update();
  });

  return null;
}
