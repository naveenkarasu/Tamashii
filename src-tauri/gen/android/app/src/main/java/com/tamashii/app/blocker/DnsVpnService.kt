package com.tamashii.app.blocker

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

class DnsVpnService : VpnService() {
    companion object {
        const val TAG = "TamashiiVPN"
        const val ACTION_STOP = "com.tamashii.app.STOP_VPN"
        const val CHANNEL_ID = "tamashii_blocking"
        const val NOTIFICATION_ID = 1

        @Volatile
        var isRunning = false
            private set

        @Volatile
        var blockedCount = 0L
            private set

        @Volatile
        var domainsLoaded = 0L
            private set

        // DoH endpoints to block (prevents browser DNS-over-HTTPS bypass)
        private val DOH_DOMAINS = setOf(
            "dns.google",
            "dns.google.com",
            "cloudflare-dns.com",
            "1dot1dot1dot1.cloudflare-dns.com",
            "one.one.one.one",
            "doh.opendns.com",
            "dns.quad9.net",
            "dns9.quad9.net",
            "dns.adguard.com",
            "doh.cleanbrowsing.org",
            "dns.nextdns.io",
            "doh.dns.sb",
            "mozilla.cloudflare-dns.com"
        )
    }

    private var vpnInterface: ParcelFileDescriptor? = null
    private var blockedDomains = HashSet<String>()
    private var dnsThread: Thread? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopVpn()
            return START_NOT_STICKY
        }

        if (!isRunning) {
            loadBlocklist()
            createNotificationChannel()
            startForeground(NOTIFICATION_ID, buildNotification())
            if (establishVpn()) {
                startDnsHandling()
                isRunning = true
                Log.i(TAG, "VPN started with ${blockedDomains.size} blocked domains")
            } else {
                Log.e(TAG, "Failed to establish VPN interface")
                stopSelf()
            }
        }

        return START_STICKY
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }

    private fun stopVpn() {
        isRunning = false
        dnsThread?.interrupt()
        dnsThread = null
        try {
            vpnInterface?.close()
        } catch (_: Exception) {}
        vpnInterface = null
        stopForeground(true)
        stopSelf()
        Log.i(TAG, "VPN stopped")
    }

    private fun loadBlocklist() {
        blockedDomains = HashSet(BlocklistManager.getDomains(this))
        domainsLoaded = blockedDomains.size.toLong()
        blockedCount = 0
        Log.i(TAG, "Loaded ${blockedDomains.size} blocked domains")
    }

    private fun establishVpn(): Boolean {
        return try {
            vpnInterface = Builder()
                .addAddress("10.0.0.2", 32)
                .addDnsServer("10.0.0.2")
                .addRoute("10.0.0.2", 32)
                .setSession("Tamashii DNS Filter")
                .setMtu(1500)
                .setBlocking(true)
                .establish()
            vpnInterface != null
        } catch (e: Exception) {
            Log.e(TAG, "Error establishing VPN", e)
            false
        }
    }

    private fun startDnsHandling() {
        dnsThread = Thread {
            val fd = vpnInterface?.fileDescriptor ?: return@Thread
            val input = FileInputStream(fd)
            val output = FileOutputStream(fd)
            val buffer = ByteArray(32767)

            while (isRunning && !Thread.currentThread().isInterrupted) {
                try {
                    val length = input.read(buffer)
                    if (length <= 0) continue

                    val packet = buffer.copyOfRange(0, length)

                    if (!DnsPacketParser.isDnsQuery(packet)) continue

                    val domain = DnsPacketParser.extractDomain(packet) ?: continue

                    if (shouldBlock(domain)) {
                        val response = DnsPacketParser.buildBlockedResponse(packet)
                        synchronized(output) {
                            output.write(response)
                        }
                        blockedCount++
                        Log.d(TAG, "BLOCKED: $domain")
                    } else {
                        val response = forwardDnsQuery(packet)
                        if (response != null) {
                            synchronized(output) {
                                output.write(response)
                            }
                        }
                    }
                } catch (e: InterruptedException) {
                    break
                } catch (e: Exception) {
                    if (isRunning) {
                        Log.e(TAG, "DNS handling error", e)
                    }
                }
            }

            try {
                input.close()
                output.close()
            } catch (_: Exception) {}
        }.apply {
            name = "TamashiiDnsHandler"
            isDaemon = true
            start()
        }
    }

    private fun shouldBlock(domain: String): Boolean {
        // Block DoH endpoints to prevent bypass
        if (DOH_DOMAINS.contains(domain)) return true

        // Exact match
        if (blockedDomains.contains(domain)) return true

        // Check parent domains (e.g. "sub.pornhub.com" blocked if "pornhub.com" is in list)
        val parts = domain.split(".")
        for (i in 1 until parts.size) {
            val parent = parts.subList(i, parts.size).joinToString(".")
            if (blockedDomains.contains(parent)) return true
        }

        return false
    }

    private fun forwardDnsQuery(queryPacket: ByteArray): ByteArray? {
        try {
            val dnsPayload = DnsPacketParser.extractDnsPayload(queryPacket)

            val socket = DatagramSocket()
            protect(socket) // Prevent VPN loop

            val address = InetAddress.getByName("1.1.1.1")
            val queryDatagram = DatagramPacket(dnsPayload, dnsPayload.size, address, 53)
            socket.soTimeout = 5000
            socket.send(queryDatagram)

            val responseBuffer = ByteArray(4096)
            val responseDatagram = DatagramPacket(responseBuffer, responseBuffer.size)
            socket.receive(responseDatagram)
            socket.close()

            val dnsResponse = responseBuffer.copyOfRange(0, responseDatagram.length)
            return DnsPacketParser.buildForwardedResponse(queryPacket, dnsResponse)
        } catch (e: Exception) {
            Log.e(TAG, "Error forwarding DNS query", e)
            return null
        }
    }

    // ─── Notification ───────────────────────────────────────────────────

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Tamashii Blocking",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows when content blocking is active"
                setShowBadge(false)
            }
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val stopIntent = Intent(this, DnsVpnService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPending = PendingIntent.getService(
            this, 0, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("Tamashii")
            .setContentText("Blocking Active — ${blockedDomains.size} domains filtered")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setOngoing(true)
            .addAction(
                Notification.Action.Builder(
                    null, "Stop", stopPending
                ).build()
            )
            .build()
    }
}
