import { create } from 'zustand';

interface SettingsStore {
  idleMinutes: number;
  idleSeconds: number;
  isSettingsTabActive: boolean;
  setIdleMinutes: (minutes: number) => void;
  setIdleSeconds: (seconds: number) => void;
  setSettingsTabActive: (active: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  idleMinutes: 0,
  idleSeconds: 10,
  isSettingsTabActive: false,
  setIdleMinutes: (minutes: number) => set({ idleMinutes: minutes }),
  setIdleSeconds: (seconds: number) => set({ idleSeconds: seconds }),
  setSettingsTabActive: (active: boolean) => set({ isSettingsTabActive: active }),
}));