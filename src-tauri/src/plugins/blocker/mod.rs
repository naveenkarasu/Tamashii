#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;
mod commands;
pub mod models;

#[cfg(mobile)]
pub use mobile::BlockerMobile;

use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

#[cfg(mobile)]
use tauri::Manager;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("tamashii-blocker")
        .invoke_handler(tauri::generate_handler![
            // Desktop commands (existing)
            commands::apply_blocklist,
            commands::remove_blocklist,
            commands::get_blocker_status,
            commands::check_admin,
            commands::extend_lock,
            // Mobile commands (Android)
            commands::start_vpn_blocker,
            commands::stop_vpn_blocker,
            commands::get_vpn_status,
            commands::start_app_blocker,
            commands::stop_app_blocker,
            commands::get_installed_apps,
            commands::update_blocked_apps,
            commands::check_accessibility_permission,
            commands::open_accessibility_settings,
            commands::save_lock_expiry_native,
        ])
        .setup(|app, api| {
            #[cfg(target_os = "android")]
            {
                let handle = api.register_android_plugin("com.tamashii.app.blocker", "BlockerPlugin")?;
                app.manage(BlockerMobile::new(handle));
            }
            let _ = (app, api);
            Ok(())
        })
        .build()
}
