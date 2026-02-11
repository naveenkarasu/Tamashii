import { create } from 'zustand';
import type { Achievement } from '../types';

interface AchievementState {
  achievements: Achievement[];
}

interface AchievementActions {
  loadAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

export const useAchievementStore = create<AchievementState & AchievementActions>()(
  (set) => ({
    // State
    achievements: [],

    // Actions
    loadAchievements: (achievements) => set({ achievements }),

    unlockAchievement: (id) =>
      set((state) => ({
        achievements: state.achievements.map((a) =>
          a.id === id && !a.unlockedAt
            ? { ...a, unlockedAt: new Date().toISOString(), progress: a.requirement }
            : a,
        ),
      })),

    updateProgress: (id, progress) =>
      set((state) => ({
        achievements: state.achievements.map((a) =>
          a.id === id ? { ...a, progress: Math.min(progress, a.requirement) } : a,
        ),
      })),
  }),
);
