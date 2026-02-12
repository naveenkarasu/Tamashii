package com.tamashii.app.blocker

object DnsPacketParser {
    private const val IP_HEADER_MIN_LEN = 20
    private const val UDP_HEADER_LEN = 8
    private const val DNS_HEADER_LEN = 12

    fun isDnsQuery(packet: ByteArray): Boolean {
        if (packet.size < IP_HEADER_MIN_LEN + UDP_HEADER_LEN + DNS_HEADER_LEN) return false

        // IP version must be 4
        val version = (packet[0].toInt() and 0xF0) shr 4
        if (version != 4) return false

        // Protocol must be UDP (17)
        if (packet[9].toInt() and 0xFF != 17) return false

        // Get actual IP header length
        val ihl = (packet[0].toInt() and 0x0F) * 4
        if (packet.size < ihl + UDP_HEADER_LEN + DNS_HEADER_LEN) return false

        // Destination port must be 53 (DNS)
        val dstPort = ((packet[ihl + 2].toInt() and 0xFF) shl 8) or
                (packet[ihl + 3].toInt() and 0xFF)
        return dstPort == 53
    }

    fun extractDomain(packet: ByteArray): String? {
        try {
            val ihl = (packet[0].toInt() and 0x0F) * 4
            val questionStart = ihl + UDP_HEADER_LEN + DNS_HEADER_LEN

            val domain = StringBuilder()
            var offset = questionStart

            while (offset < packet.size) {
                val labelLen = packet[offset].toInt() and 0xFF
                if (labelLen == 0) break

                if (domain.isNotEmpty()) domain.append('.')

                for (i in 1..labelLen) {
                    if (offset + i >= packet.size) return null
                    domain.append((packet[offset + i].toInt() and 0xFF).toChar())
                }

                offset += labelLen + 1
            }

            return if (domain.isNotEmpty()) domain.toString().lowercase() else null
        } catch (_: Exception) {
            return null
        }
    }

    fun extractDnsPayload(packet: ByteArray): ByteArray {
        val ihl = (packet[0].toInt() and 0x0F) * 4
        val dnsStart = ihl + UDP_HEADER_LEN
        return packet.copyOfRange(dnsStart, packet.size)
    }

    fun buildBlockedResponse(queryPacket: ByteArray): ByteArray {
        val ihl = (queryPacket[0].toInt() and 0x0F) * 4
        val dnsStart = ihl + UDP_HEADER_LEN
        val dnsPayload = queryPacket.copyOfRange(dnsStart, queryPacket.size)

        val dnsResponse = buildDnsResponse(dnsPayload)
        return wrapInIpUdp(queryPacket, dnsResponse)
    }

    fun buildForwardedResponse(queryPacket: ByteArray, dnsResponse: ByteArray): ByteArray {
        return wrapInIpUdp(queryPacket, dnsResponse)
    }

    private fun buildDnsResponse(queryDns: ByteArray): ByteArray {
        // Answer = name_pointer(2) + type(2) + class(2) + ttl(4) + rdlen(2) + rdata(4) = 16
        val answerLen = 16
        val response = ByteArray(queryDns.size + answerLen)
        System.arraycopy(queryDns, 0, response, 0, queryDns.size)

        // Set QR=1 (response), AA=1 (authoritative)
        response[2] = (response[2].toInt() or 0x84).toByte()
        // Set RA=1 (recursion available)
        response[3] = (response[3].toInt() or 0x80).toByte()

        // Set ANCOUNT = 1
        response[6] = 0
        response[7] = 1

        // Append answer record after the question section
        var offset = queryDns.size

        // Name: pointer to question name at DNS offset 12 → 0xC00C
        response[offset++] = 0xC0.toByte()
        response[offset++] = 0x0C.toByte()

        // Type A (1)
        response[offset++] = 0
        response[offset++] = 1

        // Class IN (1)
        response[offset++] = 0
        response[offset++] = 1

        // TTL = 300 seconds
        response[offset++] = 0
        response[offset++] = 0
        response[offset++] = 1
        response[offset++] = 0x2C.toByte()

        // RDLENGTH = 4
        response[offset++] = 0
        response[offset++] = 4

        // RDATA = 127.0.0.1
        response[offset++] = 127.toByte()
        response[offset++] = 0
        response[offset++] = 0
        response[offset] = 1

        return response
    }

    private fun wrapInIpUdp(queryPacket: ByteArray, dnsPayload: ByteArray): ByteArray {
        val ihl = (queryPacket[0].toInt() and 0x0F) * 4
        val totalLen = IP_HEADER_MIN_LEN + UDP_HEADER_LEN + dnsPayload.size
        val packet = ByteArray(totalLen)

        // ─── IP Header ──────────────────────────────────────────────────
        packet[0] = 0x45.toByte()  // IPv4, IHL=5 (20 bytes)
        packet[1] = 0              // DSCP/ECN
        packet[2] = ((totalLen shr 8) and 0xFF).toByte()
        packet[3] = (totalLen and 0xFF).toByte()
        // Identification = 0
        packet[6] = 0x40.toByte()  // Don't Fragment
        packet[8] = 64             // TTL
        packet[9] = 17             // Protocol: UDP

        // Source IP ← query's destination IP (our DNS server)
        System.arraycopy(queryPacket, 16, packet, 12, 4)
        // Destination IP ← query's source IP (requesting app)
        System.arraycopy(queryPacket, 12, packet, 16, 4)

        // IP Header checksum
        val checksum = calculateIpChecksum(packet)
        packet[10] = ((checksum shr 8) and 0xFF).toByte()
        packet[11] = (checksum and 0xFF).toByte()

        // ─── UDP Header ─────────────────────────────────────────────────
        val udpStart = IP_HEADER_MIN_LEN
        // Source port = 53
        packet[udpStart] = 0
        packet[udpStart + 1] = 53
        // Destination port ← query's source port
        System.arraycopy(queryPacket, ihl, packet, udpStart + 2, 2)
        // UDP length
        val udpLen = UDP_HEADER_LEN + dnsPayload.size
        packet[udpStart + 4] = ((udpLen shr 8) and 0xFF).toByte()
        packet[udpStart + 5] = (udpLen and 0xFF).toByte()
        // UDP checksum = 0 (optional for IPv4)

        // ─── DNS Payload ────────────────────────────────────────────────
        System.arraycopy(dnsPayload, 0, packet, udpStart + UDP_HEADER_LEN, dnsPayload.size)

        return packet
    }

    private fun calculateIpChecksum(header: ByteArray): Int {
        var sum = 0
        for (i in 0 until 20 step 2) {
            val word = ((header[i].toInt() and 0xFF) shl 8) or (header[i + 1].toInt() and 0xFF)
            sum += word
        }
        while (sum shr 16 != 0) {
            sum = (sum and 0xFFFF) + (sum shr 16)
        }
        return sum.inv() and 0xFFFF
    }
}
