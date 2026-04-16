"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Material, Mesh, MeshStandardMaterial } from "three";
import { useGarageStore } from "@/store/useGarageStore";

type VehicleProps = ThreeElements["group"];

const HOVER_EMISSIVE = "#6fb9ff";

function applyHoverMaterial(material: Material, hovered: boolean) {
  if (material instanceof MeshStandardMaterial) {
    material.emissive.set(HOVER_EMISSIVE);
    material.emissiveIntensity = hovered ? 0.28 : 0;
  }
}

export function Vehicle(props: VehicleProps) {
  const { scene } = useGLTF("/model/vehicle.glb");
  const focusCar = useGarageStore((state) => state.focusCar);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<Group>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

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

  useFrame(() => {
    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => applyHoverMaterial(mat, hovered));
        return;
      }
      applyHoverMaterial(object.material, hovered);
    });
  });

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
