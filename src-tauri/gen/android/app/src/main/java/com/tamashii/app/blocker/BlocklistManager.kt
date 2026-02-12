package com.tamashii.app.blocker

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray

object BlocklistManager {
    private const val PREFS_NAME = "tamashii_blocker"
    private const val KEY_DOMAINS = "blocked_domains"
    private const val KEY_BLOCKED_APPS = "blocked_apps"
    private const val KEY_LOCK_EXPIRY = "lock_expiry"

    private fun prefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    // ─── Domain blocklist ───────────────────────────────────────────────

    fun saveDomains(context: Context, domains: List<String>) {
        val json = JSONArray(domains).toString()
        prefs(context).edit().putString(KEY_DOMAINS, json).apply()
    }

    fun getDomains(context: Context): Set<String> {
        val json = prefs(context).getString(KEY_DOMAINS, "[]") ?: "[]"
        val result = mutableSetOf<String>()
        try {
            val arr = JSONArray(json)
            for (i in 0 until arr.length()) {
                result.add(arr.getString(i).lowercase())
            }
        } catch (_: Exception) {}
        return result
    }

    fun clearDomains(context: Context) {
        prefs(context).edit().remove(KEY_DOMAINS).apply()
    }

    // ─── Blocked apps ───────────────────────────────────────────────────

    fun saveBlockedApps(context: Context, packages: List<String>) {
        val json = JSONArray(packages).toString()
        prefs(context).edit().putString(KEY_BLOCKED_APPS, json).apply()
    }

    fun getBlockedApps(context: Context): Set<String> {
        val json = prefs(context).getString(KEY_BLOCKED_APPS, "[]") ?: "[]"
        val result = mutableSetOf<String>()
        try {
            val arr = JSONArray(json)
            for (i in 0 until arr.length()) {
                result.add(arr.getString(i))
            }
        } catch (_: Exception) {}
        return result
    }

    fun clearBlockedApps(context: Context) {
        prefs(context).edit().remove(KEY_BLOCKED_APPS).apply()
    }

    // ─── Lock timer ─────────────────────────────────────────────────────

    fun saveLockExpiry(context: Context, isoExpiry: String) {
        prefs(context).edit().putString(KEY_LOCK_EXPIRY, isoExpiry).apply()
    }

    fun getLockExpiry(context: Context): String? {
        return prefs(context).getString(KEY_LOCK_EXPIRY, null)
    }

    fun clearLockExpiry(context: Context) {
        prefs(context).edit().remove(KEY_LOCK_EXPIRY).apply()
    }

    fun isLocked(context: Context): Boolean {
        val expiry = getLockExpiry(context) ?: return false
        return try {
            val expiryTime = java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.US
            ).apply {
                timeZone = java.util.TimeZone.getTimeZone("UTC")
            }.parse(expiry.replace(Regex("[Z+].*"), ""))
            expiryTime != null && expiryTime.time > System.currentTimeMillis()
        } catch (_: Exception) {
            false
        }
    }
}
