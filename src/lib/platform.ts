/** Detect if running on Android (Tauri mobile webview). */
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

/** Detect if running on desktop (Windows/macOS/Linux). */
export function isDesktop(): boolean {
  return !isAndroid();
}
