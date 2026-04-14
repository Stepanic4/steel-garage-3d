# SteelCode Studio // 3D Garage Case 🛠️

An interactive 3D demonstration of a high-tech detailing center for SteelCode.cz.

## 🔋 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **3D Engine:** Three.js / React Three Fiber (@react-three/fiber)
- **Helpers:** @react-three/drei
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **State Management:** Zustand

## 🎯 Project Goals

1. **High Performance:** Delivering a smooth 3D experience with adaptive FOV for mobile devices.
2. **Interactive Board-System:** A dual-sided interactive whiteboard featuring technical engine schemas and a dynamic price list (via HTML-over-Canvas).
3. **Advanced Optimization:** Implementation of ContactShadows, 1K textures, and Draco compression for fast loading.

## 🏗️ Architecture

- `/src/components/canvas` — Core 3D components (BMW M3 E30, Scene setup, Lighting).
- `/src/components/ui` — Interactive overlays, menus, and HUD.
- `/public/models` — Optimized 3D assets (.glb).

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```
