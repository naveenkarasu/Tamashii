use std::time::Duration;
use tokio::time;

use super::hosts;

/// Start a background watcher task that re-applies the hosts file entries
/// every 60 seconds for tamper protection.
pub fn start_watcher(domains: Vec<String>) {
    tauri::async_runtime::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(60));
        log::info!(
            "Blocker watcher started for {} domains",
            domains.len()
        );

        loop {
            interval.tick().await;

            if domains.is_empty() {
                continue;
            }

            match hosts::add_domains(&domains) {
                Ok(()) => {
                    log::debug!("Watcher re-applied {} blocked domains", domains.len());
                }
                Err(e) => {
                    log::error!("Watcher failed to re-apply hosts file: {}", e);
                }
            }
        }
    });
}
