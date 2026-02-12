use tauri::{AppHandle, Runtime};

use super::models::{BlockerStatus, InstalledApp, VpnStatus};

// ─── Desktop commands (existing logic, restructured) ────────────────────────

#[tauri::command]
pub fn apply_blocklist(domains: Vec<String>) -> Result<(), String> {
    #[cfg(desktop)]
    {
        super::desktop::add_domains(&domains)?;
        super::desktop::start_watcher(domains);
    }
    #[cfg(not(desktop))]
    {
        let _ = domains;
        log::info!("apply_blocklist: desktop-only, no-op on mobile");
    }
    Ok(())
}

#[tauri::command]
pub fn remove_blocklist() -> Result<(), String> {
    #[cfg(desktop)]
    {
        super::desktop::remove_domains()?;
    }
    Ok(())
}

#[tauri::command]
pub fn get_blocker_status() -> Result<BlockerStatus, String> {
    #[cfg(desktop)]
    {
        let is_admin = super::desktop::is_admin();
        let blocked_domains = super::desktop::get_blocked_domains().unwrap_or_default();
        let is_active = !blocked_domains.is_empty();
        return Ok(BlockerStatus {
            is_active,
            is_admin,
            blocked_domains,
        });
    }
    #[cfg(not(desktop))]
    {
        Ok(BlockerStatus {
            is_active: false,
            is_admin: false,
            blocked_domains: vec![],
        })
    }
}

#[tauri::command]
pub fn check_admin() -> Result<bool, String> {
    #[cfg(desktop)]
    {
        return Ok(super::desktop::is_admin());
    }
    #[cfg(not(desktop))]
    {
        Ok(false)
    }
}

#[tauri::command]
pub fn extend_lock(hours: u64) -> Result<String, String> {
    let now = chrono::Utc::now();
    let new_expiry = now + chrono::Duration::hours(hours as i64);
    let expiry_str = new_expiry.to_rfc3339();
    log::info!(
        "Lock extended by {} hours, new expiry: {}",
        hours,
        expiry_str
    );
    Ok(expiry_str)
}

// ─── Mobile commands (Android VPN + App blocking) ───────────────────────────

#[tauri::command]
pub fn start_vpn_blocker<R: Runtime>(
    app: AppHandle<R>,
    domains: Vec<String>,
) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.start_vpn(domains);
    }
    #[cfg(not(mobile))]
    {
        let _ = (app, domains);
        Err("VPN blocker is only available on Android".into())
    }
}

#[tauri::command]
pub fn stop_vpn_blocker<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.stop_vpn();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Err("VPN blocker is only available on Android".into())
    }
}

#[tauri::command]
pub fn get_vpn_status<R: Runtime>(app: AppHandle<R>) -> Result<VpnStatus, String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.get_vpn_status();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Ok(VpnStatus {
            is_running: false,
            blocked_count: 0,
            domains_loaded: 0,
        })
    }
}

#[tauri::command]
pub fn start_app_blocker<R: Runtime>(
    app: AppHandle<R>,
    packages: Vec<String>,
) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.start_app_blocker(packages);
    }
    #[cfg(not(mobile))]
    {
        let _ = (app, packages);
        Err("App blocker is only available on Android".into())
    }
}

#[tauri::command]
pub fn stop_app_blocker<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.stop_app_blocker();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Err("App blocker is only available on Android".into())
    }
}

#[tauri::command]
pub fn get_installed_apps<R: Runtime>(app: AppHandle<R>) -> Result<Vec<InstalledApp>, String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.get_installed_apps();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Ok(vec![])
    }
}

#[tauri::command]
pub fn update_blocked_apps<R: Runtime>(
    app: AppHandle<R>,
    packages: Vec<String>,
) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.update_blocked_apps(packages);
    }
    #[cfg(not(mobile))]
    {
        let _ = (app, packages);
        Err("App blocker is only available on Android".into())
    }
}

#[tauri::command]
pub fn check_accessibility_permission<R: Runtime>(app: AppHandle<R>) -> Result<bool, String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.check_accessibility();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Ok(false)
    }
}

#[tauri::command]
pub fn open_accessibility_settings<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.open_accessibility_settings();
    }
    #[cfg(not(mobile))]
    {
        let _ = app;
        Err("Accessibility settings only available on Android".into())
    }
}

#[tauri::command]
pub fn save_lock_expiry_native<R: Runtime>(
    app: AppHandle<R>,
    expiry: String,
) -> Result<(), String> {
    #[cfg(mobile)]
    {
        let state = app.state::<super::BlockerMobile<R>>();
        return state.save_lock_expiry(expiry);
    }
    #[cfg(not(mobile))]
    {
        let _ = (app, expiry);
        Ok(())
    }
}
