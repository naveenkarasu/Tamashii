package com.tamashii.app.blocker

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityManager

class AppBlockerService : AccessibilityService() {
    companion object {
        const val TAG = "TamashiiAppBlocker"

        // System packages we should never block
        private val SYSTEM_PACKAGES = setOf(
            "com.android.systemui",
            "com.android.launcher",
            "com.android.launcher3",
            "com.google.android.apps.nexuslauncher",
            "com.android.settings",
            "com.android.packageinstaller",
            "com.tamashii.app"
        )

        fun isServiceEnabled(context: Context): Boolean {
            val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            val enabledServices = am.getEnabledAccessibilityServiceList(
                AccessibilityServiceInfo.FEEDBACK_GENERIC
            )
            return enabledServices.any {
                it.resolveInfo.serviceInfo.packageName == context.packageName
            }
        }

        fun openSettings(context: Context) {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        }
    }

    private var blockedApps = emptySet<String>()
    private var lastBlockedPackage = ""
    private var lastBlockedTime = 0L

    override fun onServiceConnected() {
        super.onServiceConnected()
        refreshBlockedApps()
        Log.i(TAG, "Accessibility service connected")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return

        // Skip system packages
        if (SYSTEM_PACKAGES.contains(packageName)) return

        // Skip our own blocked activity
        if (packageName == this.packageName) return

        // Refresh blocked list on each event (to pick up changes)
        refreshBlockedApps()

        // Check if lock is active
        if (!BlocklistManager.isLocked(this)) return

        // Check if this app is blocked
        if (!blockedApps.contains(packageName)) return

        // Debounce: don't re-block the same app within 1 second
        val now = System.currentTimeMillis()
        if (packageName == lastBlockedPackage && now - lastBlockedTime < 1000) return

        lastBlockedPackage = packageName
        lastBlockedTime = now

        // Launch blocked activity
        val intent = Intent(this, BlockedActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("blocked_package", packageName)
        }
        startActivity(intent)
        Log.d(TAG, "Blocked foreground app: $packageName")
    }

    override fun onInterrupt() {
        Log.w(TAG, "Accessibility service interrupted")
    }

    private fun refreshBlockedApps() {
        blockedApps = BlocklistManager.getBlockedApps(this)
    }
}
