import { Scene } from "@/components/canvas/Scene";
import { Loader } from "@/components/ui/Loader";

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-sky-950">
      {/* Глобальный лоадер перекрывает всё */}
      <Loader />

      <Scene />

      <h1 className="pointer-events-none absolute left-5 top-5 z-10 text-[10px] font-mono text-white tracking-widest opacity-50 uppercase">
        SteelCode Studio // 3D Garage Case // 2026
      </h1>
    </main>
  );
}
