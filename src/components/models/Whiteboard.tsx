"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useGarageStore } from "@/store/useGarageStore";
import { type ThreeElements } from "@react-three/fiber";

type WhiteboardProps = ThreeElements["group"];

const HOVER_EMISSIVE = "#d8ecff";
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

export function Whiteboard(props: WhiteboardProps) {
  // Добавлен декодер
  const { scene } = useGLTF("/model/whiteboard.glb", DRACO_URL);
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

  // Заменили useFrame на useEffect
  useEffect(() => {
    clonedScene.traverse((object) => {
      if (object instanceof Mesh) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((mat) => {
          if (mat instanceof MeshStandardMaterial) {
            mat.emissive.set(HOVER_EMISSIVE);
            mat.emissiveIntensity = hovered ? 0.22 : 0;
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
      {...props}
      onClick={focusBoard}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/model/whiteboard.glb", DRACO_URL);
