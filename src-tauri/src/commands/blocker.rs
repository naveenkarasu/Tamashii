use serde::Serialize;

use crate::blocker::{hosts, watcher};

/// Represents the current state of the blocker.
#[derive(Debug, Serialize)]
pub struct BlockerState {
    pub is_active: bool,
    pub is_admin: bool,
    pub blocked_domains: Vec<String>,
}

/// Apply a list of domains to the hosts file blocker.
/// Also starts the tamper-protection watcher.
#[tauri::command]
pub fn apply_blocklist(domains: Vec<String>) -> Result<(), String> {
    hosts::add_domains(&domains)?;

    // Start the watcher to re-apply every 60 seconds
    watcher::start_watcher(domains);

    Ok(())
}

/// Remove all FUNTIME-managed entries from the hosts file.
#[tauri::command]
pub fn remove_blocklist() -> Result<(), String> {
    hosts::remove_domains()
}

/// Get the current blocker status including active state, admin status,
/// and list of blocked domains.
#[tauri::command]
pub fn get_blocker_status() -> Result<BlockerState, String> {
    let is_admin = hosts::is_admin();
    let blocked_domains = hosts::get_blocked_domains().unwrap_or_default();
    let is_active = !blocked_domains.is_empty();

    Ok(BlockerState {
        is_active,
        is_admin,
        blocked_domains,
    })
}

/// Check if the application is running with administrator privileges.
#[tauri::command]
pub fn check_admin() -> Result<bool, String> {
    Ok(hosts::is_admin())
}

/// Extend the lock expiry by a given number of hours.
/// Returns the new expiry time as an ISO 8601 string.
#[tauri::command]
pub fn extend_lock(hours: u64) -> Result<String, String> {
    let now = chrono::Utc::now();
    let new_expiry = now + chrono::Duration::hours(hours as i64);
    let expiry_str = new_expiry.to_rfc3339();

    log::info!("Lock extended by {} hours, new expiry: {}", hours, expiry_str);
    Ok(expiry_str)
}
