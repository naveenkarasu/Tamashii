use chrono::{Datelike, Local, NaiveTime};
use std::time::Duration;
use tauri_plugin_notification::NotificationExt;

/// Hardcoded daily quotes for rotation.
const QUOTES: &[&str] = &[
    "Every day is a new beginning. Take a deep breath and start again.",
    "You are stronger than you think. Keep going.",
    "Progress, not perfection. One step at a time.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your future self will thank you for the choices you make today.",
    "Discipline is choosing between what you want now and what you want most.",
    "Small daily improvements are the key to staggering long-term results.",
    "You don't have to be perfect. You just have to keep trying.",
    "The only person you need to be better than is who you were yesterday.",
    "Freedom is on the other side of discipline.",
];

/// Start the quote notification scheduler.
/// Sends a motivational notification once per day at the configured time (default 09:30).
pub async fn start_scheduler(app_handle: tauri::AppHandle) {
    let schedule_hour: u32 = 9;
    let schedule_minute: u32 = 30;

    log::info!(
        "Quote scheduler started, will send notifications at {:02}:{:02}",
        schedule_hour,
        schedule_minute
    );

    loop {
        // Calculate how long to sleep until next notification time
        let sleep_duration = calculate_sleep_duration(schedule_hour, schedule_minute);
        log::info!(
            "Next quote notification in {} seconds",
            sleep_duration.as_secs()
        );

        tokio::time::sleep(sleep_duration).await;

        // Pick a quote based on the day of the year
        let day_of_year = Local::now().ordinal0() as usize;
        let quote = QUOTES[day_of_year % QUOTES.len()];

        // Send notification
        match app_handle
            .notification()
            .builder()
            .title("FunTime - Daily Reminder")
            .body(quote)
            .show()
        {
            Ok(()) => {
                log::info!("Quote notification sent: {}", quote);
            }
            Err(e) => {
                log::error!("Failed to send quote notification: {}", e);
            }
        }

        // Sleep a short time to avoid re-triggering on the same minute
        tokio::time::sleep(Duration::from_secs(61)).await;
    }
}

/// Calculate the duration to sleep until the target time (hour:minute) today or tomorrow.
fn calculate_sleep_duration(target_hour: u32, target_minute: u32) -> Duration {
    let now = Local::now();
    let target_time = NaiveTime::from_hms_opt(target_hour, target_minute, 0)
        .unwrap_or_else(|| NaiveTime::from_hms_opt(9, 30, 0).unwrap());

    let current_time = now.time();

    let seconds_until = if current_time < target_time {
        // Target is later today
        let diff = target_time - current_time;
        diff.num_seconds() as u64
    } else {
        // Target is tomorrow
        let remaining_today =
            NaiveTime::from_hms_opt(23, 59, 59).unwrap() - current_time;
        let from_midnight = target_time - NaiveTime::from_hms_opt(0, 0, 0).unwrap();
        (remaining_today.num_seconds() + from_midnight.num_seconds() + 1) as u64
    };

    Duration::from_secs(seconds_until)
}
