// Theme color definitions for FunTime productivity app

export type Theme = 'dark' | 'light' | 'anime';

export interface ThemeConfig {
  meshColors: string[];
  meshBase: string;
}

export const themeColors: Record<Theme, ThemeConfig> = {
  dark: {
    meshColors: ['rgba(34,211,238,0.05)', 'rgba(59,130,246,0.05)'],
    meshBase: '#09090b',
  },
  light: {
    meshColors: ['rgba(8,145,178,0.03)', 'rgba(37,99,235,0.03)'],
    meshBase: '#fafafa',
  },
  anime: {
    meshColors: ['rgba(244,114,182,0.08)', 'rgba(139,92,246,0.08)'],
    meshBase: '#0d0015',
  },
};

/**
 * Apply the given theme to the document root element.
 * Sets a `data-theme` attribute so CSS custom properties can respond accordingly.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}
