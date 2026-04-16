"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Material, Mesh, MeshStandardMaterial } from "three";
import { useGarageStore } from "@/store/useGarageStore";

type WhiteboardProps = ThreeElements["group"];

const HOVER_EMISSIVE = "#d8ecff";

function applyHoverMaterial(material: Material, hovered: boolean) {
  if (material instanceof MeshStandardMaterial) {
    material.emissive.set(HOVER_EMISSIVE);
    material.emissiveIntensity = hovered ? 0.22 : 0;
  }
}

export function Whiteboard(props: WhiteboardProps) {
  const { scene } = useGLTF("/model/whiteboard.glb");
  const focusBoard = useGarageStore((state) => state.focusBoard);
  const [hovered, setHovered] = useState(false);
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
      {...props}
      onClick={focusBoard}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/model/whiteboard.glb");
