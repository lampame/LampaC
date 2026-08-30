using Core.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Text.Json;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WatchTogether
{
    /// <summary>
    /// Maps the lparty-compatible relay endpoint (/wt/c/{channel}) at app startup.
    /// Modules cannot map endpoints themselves, so this hooks the pipeline
    /// through an IStartupFilter registered in ModInit.Configure. The branch
    /// runs before the global pipeline (like /nws) so auth middlewares cannot
    /// gate raw websocket clients; RequestInfo is applied in-branch because
    /// the WAF reads its output.
    /// </summary>
    public class RelayStartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
        {
            return app =>
            {
                app.Map("/wt/c", relayApp =>
                {
                    relayApp.UseRequestInfo();
                    relayApp.UseWAF();
                    relayApp.UseWebSockets();
                    relayApp.Run(RelayServer.HandleWebSocketAsync);
                });

                next(app);
            };
        }
    }

    public class RelayMember
    {
        public string Uid { get; set; }
        public string Alias { get; set; }
        public bool Echo { get; set; }
        public WebSocket Socket { get; set; }
        public SemaphoreSlim SendLock { get; } = new(1, 1);

        /// <summary>LParty peer id (the u field of the member's messages).</summary>
        public string Pid { get; set; }
        public string Name { get; set; }

        public long RateSecond;
        public int RateCount;
    }

    public class RelayChannel
    {
        public string Name { get; set; }
        public readonly object Lock = new();
        public readonly Dictionary<string, RelayMember> Members = new();
    }

    /// <summary>
    /// Wire-compatible emulation of the itty.ws channel relay used by lparty
    /// clients: stateless broadcast groups with join/leave announcements, a
    /// member list and a server date on every frame (the date is what lparty
    /// uses for clock sync via message echo).
    /// </summary>
    public static class RelayServer
    {
        static long uidSeq = 0;
        static readonly ConcurrentDictionary<string, RelayChannel> Channels = new();

        public static RelayChannel TryGetChannel(string name) =>
            Channels.TryGetValue(name, out var channel) ? channel : null;

        /// <summary>Member uids excluding the server's virtual member.</summary>
        public static List<string> HumanUids(RelayChannel channel)
        {
            lock (channel.Lock)
                return channel.Members.Keys
                    .Where(u => !string.Equals(u, ShadowHost.ServerUid, StringComparison.Ordinal))
                    .ToList();
        }

        const int MaxMessageBytes = 16 * 1024;
        const int MaxMessagesPerSecond = 50;

        public static async Task HandleWebSocketAsync(HttpContext context)
        {
            if (!ModInit.conf.enable)
            {
                context.Response.StatusCode = 404;
                return;
            }

            if (!context.WebSockets.IsWebSocketRequest)
            {
                context.Response.StatusCode = 400;
                return;
            }

            // Inside Map("/wt/c") the request path is already without the prefix:
            // "/{channel}", so only the leading slash is stripped here.
            string path = context.Request.Path.Value ?? "/";
            string channelName = path.Length > 1 ? Uri.UnescapeDataString(path[1..]) : string.Empty;
            if (string.IsNullOrWhiteSpace(channelName) || channelName.Length > 128)
            {
                context.Response.StatusCode = 404;
                return;
            }

            bool echo = string.Equals(context.Request.Query["echo"].ToString(), "true", StringComparison.OrdinalIgnoreCase);
            string alias = context.Request.Query["as"].ToString() ?? string.Empty;
            if (alias.Length > 64) alias = alias[..64];

            int maxChannels = Math.Max(1, ModInit.conf.relay_max_channels);
            if (!Channels.ContainsKey(channelName) && Channels.Count >= maxChannels)
            {
                context.Response.StatusCode = 429;
                return;
            }

            var socket = await context.WebSockets.AcceptWebSocketAsync();

            var member = new RelayMember
            {
                Uid = "u" + Interlocked.Increment(ref uidSeq),
                Alias = alias,
                Echo = echo,
                Socket = socket
            };

            var channel = Channels.GetOrAdd(channelName, _ => new RelayChannel { Name = channelName });

            // A server-hosted room keeps its virtual member across channel
            // recreation: joiners must see total >= 2 or lparty clients
            // declare the room dead on arrival.
            if (ShadowHost.ShouldHostChannel(channelName))
                EnsureServerMember(channel);

            bool full = false;
            List<RelayMember> users;
            int total;
            lock (channel.Lock)
            {
                int maxClients = Math.Max(2, ModInit.conf.relay_max_clients_per_channel);
                if (channel.Members.Count >= maxClients)
                {
                    full = true;
                    users = new List<RelayMember>();
                    total = 0;
                }
                else
                {
                    channel.Members[member.Uid] = member;
                    users = new List<RelayMember>(channel.Members.Values);
                    total = users.Count;
                }
            }

            if (full)
            {
                _ = SendAsync(member, BuildErrorFrame(ServerNowMs(), "channel_full"));
                try { await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "channel_full", CancellationToken.None); } catch { }
                return;
            }

            long now = ServerNowMs();
            _ = SendAsync(member, BuildSelfJoinFrame(member.Uid, now, total, users));

            byte[] joinFrame = BuildForeignJoinFrame(member.Uid, member.Alias, now, total);
            Broadcast(channel, member.Uid, joinFrame);

            ShadowHost.OnMemberJoined(channelName, channel, member);

            try
            {
                await ReceiveLoop(channelName, channel, member);
            }
            catch { }
            finally
            {
                RemoveMember(channelName, channel, member);
            }
        }

        /// <summary>The server's virtual lparty member inside a channel: a
        /// silent observer while a real host is alive, the acting host after
        /// the host is gone.</summary>
        public static void EnsureServerMember(RelayChannel channel)
        {
            bool added = false;
            int total;
            lock (channel.Lock)
            {
                if (!channel.Members.ContainsKey(ShadowHost.ServerUid))
                {
                    channel.Members[ShadowHost.ServerUid] = new RelayMember { Uid = ShadowHost.ServerUid, Alias = "Lampac" };
                    added = true;
                }
                total = channel.Members.Count;
            }

            if (added)
                Broadcast(channel, null, BuildForeignJoinFrame(ShadowHost.ServerUid, "Lampac", ServerNowMs(), total));
        }

        static async Task ReceiveLoop(string channelName, RelayChannel channel, RelayMember member)
        {
            var socket = member.Socket;
            var buffer = new byte[8192];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close) break;

                using var ms = new MemoryStream();
                ms.Write(buffer, 0, result.Count);
                while (!result.EndOfMessage)
                {
                    if (ms.Length > MaxMessageBytes) throw new IOException("relay message too large");
                    result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    if (result.MessageType == WebSocketMessageType.Close) return;
                    ms.Write(buffer, 0, result.Count);
                }

                if (ms.Length == 0 || ms.Length > MaxMessageBytes) continue;

                if (!CheckRate(member))
                {
                    _ = SendAsync(member, BuildErrorFrame(ServerNowMs(), "rate_limited"));
                    continue;
                }

                JsonElement message;
                try
                {
                    using var doc = JsonDocument.Parse(ms.ToArray());
                    if (doc.RootElement.ValueKind != JsonValueKind.Object) continue;
                    message = doc.RootElement.Clone();
                }
                catch (JsonException)
                {
                    continue;
                }

                long now = ServerNowMs();

                // The echo feeds clock sync: it happens for every message.
                // Frames are broadcast verbatim; the shadow host only listens.
                if (member.Echo)
                {
                    byte[] echoFrame = BuildMessageFrame(member.Uid, member.Alias, ServerNowMs(), message);
                    _ = SendAsync(member, echoFrame);
                }

                byte[] frame = BuildMessageFrame(member.Uid, member.Alias, now, message);
                Broadcast(channel, member.Uid, frame);

                ShadowHost.OnMessage(channelName, channel, member, message, now);
            }
        }

        static bool CheckRate(RelayMember member)
        {
            long second = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (Interlocked.CompareExchange(ref member.RateSecond, second, second) != second)
            {
                member.RateSecond = second;
                member.RateCount = 0;
            }
            member.RateCount++;
            return member.RateCount <= MaxMessagesPerSecond;
        }

        public static void Broadcast(RelayChannel channel, string excludeUid, byte[] frame)
        {
            RelayMember[] targets;
            lock (channel.Lock)
            {
                if (channel.Members.Count == 0) return;
                targets = new RelayMember[channel.Members.Count];
                channel.Members.Values.CopyTo(targets, 0);
            }

            foreach (var target in targets)
            {
                if (string.Equals(target.Uid, excludeUid, StringComparison.Ordinal)) continue;
                _ = SendAsync(target, frame);
            }
        }

        static void RemoveMember(string channelName, RelayChannel channel, RelayMember member)
        {
            int total;
            bool tornDown = false;
            lock (channel.Lock)
            {
                if (!channel.Members.Remove(member.Uid, out _)) return;
                total = channel.Members.Count;
                bool onlyServer = total == 1 && channel.Members.ContainsKey(ShadowHost.ServerUid);

                if (total == 0 || onlyServer)
                {
                    tornDown = true;
                    if (Channels.TryRemove(channel.Name, out var stale) && !ReferenceEquals(stale, channel))
                    {
                        // A newer instance took the name; put it back.
                        Channels.TryAdd(channel.Name, stale);
                    }
                    if (onlyServer)
                        channel.Members.Remove(ShadowHost.ServerUid, out _);
                }
            }

            byte[] leaveFrame = BuildLeaveFrame(member.Uid, member.Alias, ServerNowMs(), total);
            Broadcast(channel, member.Uid, leaveFrame);

            ShadowHost.OnMemberLeft(channelName, channel, member, tornDown);

            try { member.Socket.Dispose(); } catch { }
        }

        public static async Task SendAsync(RelayMember member, byte[] payload)
        {
            try
            {
                await member.SendLock.WaitAsync();
                try
                {
                    if (member.Socket.State != WebSocketState.Open) return;
                    await member.Socket.SendAsync(new ArraySegment<byte>(payload), WebSocketMessageType.Text, true, CancellationToken.None);
                }
                finally
                {
                    member.SendLock.Release();
                }
            }
            catch { }
        }

        static long ServerNowMs() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        static byte[] BuildSelfJoinFrame(string uid, long date, int total, List<RelayMember> users)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "join");
                w.WriteBoolean("self", true);
                w.WriteString("uid", uid);
                w.WriteNumber("date", date);
                w.WriteNumber("total", total);
                w.WriteStartArray("users");
                foreach (var u in users)
                {
                    w.WriteStartObject();
                    w.WriteString("uid", u.Uid);
                    w.WriteString("alias", u.Alias ?? string.Empty);
                    w.WriteEndObject();
                }
                w.WriteEndArray();
                w.WriteEndObject();
            }
            return ms.ToArray();
        }

        static byte[] BuildForeignJoinFrame(string uid, string alias, long date, int total)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "join");
                w.WriteBoolean("self", false);
                w.WriteString("uid", uid);
                w.WriteString("alias", alias ?? string.Empty);
                w.WriteNumber("date", date);
                w.WriteNumber("total", total);
                w.WriteEndObject();
            }
            return ms.ToArray();
        }

        static byte[] BuildLeaveFrame(string uid, string alias, long date, int total)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "leave");
                w.WriteString("uid", uid);
                w.WriteString("alias", alias ?? string.Empty);
                w.WriteNumber("date", date);
                w.WriteNumber("total", total);
                w.WriteEndObject();
            }
            return ms.ToArray();
        }

        static byte[] BuildErrorFrame(long date, string message)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "error");
                w.WriteNumber("date", date);
                w.WriteString("message", message);
                w.WriteEndObject();
            }
            return ms.ToArray();
        }

        public static byte[] BuildMessageFrame(string uid, string alias, long date, JsonElement message)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "message");
                w.WriteString("uid", uid);
                w.WriteString("alias", alias ?? string.Empty);
                w.WriteNumber("date", date);
                w.WritePropertyName("message");
                message.WriteTo(w);
                w.WriteEndObject();
            }
            return ms.ToArray();
        }

        public static byte[] BuildMessageFrame(string uid, string alias, long date, object message)
        {
            using var ms = new MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("type", "message");
                w.WriteString("uid", uid);
                w.WriteString("alias", alias ?? string.Empty);
                w.WriteNumber("date", date);
                w.WritePropertyName("message");
                JsonSerializer.Serialize(w, message, message.GetType());
                w.WriteEndObject();
            }
            return ms.ToArray();
        }
    }
}
