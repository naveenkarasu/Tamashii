package com.tamashii.app.blocker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != Intent.ACTION_BOOT_COMPLETED) return

        // Only restart VPN if lock is still active and domains exist
        if (!BlocklistManager.isLocked(context)) {
            Log.i("TamashiiBoot", "Lock expired, not restarting VPN")
            return
        }

        val domains = BlocklistManager.getDomains(context)
        if (domains.isEmpty()) {
            Log.i("TamashiiBoot", "No domains to block, not restarting VPN")
            return
        }

        Log.i("TamashiiBoot", "Restarting VPN after boot (${domains.size} domains, lock active)")

        val serviceIntent = Intent(context, DnsVpnService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }
    }
}
