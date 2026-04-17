"use client";

import { useProgress } from "@react-three/drei";
import { useState, useEffect } from "react";

export function Loader() {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Ждем 100%, затем даем паузу на компиляцию шейдеров
    if (progress === 100) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-sky-950 text-white">
      <div className="flex w-64 flex-col items-center gap-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400 opacity-80">
          Mounting Assets // {Math.round(progress)}%
        </div>
        <div className="h-0.5 w-full overflow-hidden bg-gray-900">
          {/* Убран класс transition, ширина меняется моментально */}
          <div
            className="h-full bg-sky-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
