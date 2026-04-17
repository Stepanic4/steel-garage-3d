import { Scene } from "@/components/canvas/Scene";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-sky-950">
      <Scene />
      <h1 className="pointer-events-none fixed top-5 left-5 z-10 text-white text-[10px] font-mono uppercase tracking-widest opacity-50">
        SteelCode Studio // 3D Garage Case // 2026
      </h1>
    </main>
  );
}
