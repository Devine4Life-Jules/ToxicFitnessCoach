import { create } from 'zustand';

interface StepStore {
  steps: number;
  setSteps: (steps: number) => void;
  resetSteps: () => void;
}

export const useStepStore = create<StepStore>((set) => ({
  steps: 0,
  setSteps: (steps: number) => set({ steps }),
  resetSteps: () => set({ steps: 0 }),
}));