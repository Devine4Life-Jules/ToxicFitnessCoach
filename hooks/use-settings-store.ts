import { create } from 'zustand';

interface SettingsStore {
  idleMinutes: number;
  idleSeconds: number;
  setIdleMinutes: (minutes: number) => void;
  setIdleSeconds: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  idleMinutes: 0,
  idleSeconds: 10,
  setIdleMinutes: (minutes: number) => set({ idleMinutes: minutes }),
  setIdleSeconds: (seconds: number) => set({ idleSeconds: seconds }),
}));