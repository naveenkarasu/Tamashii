import { invoke } from "@tauri-apps/api/core";
import type { InstalledApp, VpnStatus } from "../types";

const PLUGIN = "plugin:tamashii-blocker|";

// ─── VPN DNS Blocking ─────────────────────────────────────────────────────

export async function startVpnBlocker(domains: string[]): Promise<void> {
  await invoke(`${PLUGIN}start_vpn_blocker`, { domains });
}

export async function stopVpnBlocker(): Promise<void> {
  await invoke(`${PLUGIN}stop_vpn_blocker`);
}

export async function getVpnStatus(): Promise<VpnStatus> {
  return invoke(`${PLUGIN}get_vpn_status`);
}

// ─── App Blocking ─────────────────────────────────────────────────────────

export async function startAppBlocker(packages: string[]): Promise<void> {
  await invoke(`${PLUGIN}start_app_blocker`, { packages });
}

export async function stopAppBlocker(): Promise<void> {
  await invoke(`${PLUGIN}stop_app_blocker`);
}

export async function getInstalledApps(): Promise<InstalledApp[]> {
  const result = await invoke<{ apps: InstalledApp[] }>(
    `${PLUGIN}get_installed_apps`
  );
  return result.apps ?? [];
}

export async function updateBlockedApps(packages: string[]): Promise<void> {
  await invoke(`${PLUGIN}update_blocked_apps`, { packages });
}

// ─── Accessibility ────────────────────────────────────────────────────────

export async function checkAccessibilityPermission(): Promise<boolean> {
  const result = await invoke<{ enabled: boolean }>(
    `${PLUGIN}check_accessibility_permission`
  );
  return result.enabled ?? false;
}

export async function openAccessibilitySettings(): Promise<void> {
  await invoke(`${PLUGIN}open_accessibility_settings`);
}

// ─── Lock persistence ─────────────────────────────────────────────────────

export async function saveLockExpiryNative(expiry: string): Promise<void> {
  await invoke(`${PLUGIN}save_lock_expiry_native`, { expiry });
}

// ─── Desktop commands ─────────────────────────────────────────────────────

export async function applyBlocklist(domains: string[]): Promise<void> {
  await invoke(`${PLUGIN}apply_blocklist`, { domains });
}

export async function removeBlocklist(): Promise<void> {
  await invoke(`${PLUGIN}remove_blocklist`);
}

export async function getBlockerStatus() {
  return invoke(`${PLUGIN}get_blocker_status`);
}

export async function checkAdmin(): Promise<boolean> {
  return invoke(`${PLUGIN}check_admin`);
}

export async function extendLockNative(hours: number): Promise<string> {
  return invoke(`${PLUGIN}extend_lock`, { hours });
}
