use serde::{Deserialize, Serialize};

/// Data structure representing the user's streak information.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StreakData {
    /// ISO 8601 date string of when the current streak started, or null if not active.
    pub start_date: Option<String>,
    /// The best (longest) streak in days.
    pub best_streak: u64,
    /// Total number of streak resets.
    pub total_resets: u64,
    /// Current streak length in days (computed).
    pub current_days: u64,
}

/// Get the current streak data.
/// Computes current_days from start_date if present.
#[tauri::command]
pub fn get_streak_data(start: Option<String>, best: Option<u64>, resets: Option<u64>) -> Result<StreakData, String> {
    let best_streak = best.unwrap_or(0);
    let total_resets = resets.unwrap_or(0);

    let current_days = if let Some(ref start_date) = start {
        compute_days_since(start_date).unwrap_or(0)
    } else {
        0
    };

    Ok(StreakData {
        start_date: start,
        best_streak,
        total_resets,
        current_days,
    })
}

/// Save streak data. Returns the updated StreakData with computed current_days.
#[tauri::command]
pub fn save_streak_data(start: Option<String>, best: u64, resets: u64) -> Result<StreakData, String> {
    let current_days = if let Some(ref start_date) = start {
        compute_days_since(start_date).unwrap_or(0)
    } else {
        0
    };

    log::info!(
        "Streak data saved: start={:?}, best={}, resets={}, current={}",
        start, best, resets, current_days
    );

    Ok(StreakData {
        start_date: start,
        best_streak: best,
        total_resets: resets,
        current_days,
    })
}

/// Compute the number of days since a given ISO 8601 date string.
fn compute_days_since(date_str: &str) -> Result<u64, String> {
    // Try parsing as a full RFC 3339 datetime first
    if let Ok(dt) = chrono::DateTime::parse_from_rfc3339(date_str) {
        let now = chrono::Utc::now();
        let duration = now.signed_duration_since(dt);
        return Ok(duration.num_days().max(0) as u64);
    }

    // Try parsing as a date-only string (YYYY-MM-DD)
    if let Ok(date) = chrono::NaiveDate::parse_from_str(date_str, "%Y-%m-%d") {
        let today = chrono::Utc::now().date_naive();
        let duration = today.signed_duration_since(date);
        return Ok(duration.num_days().max(0) as u64);
    }

    Err(format!("Could not parse date: {}", date_str))
}
