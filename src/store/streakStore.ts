import { create } from 'zustand';
import type { StreakData } from '../types';

interface StreakDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface StreakState {
  currentStreakStart: string | null;
  bestStreakDays: number;
  totalResets: number;
  isRunning: boolean;
}

interface StreakActions {
  startStreak: () => void;
  resetStreak: () => void;
  loadStreak: (data: StreakData) => void;
  updateBest: (days: number) => void;
  getStreakDuration: () => StreakDuration;
}

export const useStreakStore = create<StreakState & StreakActions>()(
  (set, get) => ({
    // State
    currentStreakStart: null,
    bestStreakDays: 0,
    totalResets: 0,
    isRunning: false,

    // Actions
    startStreak: () =>
      set({
        currentStreakStart: new Date().toISOString(),
        isRunning: true,
      }),

    resetStreak: () =>
      set((state) => ({
        currentStreakStart: null,
        isRunning: false,
        totalResets: state.totalResets + 1,
      })),

    loadStreak: (data) =>
      set({
        currentStreakStart: data.currentStreakStart,
        bestStreakDays: data.bestStreakDays,
        totalResets: data.totalResets,
        isRunning: data.currentStreakStart !== null,
      }),

    updateBest: (days) =>
      set((state) => ({
        bestStreakDays: days > state.bestStreakDays ? days : state.bestStreakDays,
      })),

    // Computed getter
    getStreakDuration: (): StreakDuration => {
      const { currentStreakStart } = get();
      if (!currentStreakStart) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const start = new Date(currentStreakStart).getTime();
      const now = Date.now();
      let diff = Math.max(0, Math.floor((now - start) / 1000));

      const days = Math.floor(diff / 86400);
      diff %= 86400;
      const hours = Math.floor(diff / 3600);
      diff %= 3600;
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;

      return { days, hours, minutes, seconds };
    },
  }),
);
