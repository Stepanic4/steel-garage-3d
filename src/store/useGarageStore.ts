import { create } from "zustand";

export type GarageFocus = "idle" | "car" | "barrel" | "board";

type GarageStore = {
  currentFocus: GarageFocus;
  isManualControl: boolean;
  setFocus: (focus: GarageFocus) => void;
  setManualControl: (value: boolean) => void;
  focusCar: () => void;
  focusBarrel: () => void;
  focusBoard: () => void;
  clearFocus: () => void;
};

export const useGarageStore = create<GarageStore>((set) => ({
  currentFocus: "idle",
  isManualControl: false,
  setFocus: (focus) => set({ currentFocus: focus, isManualControl: false }),
  setManualControl: (value) => set({ isManualControl: value }),
  focusCar: () => set({ currentFocus: "car", isManualControl: false }),
  focusBarrel: () => set({ currentFocus: "barrel", isManualControl: false }),
  focusBoard: () => set({ currentFocus: "board", isManualControl: false }),
  clearFocus: () => set({ currentFocus: "idle", isManualControl: false }),
}));
