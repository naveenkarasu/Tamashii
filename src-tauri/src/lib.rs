mod blocker;
mod commands;
mod scheduler;

use tauri::Manager;

#[cfg(desktop)]
use tauri::menu::{Menu, MenuItem};
#[cfg(desktop)]
use tauri::tray::TrayIconBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::blocker::apply_blocklist,
            commands::blocker::remove_blocklist,
            commands::blocker::get_blocker_status,
            commands::blocker::check_admin,
            commands::blocker::extend_lock,
            commands::streak::get_streak_data,
            commands::streak::save_streak_data,
        ]);

    // Autostart plugin - desktop only
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ));
    }

    builder
        .setup(|app| {
            // System tray - desktop only
            #[cfg(desktop)]
            {
                let show =
                    MenuItem::with_id(app, "show", "Show Tamashii", true, None::<&str>)?;
                let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
                let menu = Menu::with_items(app, &[&show, &quit])?;

                let _tray = TrayIconBuilder::new()
                    .menu(&menu)
                    .tooltip("Tamashii - Stay Focused")
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .build(app)?;
            }

            // Start quote scheduler
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                scheduler::quote_scheduler::start_scheduler(handle).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
