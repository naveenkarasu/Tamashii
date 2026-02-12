export type Theme = 'dark' | 'light' | 'anime';
export type MascotGender = 'girl' | 'boy';
export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export interface Settings {
  theme: Theme;
  mascotGender: MascotGender;
  notificationTime: string; // HH:MM format
  notificationsEnabled: boolean;
  autoStartEnabled: boolean;
}

export interface StreakData {
  currentStreakStart: string | null; // ISO datetime
  bestStreakDays: number;
  totalResets: number;
}

export interface BlockCategory {
  id: string;
  name: string;
  icon: string;
  domainCount: number;
  isLocked: boolean;
  isEnabled: boolean;
}

export interface BlockerStatus {
  isLocked: boolean;
  lockExpiresAt: string | null; // ISO datetime
  categories: BlockCategory[];
}

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'blocker' | 'journal' | 'panic' | 'special';
  requirement: number;
  unlockedAt: string | null;
  progress: number;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  category: 'motivation' | 'discipline' | 'recovery' | 'productivity';
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  hadStreak: boolean;
  wasReset: boolean;
  panicButtonUsed: boolean;
  journalWritten: boolean;
}

export interface MascotExpression {
  name: string;
  streakRange: [number, number]; // [min, max] days
}

export interface MascotDialogue {
  context: string;
  messages: string[];
}

export interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
  route: string;
}

// ─── Android blocker types ────────────────────────────────────────────────

export interface VpnStatus {
  isRunning: boolean;
  blockedCount: number;
  domainsLoaded: number;
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  iconBase64: string;
}
