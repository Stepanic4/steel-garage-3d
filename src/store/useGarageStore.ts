import { create } from "zustand";

export type GarageFocus = "idle" | "car" | "barrel" | "board";

type GarageStore = {
  currentFocus: GarageFocus;
  isOrbitInteracting: boolean;
  setFocus: (focus: GarageFocus) => void;
  setOrbitInteracting: (value: boolean) => void;
  focusCar: () => void;
  focusBarrel: () => void;
  focusBoard: () => void;
  clearFocus: () => void;
};

export const useGarageStore = create<GarageStore>((set) => ({
  currentFocus: "idle",
  isOrbitInteracting: false,
  setFocus: (focus) => set({ currentFocus: focus }),
  setOrbitInteracting: (value) => set({ isOrbitInteracting: value }),
  focusCar: () => set({ currentFocus: "car" }),
  focusBarrel: () => set({ currentFocus: "barrel" }),
  focusBoard: () => set({ currentFocus: "board" }),
  clearFocus: () => set({ currentFocus: "idle" }),
}));
