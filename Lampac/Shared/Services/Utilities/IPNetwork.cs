namespace Shared.Services.Utilities;

public static class IPNetwork
{
    public static bool IsLocalIp(ReadOnlySpan<char> ip, bool forced = false)
    {
        if (ip.IsEmpty || (!forced && CoreInit.conf.BaseModule.NotCheckLocalIp))
            return false;

        // Если ip приходит в формате IPv4-mapped IPv6 (::ffff:192.168.0.1)
        int lastColon = ip.LastIndexOf(':');
        if (lastColon != -1 && ip.Contains(".", StringComparison.Ordinal))
            ip = ip.Slice(lastColon + 1);

        if (!System.Net.IPAddress.TryParse(ip, out System.Net.IPAddress addr))
            return false;

        // loopback (127.0.0.0/8 и ::1)
        if (System.Net.IPAddress.IsLoopback(addr))
            return true;

        if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork) // IPv4
        {
            Span<byte> bytes = stackalloc byte[4];
            if (!addr.TryWriteBytes(bytes, out _))
                return false;

            // 10.0.0.0/8
            if (bytes[0] == 10)
                return true;

            // 127.0.0.0/8
            if (bytes[0] == 127)
                return true;

            // 192.168.0.0/16
            if (bytes[0] == 192 && bytes[1] == 168)
                return true;

            // 172.16.0.0/12
            if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
                return true;

            return false;
        }

        if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6) // IPv6
        {
            Span<byte> bytes = stackalloc byte[16];
            if (!addr.TryWriteBytes(bytes, out _))
                return false;

            // fc00::/7 (Unique Local Address)
            if ((bytes[0] & 0xfe) == 0xfc)
                return true;

            // ::1 handled by IsLoopback above
            return false;
        }

        return false;
    }
}
