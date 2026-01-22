namespace Shared.Engine.Utilities
{
    public static class IPNetwork
    {
        public static bool IsLocalIp(string ip)
        {
            if (string.IsNullOrWhiteSpace(ip))
                return false;

            // Если ip приходит в формате IPv4-mapped IPv6 (::ffff:192.168.0.1)
            var lastColon = ip.LastIndexOf(':');
            if (lastColon != -1 && ip.Contains("."))
                ip = ip.Substring(lastColon + 1);

            if (!System.Net.IPAddress.TryParse(ip, out var addr))
                return false;

            // loopback (127.0.0.0/8 и ::1)
            if (System.Net.IPAddress.IsLoopback(addr))
                return true;

            if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork) // IPv4
            {
                var b = addr.GetAddressBytes(); // [a,b,c,d]
                                                // 10.0.0.0/8
                if (b[0] == 10) return true;
                // 127.0.0.0/8
                if (b[0] == 127) return true;
                // 192.168.0.0/16
                if (b[0] == 192 && b[1] == 168) return true;
                // 172.16.0.0/12  => 172.16.0.0 - 172.31.255.255
                if (b[0] == 172 && b[1] >= 16 && b[1] <= 31) return true;

                return false;
            }

            if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6) // IPv6
            {
                var b = addr.GetAddressBytes();
                // unique local fc00::/7 (first byte 0xfc or 0xfd)
                if ((b[0] & 0xfe) == 0xfc) return true;
                // ::1 handled by IsLoopback above
                return false;
            }

            return false;
        }


        public static ReadOnlySpan<char> ExtractHost(ReadOnlySpan<char> url)
        {
            int start = 0;
            url = url.Trim();

            int schemeIdx = url.IndexOf("://", StringComparison.Ordinal);
            if (schemeIdx >= 0)
            {
                start = schemeIdx + 3;
            }
            else if (url.StartsWith("//", StringComparison.Ordinal))
            {
                start = 2;
            }

            ReadOnlySpan<char> rest = url.Slice(start);

            int endRel = rest.IndexOfAny('/', '?', '#');
            int end = (endRel < 0) ? url.Length : start + endRel;

            // Срезаем порт: host:8080 -> host
            var hostPort = url.Slice(start, end - start);

            // IPv6: [::1]:8080 — аккуратнее: если начинается с '[', ищем ']'
            if (!hostPort.IsEmpty && hostPort[0] == '[')
            {
                int rb = hostPort.IndexOf(']');
                if (rb > 0)
                    return hostPort.Slice(0, rb + 1); // включает ']'
                return hostPort; // странный случай, но не падаем
            }

            int colon = hostPort.IndexOf(':');
            if (colon >= 0)
                return hostPort.Slice(0, colon);

            return hostPort;
        }
    }
}
