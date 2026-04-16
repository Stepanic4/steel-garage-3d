"use client";

import { OilBarrel } from "@/components/models/OilBarrel";
import { Vehicle } from "@/components/models/Vehicle";
import { Whiteboard } from "@/components/models/Whiteboard";

export function Garage() {
  return (
    <group>
      <Vehicle position={[0, 0, 0]} />
      <OilBarrel position={[4, 0, -2]} scale={0.78} />
      <Whiteboard position={[-4, 0, -2]} scale={0.62} />
    </group>
  );
}
