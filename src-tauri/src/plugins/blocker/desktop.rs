use std::time::Duration;
use tokio::time;

// ─── Hosts file constants (Windows only) ────────────────────────────────────

#[cfg(target_os = "windows")]
const HOSTS_PATH: &str = r"C:\Windows\System32\drivers\etc\hosts";

#[cfg(target_os = "windows")]
const MARKER_START: &str = "# === TAMASHII START ===";

#[cfg(target_os = "windows")]
const MARKER_END: &str = "# === TAMASHII END ===";

// ─── Hosts file manipulation ────────────────────────────────────────────────

#[cfg(target_os = "windows")]
pub fn add_domains(domains: &[String]) -> Result<(), String> {
    use std::fs;
    use std::io::Write;

    if domains.is_empty() {
        return remove_domains();
    }

    let content = fs::read_to_string(HOSTS_PATH)
        .map_err(|e| format!("Failed to read hosts file: {}. Are you running as admin?", e))?;

    let cleaned = remove_tamashii_block(&content);

    let mut block = String::new();
    block.push('\n');
    block.push_str(MARKER_START);
    block.push('\n');
    for domain in domains {
        let domain = domain.trim().to_lowercase();
        if domain.is_empty() {
            continue;
        }
        block.push_str(&format!("127.0.0.1 {}\n", domain));
        if !domain.starts_with("www.") {
            block.push_str(&format!("127.0.0.1 www.{}\n", domain));
        }
    }
    block.push_str(MARKER_END);
    block.push('\n');

    let new_content = format!("{}{}", cleaned.trim_end(), block);

    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(HOSTS_PATH)
        .map_err(|e| {
            format!(
                "Failed to open hosts file for writing: {}. Are you running as admin?",
                e
            )
        })?;

    file.write_all(new_content.as_bytes())
        .map_err(|e| format!("Failed to write hosts file: {}", e))?;

    log::info!("Applied {} domains to hosts file", domains.len());
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn add_domains(domains: &[String]) -> Result<(), String> {
    log::info!(
        "Hosts file blocking not available on this platform ({} domains requested)",
        domains.len()
    );
    Ok(())
}

#[cfg(target_os = "windows")]
pub fn remove_domains() -> Result<(), String> {
    use std::fs;
    use std::io::Write;

    let content = fs::read_to_string(HOSTS_PATH)
        .map_err(|e| format!("Failed to read hosts file: {}. Are you running as admin?", e))?;

    let cleaned = remove_tamashii_block(&content);

    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(HOSTS_PATH)
        .map_err(|e| {
            format!(
                "Failed to open hosts file for writing: {}. Are you running as admin?",
                e
            )
        })?;

    file.write_all(cleaned.as_bytes())
        .map_err(|e| format!("Failed to write hosts file: {}", e))?;

    log::info!("Removed TAMASHII block from hosts file");
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn remove_domains() -> Result<(), String> {
    log::info!("Hosts file blocking not available on this platform");
    Ok(())
}

#[cfg(target_os = "windows")]
pub fn get_blocked_domains() -> Result<Vec<String>, String> {
    use std::fs;

    let content = fs::read_to_string(HOSTS_PATH)
        .map_err(|e| format!("Failed to read hosts file: {}", e))?;

    let mut domains = Vec::new();
    let mut in_block = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed == MARKER_START {
            in_block = true;
            continue;
        }
        if trimmed == MARKER_END {
            break;
        }
        if in_block {
            if let Some(domain) = trimmed.strip_prefix("127.0.0.1") {
                let domain = domain.trim();
                if !domain.is_empty() {
                    domains.push(domain.to_string());
                }
            }
        }
    }

    Ok(domains)
}

#[cfg(not(target_os = "windows"))]
pub fn get_blocked_domains() -> Result<Vec<String>, String> {
    Ok(Vec::new())
}

#[cfg(target_os = "windows")]
pub fn is_admin() -> bool {
    use std::fs;
    fs::OpenOptions::new()
        .write(true)
        .open(HOSTS_PATH)
        .is_ok()
}

#[cfg(not(target_os = "windows"))]
pub fn is_admin() -> bool {
    false
}

#[cfg(target_os = "windows")]
fn remove_tamashii_block(content: &str) -> String {
    let mut result = String::new();
    let mut in_block = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed == MARKER_START {
            in_block = true;
            continue;
        }
        if trimmed == MARKER_END {
            in_block = false;
            continue;
        }
        if !in_block {
            result.push_str(line);
            result.push('\n');
        }
    }

    result
}

// ─── Tamper-protection watcher ──────────────────────────────────────────────

pub fn start_watcher(domains: Vec<String>) {
    tauri::async_runtime::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(60));
        log::info!("Blocker watcher started for {} domains", domains.len());

        loop {
            interval.tick().await;

            if domains.is_empty() {
                continue;
            }

            match add_domains(&domains) {
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
