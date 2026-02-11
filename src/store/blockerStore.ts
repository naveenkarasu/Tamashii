import { create } from 'zustand';
import type { BlockCategory, BlockerStatus } from '../types';

interface BlockerState {
  isLocked: boolean;
  lockExpiresAt: string | null;
  categories: BlockCategory[];
  customDomains: string[];
}

interface BlockerActions {
  setLockStatus: (locked: boolean, expiresAt?: string | null) => void;
  addCategory: (category: BlockCategory) => void;
  toggleCategory: (id: string) => void;
  extendLock: (hours: number) => void;
  loadBlockerStatus: (status: BlockerStatus) => void;
  addCustomDomain: (domain: string) => void;
}

export const useBlockerStore = create<BlockerState & BlockerActions>()(
  (set, get) => ({
    // State
    isLocked: false,
    lockExpiresAt: null,
    categories: [],
    customDomains: [],

    // Actions
    setLockStatus: (locked, expiresAt = null) =>
      set({
        isLocked: locked,
        lockExpiresAt: expiresAt ?? null,
      }),

    addCategory: (category) =>
      set((state) => ({
        categories: [...state.categories, category],
      })),

    toggleCategory: (id) => {
      const { isLocked } = get();
      if (isLocked) return;

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, isEnabled: !cat.isEnabled } : cat,
        ),
      }));
    },

    extendLock: (hours) =>
      set((state) => {
        const base = state.lockExpiresAt
          ? new Date(state.lockExpiresAt)
          : new Date();
        base.setHours(base.getHours() + hours);
        return {
          isLocked: true,
          lockExpiresAt: base.toISOString(),
        };
      }),

    loadBlockerStatus: (status) =>
      set({
        isLocked: status.isLocked,
        lockExpiresAt: status.lockExpiresAt,
        categories: status.categories,
      }),

    addCustomDomain: (domain) =>
      set((state) => {
        if (state.customDomains.includes(domain)) return state;
        return { customDomains: [...state.customDomains, domain] };
      }),
  }),
);
