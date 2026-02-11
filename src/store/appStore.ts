import { create } from 'zustand';
import type { Theme, MascotGender } from '../types';

interface AppState {
  theme: Theme;
  mascotGender: MascotGender;
  notificationTime: string;
  notificationsEnabled: boolean;
  sidebarExpanded: boolean;
  currentPage: string;
}

interface AppActions {
  setTheme: (theme: Theme) => void;
  setMascotGender: (gender: MascotGender) => void;
  setNotificationTime: (time: string) => void;
  toggleNotifications: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  // State
  theme: 'dark',
  mascotGender: 'girl',
  notificationTime: '09:30',
  notificationsEnabled: true,
  sidebarExpanded: false,
  currentPage: '/',

  // Actions
  setTheme: (theme) => set({ theme }),
  setMascotGender: (gender) => set({ mascotGender: gender }),
  setNotificationTime: (time) => set({ notificationTime: time }),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
