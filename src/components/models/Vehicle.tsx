"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useGarageStore } from "@/store/useGarageStore";
import { type ThreeElements } from "@react-three/fiber";

type VehicleProps = ThreeElements["group"];

const HOVER_EMISSIVE = "#6fb9ff";

export function Vehicle(props: VehicleProps) {
  const { scene } = useGLTF("/model/vehicle.glb");
  const focusCar = useGarageStore((state) => state.focusCar);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<Group>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Инициализация теней и клонирование материалов (выполняется 1 раз)
  useEffect(() => {
    clonedScene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (Array.isArray(object.material)) {
          object.material = object.material.map((item) => item.clone());
        } else {
          object.material = object.material.clone();
        }
      }
    });
  }, [clonedScene]);

  // Обновление свечения строго по триггеру стейта
  useEffect(() => {
    clonedScene.traverse((object) => {
      if (object instanceof Mesh) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((mat) => {
          if (mat instanceof MeshStandardMaterial) {
            mat.emissive.set(HOVER_EMISSIVE);
            mat.emissiveIntensity = hovered ? 0.28 : 0;
          }
        });
      }
    });
  }, [hovered, clonedScene]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={rootRef}
      {...props}
      onClick={focusCar}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/model/vehicle.glb");
