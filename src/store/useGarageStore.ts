import { create } from "zustand";

export type GarageFocus = "idle" | "car" | "barrel" | "board";

type GarageStore = {
  currentFocus: GarageFocus;
  focusVersion: number; // Счетчик для триггера полета
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
  focusVersion: 0,
  isManualControl: false,
  setFocus: (focus) =>
    set((state) => ({
      currentFocus: focus,
      isManualControl: false,
      focusVersion: state.focusVersion + 1,
    })),
  setManualControl: (value) => set({ isManualControl: value }),
  focusCar: () =>
    set((state) => ({
      currentFocus: "car",
      isManualControl: false,
      focusVersion: state.focusVersion + 1,
    })),
  focusBarrel: () =>
    set((state) => ({
      currentFocus: "barrel",
      isManualControl: false,
      focusVersion: state.focusVersion + 1,
    })),
  focusBoard: () =>
    set((state) => ({
      currentFocus: "board",
      isManualControl: false,
      focusVersion: state.focusVersion + 1,
    })),
  clearFocus: () =>
    set((state) => ({
      currentFocus: "idle",
      isManualControl: false,
      focusVersion: state.focusVersion + 1,
    })),
}));
