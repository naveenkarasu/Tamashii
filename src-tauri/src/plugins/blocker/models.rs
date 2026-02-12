use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BlockerStatus {
    pub is_active: bool,
    pub is_admin: bool,
    pub blocked_domains: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VpnStatus {
    pub is_running: bool,
    pub blocked_count: u64,
    pub domains_loaded: u64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InstalledApp {
    pub package_name: String,
    pub app_name: String,
    pub icon_base64: String,
}
