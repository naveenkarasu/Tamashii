package com.tamashii.app.blocker

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.util.Log
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import org.json.JSONArray

private const val VPN_REQUEST_CODE = 9001
private const val TAG = "BlockerPlugin"

@InvokeArg
class StartVpnArgs {
    var domains: List<String> = emptyList()
}

@InvokeArg
class StartAppBlockerArgs {
    var packages: List<String> = emptyList()
}

@InvokeArg
class UpdateBlockedAppsArgs {
    var packages: List<String> = emptyList()
}

@InvokeArg
class SaveLockExpiryArgs {
    var expiry: String = ""
}

@TauriPlugin
class BlockerPlugin(private val activity: Activity) : Plugin(activity) {
    private var pendingVpnInvoke: Invoke? = null

    // ─── VPN DNS Blocking ───────────────────────────────────────────────

    @Command
    fun startVpn(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(StartVpnArgs::class.java)
            val domains = args.domains

            // Save domains to SharedPreferences
            BlocklistManager.saveDomains(activity, domains)

            // Check if VPN permission is needed
            val prepareIntent = VpnService.prepare(activity)
            if (prepareIntent != null) {
                pendingVpnInvoke = invoke
                startActivityForResult(invoke, prepareIntent, VPN_REQUEST_CODE)
                return
            }

            // Already have permission — start VPN service
            doStartVpnService()
            invoke.resolve()
        } catch (e: Exception) {
            Log.e(TAG, "startVpn error", e)
            invoke.reject(e.message ?: "Failed to start VPN")
        }
    }

    override fun handleOnActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.handleOnActivityResult(requestCode, resultCode, data)
        if (requestCode == VPN_REQUEST_CODE) {
            val invoke = pendingVpnInvoke ?: return
            pendingVpnInvoke = null

            if (resultCode == Activity.RESULT_OK) {
                doStartVpnService()
                invoke.resolve()
            } else {
                invoke.reject("VPN permission denied by user")
            }
        }
    }

    private fun doStartVpnService() {
        val intent = Intent(activity, DnsVpnService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            activity.startForegroundService(intent)
        } else {
            activity.startService(intent)
        }
        Log.i(TAG, "VPN service started")
    }

    @Command
    fun stopVpn(invoke: Invoke) {
        try {
            val intent = Intent(activity, DnsVpnService::class.java).apply {
                action = DnsVpnService.ACTION_STOP
            }
            activity.startService(intent)
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject(e.message ?: "Failed to stop VPN")
        }
    }

    @Command
    fun getVpnStatus(invoke: Invoke) {
        val result = JSObject().apply {
            put("isRunning", DnsVpnService.isRunning)
            put("blockedCount", DnsVpnService.blockedCount)
            put("domainsLoaded", DnsVpnService.domainsLoaded)
        }
        invoke.resolve(result)
    }

    // ─── App Blocking ───────────────────────────────────────────────────

    @Command
    fun startAppBlocker(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(StartAppBlockerArgs::class.java)
            BlocklistManager.saveBlockedApps(activity, args.packages)
            Log.i(TAG, "App blocker started with ${args.packages.size} blocked apps")
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject(e.message ?: "Failed to start app blocker")
        }
    }

    @Command
    fun stopAppBlocker(invoke: Invoke) {
        BlocklistManager.clearBlockedApps(activity)
        Log.i(TAG, "App blocker stopped")
        invoke.resolve()
    }

    @Command
    fun updateBlockedApps(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(UpdateBlockedAppsArgs::class.java)
            BlocklistManager.saveBlockedApps(activity, args.packages)
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject(e.message ?: "Failed to update blocked apps")
        }
    }

    @Command
    fun getInstalledApps(invoke: Invoke) {
        try {
            val apps = InstalledAppsHelper.getInstalledApps(activity)
            val result = JSObject()
            val jsonArray = JSONArray()

            for (app in apps) {
                val obj = JSObject().apply {
                    put("packageName", app.packageName)
                    put("appName", app.appName)
                    put("iconBase64", app.iconBase64)
                }
                jsonArray.put(obj)
            }

            result.put("apps", jsonArray)
            invoke.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "getInstalledApps error", e)
            invoke.reject(e.message ?: "Failed to get installed apps")
        }
    }

    // ─── Accessibility ──────────────────────────────────────────────────

    @Command
    fun checkAccessibility(invoke: Invoke) {
        val enabled = AppBlockerService.isServiceEnabled(activity)
        val result = JSObject().apply {
            put("enabled", enabled)
        }
        invoke.resolve(result)
    }

    @Command
    fun openAccessibilitySettings(invoke: Invoke) {
        AppBlockerService.openSettings(activity)
        invoke.resolve()
    }

    // ─── Lock timer persistence ─────────────────────────────────────────

    @Command
    fun saveLockExpiry(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(SaveLockExpiryArgs::class.java)
            BlocklistManager.saveLockExpiry(activity, args.expiry)
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject(e.message ?: "Failed to save lock expiry")
        }
    }
}
