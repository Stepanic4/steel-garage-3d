"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGarageStore, type GarageFocus } from "@/store/useGarageStore";

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

type ControlsWithLookAt = {
  setLookAt: (
    px: number,
    py: number,
    pz: number,
    tx: number,
    ty: number,
    tz: number,
    transition: boolean,
  ) => Promise<void>;
  normalizeRotations: () => void;
};

export function CameraHandler() {
  const controls = useThree(
    (state) => state.controls as unknown as ControlsWithLookAt,
  );
  const currentFocus = useGarageStore((state) => state.currentFocus);
  const focusVersion = useGarageStore((state) => state.focusVersion);

  const isInit = useRef(true);

  useEffect(() => {
    if (!controls || typeof controls.setLookAt !== "function") return;

    // Сброс оборотов перед полетом
    if (typeof controls.normalizeRotations === "function") {
      controls.normalizeRotations();
    }

    const pos = CAMERA_POSITIONS[currentFocus];
    const tgt = TARGET_POINTS[currentFocus];

    const enableTransition = !isInit.current;

    controls.setLookAt(
      pos[0],
      pos[1],
      pos[2],
      tgt[0],
      tgt[1],
      tgt[2],
      enableTransition,
    );

    if (isInit.current) {
      isInit.current = false;
    }
  }, [focusVersion, controls]); // Слушаем версию клика

  return null;
}
