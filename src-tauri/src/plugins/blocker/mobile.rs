use serde::de::DeserializeOwned;
use tauri::{plugin::PluginHandle, Runtime};

use super::models::{InstalledApp, VpnStatus};

pub struct BlockerMobile<R: Runtime>(pub PluginHandle<R>);

impl<R: Runtime> BlockerMobile<R> {
    pub fn new(handle: PluginHandle<R>) -> Self {
        Self(handle)
    }

    fn call<T: DeserializeOwned>(&self, method: &str, payload: serde_json::Value) -> Result<T, String> {
        self.0
            .run_mobile_plugin(method, payload)
            .map_err(|e| e.to_string())
    }

    fn call_void(&self, method: &str, payload: serde_json::Value) -> Result<(), String> {
        self.0
            .run_mobile_plugin::<serde_json::Value>(method, payload)
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn start_vpn(&self, domains: Vec<String>) -> Result<(), String> {
        self.call_void("startVpn", serde_json::json!({ "domains": domains }))
    }

    pub fn stop_vpn(&self) -> Result<(), String> {
        self.call_void("stopVpn", serde_json::json!({}))
    }

    pub fn get_vpn_status(&self) -> Result<VpnStatus, String> {
        self.call("getVpnStatus", serde_json::json!({}))
    }

    pub fn start_app_blocker(&self, packages: Vec<String>) -> Result<(), String> {
        self.call_void("startAppBlocker", serde_json::json!({ "packages": packages }))
    }

    pub fn stop_app_blocker(&self) -> Result<(), String> {
        self.call_void("stopAppBlocker", serde_json::json!({}))
    }

    pub fn get_installed_apps(&self) -> Result<Vec<InstalledApp>, String> {
        self.call("getInstalledApps", serde_json::json!({}))
    }

    pub fn update_blocked_apps(&self, packages: Vec<String>) -> Result<(), String> {
        self.call_void("updateBlockedApps", serde_json::json!({ "packages": packages }))
    }

    pub fn check_accessibility(&self) -> Result<bool, String> {
        self.call("checkAccessibility", serde_json::json!({}))
    }

    pub fn open_accessibility_settings(&self) -> Result<(), String> {
        self.call_void("openAccessibilitySettings", serde_json::json!({}))
    }

    pub fn save_lock_expiry(&self, expiry: String) -> Result<(), String> {
        self.call_void("saveLockExpiry", serde_json::json!({ "expiry": expiry }))
    }
}
