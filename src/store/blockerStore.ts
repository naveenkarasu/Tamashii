import { create } from 'zustand';
import type { BlockCategory, BlockerStatus } from '../types';

interface BlockerState {
  isLocked: boolean;
  lockExpiresAt: string | null;
  categories: BlockCategory[];
  customDomains: string[];
  // Android-specific state
  vpnActive: boolean;
  appBlockerActive: boolean;
  blockedApps: string[];
  accessibilityEnabled: boolean;
}

interface BlockerActions {
  setLockStatus: (locked: boolean, expiresAt?: string | null) => void;
  addCategory: (category: BlockCategory) => void;
  toggleCategory: (id: string) => void;
  extendLock: (hours: number) => void;
  loadBlockerStatus: (status: BlockerStatus) => void;
  addCustomDomain: (domain: string) => void;
  // Android actions
  setVpnActive: (active: boolean) => void;
  setAppBlockerActive: (active: boolean) => void;
  setBlockedApps: (apps: string[]) => void;
  toggleBlockedApp: (packageName: string) => void;
  setAccessibilityEnabled: (enabled: boolean) => void;
}

export const useBlockerStore = create<BlockerState & BlockerActions>()(
  (set, get) => ({
    // State
    isLocked: false,
    lockExpiresAt: null,
    categories: [],
    customDomains: [],
    vpnActive: false,
    appBlockerActive: false,
    blockedApps: [],
    accessibilityEnabled: false,

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

    // Android actions
    setVpnActive: (active) => set({ vpnActive: active }),

    setAppBlockerActive: (active) => set({ appBlockerActive: active }),

    setBlockedApps: (apps) => set({ blockedApps: apps }),

    toggleBlockedApp: (packageName) =>
      set((state) => {
        if (state.isLocked) return state;
        const exists = state.blockedApps.includes(packageName);
        return {
          blockedApps: exists
            ? state.blockedApps.filter((p) => p !== packageName)
            : [...state.blockedApps, packageName],
        };
      }),

    setAccessibilityEnabled: (enabled) =>
      set({ accessibilityEnabled: enabled }),
  }),
);
