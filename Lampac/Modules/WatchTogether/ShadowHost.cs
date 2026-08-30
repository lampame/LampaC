using Shared;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace WatchTogether
{
    /// <summary>
    /// Server-side state of a room the server eavesdrops on. The server never
    /// creates rooms: a room exists because a client opened its channel and a
    /// host announced a stream. Until the host vanishes, the server is a
    /// silent member; when the host is gone, it seamlessly takes over.
    /// </summary>
    public class ShadowRoom
    {
        public readonly object Lock = new();

        public string Channel;

        // host bookkeeping
        public string HostUid;
        public string HostPid;
        public string CreatorPid;
        public long HostSeen;
        public bool Hosting;
        public bool Stalled;

        // timeline
        public string State = "paused";
        public double Position;
        public long AtServerTime;
        public double Speed = 1.0;

        // metadata
        public string RoomName;
        public string Url;
        public string Title;
        public string Poster;
        public string Source;
        public string Type;
        public int Tmdb;

        /// <summary>Room code as announced by the host in the lobby (ad frames);
        /// lets the server list and re-announce rooms it keeps alive.</summary>
        public string Code;

        // server-side hold barrier (only while Hosting)
        public HashSet<string> HoldWaiting;
        public double HoldPosition;
        public Timer HoldTimer;

        public DateTime CreatedUtc = DateTime.UtcNow;
        public DateTime LastActivityUtc = DateTime.UtcNow;

        /// <summary>Display name of the member that announced the room.</summary>
        public string OwnerName;
    }

    /// <summary>A room advertisement overheard in the lobby channel.</summary>
    public class LobbyAd
    {
        public string SenderUid;
        public long Seen;
        public string Id;
        public string Name;
        public string Title;
        public string Poster;
        public string Owner;
        public int Members;
        public int Tmdb;
        public string Type;
        public bool Pwd;
    }

    /// <summary>
    /// The shadow host: the WatchTogether module acting as a state-keeping
    /// lparty client. While a real host is alive it silently listens and keeps
    /// a snapshot of the room (url, metadata, timeline). The moment the host's
    /// connection drops, the server steps in as the host on the wire - the
    /// members see one "host changed" toast and playback continues without a
    /// gap. When the original creator returns, the role is handed back.
    /// </summary>
    public static class ShadowHost
    {
        public const string ServerUid = "lampac";

        const string LobbyChannel = "lparty-lobby-v1";
        const string RoomPrefix = "lparty-r-";
        const int MetronomeMs = 2000;
        const int GcEveryMs = 60000;
        const double MaxAdvancableSeconds = 3600;
        const int HoldMaxMs = 15000;
        const long ReconnectGraceMs = 60000;
        const int AdTtlMs = 120000;

        static Timer metronomeTimer;
        static Timer gcTimer;
        static int initialized;

        static readonly ConcurrentDictionary<string, ShadowRoom> rooms = new();

        /// <summary>Room advertisements overheard in the lobby channel: the
        /// host announces its code publicly, so the server can keep listing
        /// rooms (including ones it keeps alive) without knowing passwords.</summary>
        static readonly ConcurrentDictionary<string, LobbyAd> lobbyAds = new();

        /// <summary>pid -> last hello, per channel; used to skip the join hold
        /// for members that are reconnecting rather than new.</summary>
        static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, long>> knownPids = new();

        /// <summary>The wire channel name for a room code. With an empty
        /// password this is computable server-side, which lets the server link
        /// a lobby advertisement to the room it belongs to.</summary>
        static string RoomChannelHash(string roomId, string password)
        {
            if (string.IsNullOrEmpty(roomId)) return null;
            string input = roomId.ToUpperInvariant() + "|" + (password ?? string.Empty);
            using var sha = SHA256.Create();
            byte[] hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return RoomPrefix + Convert.ToHexString(hashBytes).ToLowerInvariant()[..24];
        }

        // ---------------------------------------------------------------- lifecycle

        public static void Start()
        {
            if (Interlocked.Exchange(ref initialized, 1) == 1) return;
            metronomeTimer = new Timer(Metronome, null, MetronomeMs, MetronomeMs);
            gcTimer = new Timer(Gc, null, GcEveryMs, GcEveryMs);
        }

        public static void Stop()
        {
            if (Interlocked.Exchange(ref initialized, 0) == 0) return;
            metronomeTimer?.Dispose();
            gcTimer?.Dispose();
            metronomeTimer = gcTimer = null;
            rooms.Clear();
            knownPids.Clear();
        }

        // ---------------------------------------------------------------- relay hooks

        /// <summary>Whether the server's virtual member must exist in this
        /// channel right now (it is the acting host).</summary>
        public static bool ShouldHostChannel(string channelName)
        {
            if (channelName == LobbyChannel) return false;
            return rooms.TryGetValue(channelName, out var room) && room.Hosting;
        }

        public static void OnMemberJoined(string channelName, RelayChannel channel, RelayMember member)
        {
            if (channelName == LobbyChannel) return;
            if (!rooms.TryGetValue(channelName, out var room)) return;

            room.LastActivityUtc = DateTime.UtcNow;

            RelayServer.EnsureServerMember(channel);

            // Server-hosted room: answer the joiner like a host would.
            if (room.Hosting)
            {
                var pids = knownPids.GetOrAdd(channelName, _ => new ConcurrentDictionary<string, long>());
                AnswerHelloAsHost(room, channel, member, pids, 0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
            }
        }

        public static void OnMemberLeft(string channelName, RelayChannel channel, RelayMember member, bool tornDown)
        {
            if (channelName == LobbyChannel)
            {
                // A lobby agent disconnected: its ads die with it.
                foreach (var key in lobbyAds.Keys.ToList())
                    if (lobbyAds.TryGetValue(key, out var ad) && string.Equals(ad.SenderUid, member.Uid, StringComparison.Ordinal))
                        lobbyAds.TryRemove(key, out var dead);
                return;
            }

            if (!rooms.TryGetValue(channelName, out var room)) return;

            if (!room.Hosting && !string.IsNullOrEmpty(room.HostUid) && string.Equals(room.HostUid, member.Uid, StringComparison.Ordinal))
                BecomeHost(room, channel, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
        }

        public static void OnMessage(string channelName, RelayChannel channel, RelayMember member, JsonElement msg, long now)
        {
            if (channelName == LobbyChannel)
            {
                HandleLobby(member, msg, now);
                return;
            }

            var room = rooms.GetOrAdd(channelName, _ => new ShadowRoom { Channel = channelName });
            room.LastActivityUtc = DateTime.UtcNow;

            string t = GetString(msg, "t");
            string pid = GetString(msg, "u");
            string name = GetString(msg, "n");

            if (!string.IsNullOrEmpty(pid)) member.Pid = pid;
            if (!string.IsNullOrEmpty(name)) member.Name = name;

            switch (t)
            {
                case "state": ObserveState(room, channel, member, msg, now); break;
                case "sync": ObserveSync(room, member, msg, now); break;
                case "act": ObserveAct(room, msg, now); break;
                case "url": ObserveUrl(room, member, msg); break;
                case "buf": ObserveBuf(room, member, msg); break;
                case "host": HandleHostClaim(room, channel, member, msg, now); break;
                case "hello": HandleHello(room, channel, member, msg, now); break;
                case "ready": HandleReady(room, channel, member, now); break;
                case "bye": HandleBye(room, channel, member, now); break;
            }
        }

        /// <summary>The lobby is server-answered: hosts advertise their code
        /// in `ad` frames, the server caches them and re-announces rooms it
        /// keeps alive - so the list survives a host handover.</summary>
        static void HandleLobby(RelayMember member, JsonElement msg, long now)
        {
            string t = GetString(msg, "t");

            if (t == "ad")
            {
                if (msg.TryGetProperty("r", out var r) && r.ValueKind == JsonValueKind.Object)
                {
                    string id = GetString(r, "id");
                    if (!string.IsNullOrWhiteSpace(id) && id.Length <= 16)
                    {
                        lobbyAds[id] = new LobbyAd
                        {
                            SenderUid = member.Uid,
                            Seen = now,
                            Id = id,
                            Name = GetString(r, "name") ?? id,
                            Title = GetString(r, "title") ?? string.Empty,
                            Poster = GetString(r, "poster") ?? string.Empty,
                            Owner = GetString(r, "owner") ?? string.Empty,
                            Members = GetInt(r, "members"),
                            Tmdb = GetInt(r, "tmdb"),
                            Type = GetString(r, "type") ?? "movie",
                            Pwd = GetInt(r, "pwd") != 0,
                        };
                    }
                }
                return;
            }

            if (t != "who") return;

            var listed = new HashSet<string>(StringComparer.Ordinal);

            // Server-kept rooms first, with live member counts.
            foreach (var room in rooms.Values)
            {
                string code, name, title, poster, owner, type;
                int tmdb;
                bool hasUrl;
                lock (room.Lock)
                {
                    code = room.Code;
                    hasUrl = !string.IsNullOrEmpty(room.Url);
                    name = room.RoomName;
                    title = room.Title;
                    poster = room.Poster;
                    owner = room.OwnerName;
                    type = room.Type;
                    tmdb = room.Tmdb;
                }

                if (string.IsNullOrWhiteSpace(code) || listed.Contains(code) || !hasUrl) continue;

                var channel = RelayServer.TryGetChannel(room.Channel);
                int members = channel == null ? 0 : RelayServer.HumanUids(channel).Count;
                SendLobbyAd(member, now, code, name, title, poster, owner, members, true, tmdb, type);
                listed.Add(code);
            }

            // Cached ads from hosts. Provably alive (passwordless) rooms
            // outlive the TTL; the rest go stale with their announcer.
            foreach (var ad in lobbyAds.Values.OrderByDescending(a => a.Seen))
            {
                if (listed.Contains(ad.Id)) continue;

                string hash = RoomChannelHash(ad.Id, string.Empty);
                bool tracked = hash != null && rooms.ContainsKey(hash);
                if (now - ad.Seen > AdTtlMs && !tracked) continue;

                int members = ad.Members;
                if (tracked)
                {
                    var channel = RelayServer.TryGetChannel(hash);
                    if (channel != null) members = RelayServer.HumanUids(channel).Count;
                }

                SendLobbyAd(member, now, ad.Id, ad.Name, ad.Title, ad.Poster, ad.Owner, members, true, ad.Tmdb, ad.Type);
                listed.Add(ad.Id);
            }
        }

        static void SendLobbyAd(RelayMember target, long now, string id, string name, string title, string poster, string owner, int members, bool pwd, int tmdb, string type)
        {
            var frame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new
            {
                t = "ad",
                r = new { id, name, title, poster, owner, members, pwd = pwd ? 1 : 0, tmdb, type }
            });
            _ = RelayServer.SendAsync(target, frame);
        }

        // ---------------------------------------------------------------- observation

        static void ObserveState(ShadowRoom room, RelayChannel channel, RelayMember member, JsonElement msg, long now)
        {
            // While hosting, only the creator may take the room back.
            if (room.Hosting)
            {
                if (!string.Equals(member.Pid, room.CreatorPid, StringComparison.Ordinal))
                {
                    AssertHost(room, channel, now);
                    return;
                }
                Handback(room, channel, member, now);
            }

            string url = GetString(msg, "url");
            if (string.IsNullOrWhiteSpace(url)) return;

            lock (room.Lock)
            {
                room.HostUid = member.Uid;
                room.HostPid = GetString(msg, "own") ?? member.Pid ?? member.Uid;
                room.CreatorPid = room.HostPid;
                room.HostSeen = now;
                room.Hosting = false;
                room.Stalled = false;

                room.RoomName = GetString(msg, "rn") ?? room.RoomName;
                room.Url = url.Trim();
                room.Title = GetString(msg, "ti") ?? room.Title;
                room.Poster = GetString(msg, "po") ?? room.Poster;
                room.Tmdb = GetInt(msg, "tm");
                room.Source = GetString(msg, "src") ?? room.Source;
                room.Type = GetString(msg, "ty") ?? room.Type;
                room.Code = GetString(msg, "cd") ?? room.Code;
                room.OwnerName = member.Alias ?? room.OwnerName;

                room.State = GetString(msg, "s") == "playing" ? "playing" : "paused";
                double p = GetDouble(msg, "p");
                if (!double.IsNaN(p) && !double.IsInfinity(p) && p >= 0 && p <= 2592000) room.Position = p;
                room.Speed = GetSpeedOr(msg, room.Speed);
                room.AtServerTime = now;
            }

            RelayServer.EnsureServerMember(channel);
        }

        static void ObserveSync(ShadowRoom room, RelayMember member, JsonElement msg, long now)
        {
            string s = GetString(msg, "s") == "playing" ? "playing" : "paused";
            double p = GetDouble(msg, "p");
            double sp = GetSpeedOr(msg, room.Speed);

            lock (room.Lock)
            {
                if (room.Hosting) return;

                bool fromHost = string.Equals(room.HostUid, member.Uid, StringComparison.Ordinal) ||
                                (!string.IsNullOrEmpty(room.HostPid) && string.Equals(room.HostPid, member.Pid, StringComparison.Ordinal));

                if (!fromHost && string.IsNullOrEmpty(room.HostUid))
                {
                    // No known host yet: adopt the sender.
                    room.HostUid = member.Uid;
                    room.HostPid = member.Pid;
                    room.CreatorPid = member.Pid;
                    fromHost = true;
                }

                if (!fromHost) return;

                room.State = s;
                if (!double.IsNaN(p) && !double.IsInfinity(p) && p >= 0 && p <= 2592000) room.Position = p;
                room.Speed = sp;
                room.AtServerTime = now;
                room.HostSeen = now;
            }
        }

        static void ObserveAct(ShadowRoom room, JsonElement msg, long now)
        {
            // Acts from anyone move the room; the host's next sync re-asserts.
            if (room.Hosting) return;

            string s = GetString(msg, "s") == "playing" ? "playing" : "paused";
            double p = GetDouble(msg, "p");

            lock (room.Lock)
            {
                room.State = s;
                if (!double.IsNaN(p) && !double.IsInfinity(p) && p >= 0 && p <= 2592000) room.Position = p;
                room.Speed = GetSpeedOr(msg, room.Speed);
                room.AtServerTime = now;
            }
        }

        static void ObserveUrl(ShadowRoom room, RelayMember member, JsonElement msg)
        {
            lock (room.Lock)
            {
                bool fromHost = string.Equals(room.HostUid, member.Uid, StringComparison.Ordinal) ||
                                (!string.IsNullOrEmpty(room.HostPid) && string.Equals(room.HostPid, member.Pid, StringComparison.Ordinal));
                if (!fromHost || room.Hosting) return;

                string url = GetString(msg, "url");
                if (string.IsNullOrWhiteSpace(url)) return;

                room.Url = url.Trim();
                string ti = GetString(msg, "ti");
                if (!string.IsNullOrEmpty(ti)) room.Title = ti.Trim();
                room.State = "paused";
                room.Position = 0;
                room.AtServerTime = 0;
                room.Stalled = false;
            }
        }

        static void ObserveBuf(ShadowRoom room, RelayMember member, JsonElement msg)
        {
            lock (room.Lock)
            {
                bool fromHost = string.Equals(room.HostUid, member.Uid, StringComparison.Ordinal) ||
                                (!string.IsNullOrEmpty(room.HostPid) && string.Equals(room.HostPid, member.Pid, StringComparison.Ordinal));
                if (!fromHost) return;

                room.Stalled = GetBool(msg, "v");
            }
        }

        static void HandleHostClaim(ShadowRoom room, RelayChannel channel, RelayMember member, JsonElement msg, long now)
        {
            if (room.Hosting)
            {
                // Claims are dropped; the server re-asserts itself.
                AssertHost(room, channel, now);
                return;
            }

            string claimer = GetString(msg, "u");
            if (string.IsNullOrEmpty(claimer)) return;

            lock (room.Lock)
            {
                room.HostUid = member.Uid;
                room.HostPid = claimer;
                room.CreatorPid = claimer;
                room.HostSeen = now;
                room.Hosting = false;
            }
        }

        static void HandleHello(ShadowRoom room, RelayChannel channel, RelayMember member, JsonElement msg, long now)
        {
            string pid = GetString(msg, "u") ?? member.Pid;
            string name = GetString(msg, "n");
            string cd = GetString(msg, "cd");

            var pids = knownPids.GetOrAdd(channel.Name, _ => new ConcurrentDictionary<string, long>());
            long seenBefore = 0;
            if (!string.IsNullOrEmpty(pid))
            {
                pids.TryGetValue(pid, out seenBefore);
                pids[pid] = now;
            }

            // The first participant stating the code links the room to its listing.
            if (!string.IsNullOrWhiteSpace(cd))
            {
                lock (room.Lock)
                {
                    if (string.IsNullOrEmpty(room.Code)) room.Code = cd.Trim().ToUpperInvariant();
                }
            }

            if (!room.Hosting) return;

            if (!string.IsNullOrEmpty(pid) && string.Equals(pid, room.CreatorPid, StringComparison.Ordinal))
            {
                Handback(room, channel, member, now);
                return;
            }

            AnswerHelloAsHost(room, channel, member, pids, seenBefore, now);
        }

        /// <summary>Server-hosting room, newcomer arrived: introduce the room
        /// and, like a real host, freeze it while they buffer.</summary>
        static void AnswerHelloAsHost(ShadowRoom room, RelayChannel channel, RelayMember member, ConcurrentDictionary<string, long> pids, long seenBefore, long now)
        {
            if (!room.Hosting) return;

            RelayServer.EnsureServerMember(channel);
            SendStateFrame(room, member);

            bool reconnected = now - seenBefore < ReconnectGraceMs;

            bool playing;
            lock (room.Lock) playing = room.State == "playing" && !string.IsNullOrEmpty(room.Url);

            if (!playing) return;
            if (reconnected) return;

            StartHold(room, channel, now);
        }

        static void HandleReady(ShadowRoom room, RelayChannel channel, RelayMember member, long now)
        {
            lock (room.Lock)
            {
                if (!room.Hosting || room.HoldWaiting == null) return;
                room.HoldWaiting.Remove(member.Uid);
                if (room.HoldWaiting.Count > 0) return;
            }
            ReleaseHold(room, channel, now);
        }

        static void HandleBye(ShadowRoom room, RelayChannel channel, RelayMember member, long now)
        {
            bool wasHost;
            lock (room.Lock)
                wasHost = !room.Hosting && !string.IsNullOrEmpty(room.HostUid) && string.Equals(room.HostUid, member.Uid, StringComparison.Ordinal);

            if (wasHost) BecomeHost(room, channel, now);
        }

        // ---------------------------------------------------------------- host transitions

        static void BecomeHost(ShadowRoom room, RelayChannel channel, long now)
        {
            if (room.Hosting) return;

            lock (room.Lock)
            {
                room.Hosting = true;
                room.HostUid = ServerUid;
                room.HostSeen = now;
                room.Stalled = false;

                if (room.State == "playing" && room.AtServerTime > 0)
                {
                    // Continue exactly where the dead host was last heard.
                    double elapsed = (now - room.AtServerTime) / 1000.0;
                    if (elapsed > 0 && elapsed <= MaxAdvancableSeconds)
                        room.Position += elapsed * room.Speed;
                    room.AtServerTime = now;
                }
            }

            RelayServer.EnsureServerMember(channel);
            AssertHost(room, channel, now);

            double pos;
            string state;
            double speed;
            lock (room.Lock) { state = room.State; pos = room.Position; speed = room.Speed; }
            var sync = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "sync", u = ServerUid, s = state, p = pos, sp = speed });
            RelayServer.Broadcast(channel, null, sync);
        }

        static void Handback(ShadowRoom room, RelayChannel channel, RelayMember member, long now)
        {
            lock (room.Lock)
            {
                room.Hosting = false;
                room.HostUid = member.Uid;
                room.HostPid = member.Pid;
                room.HostSeen = now;
                room.Stalled = false;
            }

            var frame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "host", u = member.Pid, n = member.Name ?? member.Alias ?? string.Empty });
            RelayServer.Broadcast(channel, null, frame);
        }

        static void AssertHost(ShadowRoom room, RelayChannel channel, long now)
        {
            var frame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "host", u = ServerUid, n = "Lampac" });
            RelayServer.Broadcast(channel, null, frame);
        }

        // ---------------------------------------------------------------- hold barrier (server as host)

        static void StartHold(ShadowRoom room, RelayChannel channel, long now)
        {
            lock (room.Lock)
            {
                if (room.HoldWaiting != null) return; // already holding

                AdvanceClock(room, now);
                room.HoldPosition = room.Position;

                room.HoldWaiting = new HashSet<string>(RelayServer.HumanUids(channel), StringComparer.Ordinal);
                if (room.HoldWaiting.Count == 0) return;
            }

            var holdFrame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "hold", u = ServerUid, p = room.HoldPosition, sp = room.Speed });
            RelayServer.Broadcast(channel, null, holdFrame);

            lock (room.Lock)
            {
                room.HoldTimer?.Dispose();
                room.HoldTimer = new Timer(_ =>
                {
                    var ch = RelayServer.TryGetChannel(room.Channel);
                    if (ch != null) ReleaseHold(room, ch, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
                }, null, HoldMaxMs, Timeout.Infinite);
            }
        }

        /// <summary>Freeze the clock base at the current position.</summary>
        static void AdvanceClock(ShadowRoom room, long now)
        {
            if (room.State == "playing" && room.AtServerTime > 0)
            {
                double elapsed = (now - room.AtServerTime) / 1000.0;
                if (elapsed > 0 && elapsed <= MaxAdvancableSeconds) room.Position += elapsed * room.Speed;
            }
            room.AtServerTime = now;
        }

        static void ReleaseHold(ShadowRoom room, RelayChannel channel, long now)
        {
            double position;
            lock (room.Lock)
            {
                room.HoldWaiting = null;
                room.HoldTimer?.Dispose();
                room.HoldTimer = null;
                room.State = "playing";
                room.Position = room.HoldPosition;
                room.AtServerTime = now;
                position = room.HoldPosition;
            }

            var goFrame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "go", u = ServerUid, p = position, sp = room.Speed });
            RelayServer.Broadcast(channel, null, goFrame);
        }

        // ---------------------------------------------------------------- metronome

        /// <summary>While the server hosts, nobody's player drives the clock:
        /// the metronome advances the room by wall time and beats every couple
        /// of seconds, exactly like the host heartbeats it replaces.</summary>
        static void Metronome(object _)
        {
            try
            {
                long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

                foreach (var room in rooms.Values)
                {
                    if (!room.Hosting) continue;
                    var channel = RelayServer.TryGetChannel(room.Channel);
                    if (channel == null) continue;

                    bool playing;
                    lock (room.Lock)
                    {
                        playing = room.State == "playing" && !room.Stalled;
                        if (playing && room.AtServerTime > 0)
                        {
                            double elapsed = (now - room.AtServerTime) / 1000.0;
                            if (elapsed > 0 && elapsed <= MaxAdvancableSeconds)
                                room.Position += elapsed * room.Speed;
                            room.AtServerTime = now;
                        }
                    }

                    if (!playing) continue;

                    double pos, speed;
                    string state;
                    lock (room.Lock) { pos = room.Position; speed = room.Speed; state = room.State; }

                    var frame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new { t = "sync", u = ServerUid, s = state, p = pos, sp = speed });
                    RelayServer.Broadcast(channel, null, frame);
                }
            }
            catch { }
        }

        // ---------------------------------------------------------------- gc

        static void Gc(object _)
        {
            try
            {
                var emptyLimit = DateTime.UtcNow.AddMinutes(-Math.Max(5, ModInit.conf.gc_empty_timeout_minutes));
                var lifeLimit = DateTime.UtcNow.AddHours(-Math.Max(1, ModInit.conf.gc_max_lifetime_hours));

                foreach (var room in rooms.Values.ToArray())
                {
                    bool hasHumans = false;
                    var channel = RelayServer.TryGetChannel(room.Channel);
                    if (channel != null)
                    {
                        lock (channel.Lock)
                            hasHumans = channel.Members.Keys.Any(u => !string.Equals(u, ServerUid, StringComparison.Ordinal));
                    }

                    bool expired = room.CreatedUtc < lifeLimit ||
                                   (!hasHumans && room.LastActivityUtc < emptyLimit);

                    if (expired)
                    {
                        rooms.TryRemove(room.Channel, out var deadRoom);
                        knownPids.TryRemove(room.Channel, out var deadPids);
                    }
                }

                long cutoff = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() - ReconnectGraceMs;
                foreach (var pids in knownPids.Values)
                {
                    foreach (var key in pids.Keys.ToList())
                    {
                        if (!pids.TryGetValue(key, out var seen) || seen < cutoff)
                            pids.TryRemove(key, out var deadPid);
                    }
                }

                long adCutoff = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() - AdTtlMs;
                foreach (var key in lobbyAds.Keys.ToList())
                {
                    if (!lobbyAds.TryGetValue(key, out var ad) || ad.Seen < adCutoff)
                        lobbyAds.TryRemove(key, out var deadAd);
                }
            }
            catch { }
        }

        // ---------------------------------------------------------------- helpers

        static void SendStateFrame(ShadowRoom room, RelayMember target)
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            double pos;
            string state;
            double speed;
            lock (room.Lock)
            {
                pos = room.Position;
                speed = room.Speed;
                state = room.State;
                if (state == "playing" && room.AtServerTime > 0)
                {
                    double elapsed = (now - room.AtServerTime) / 1000.0;
                    if (elapsed > 0 && elapsed <= MaxAdvancableSeconds) pos += elapsed * room.Speed;
                }
            }

            var frame = RelayServer.BuildMessageFrame(ServerUid, "Lampac", now, new
            {
                t = "state",
                rn = room.RoomName ?? string.Empty,
                own = ServerUid,
                url = room.Url ?? string.Empty,
                ti = room.Title ?? string.Empty,
                po = room.Poster ?? string.Empty,
                tm = room.Tmdb,
                src = room.Source ?? string.Empty,
                ty = room.Type ?? "movie",
                s = state,
                p = pos,
                sp = speed,
            });

            _ = RelayServer.SendAsync(target, frame);
        }

        static string GetString(JsonElement obj, string name)
        {
            if (obj.ValueKind != JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(name, out var el)) return null;
            if (el.ValueKind == JsonValueKind.String) return el.GetString();
            if (el.ValueKind == JsonValueKind.Null) return null;
            return el.ToString();
        }

        static double GetDouble(JsonElement obj, string name)
        {
            if (obj.ValueKind != JsonValueKind.Object) return 0;
            if (obj.TryGetProperty(name, out var el) && el.ValueKind == JsonValueKind.Number && el.TryGetDouble(out var val))
                return val;
            return 0;
        }

        static double GetSpeedOr(JsonElement obj, double fallback)
        {
            double v = GetDouble(obj, "sp");
            return v >= 0.25 && v <= 4.0 ? v : fallback;
        }

        static int GetInt(JsonElement obj, string name)
        {
            if (obj.ValueKind != JsonValueKind.Object) return 0;
            if (obj.TryGetProperty(name, out var el) && el.ValueKind == JsonValueKind.Number && el.TryGetInt32(out var val))
                return val;
            return 0;
        }

        static bool GetBool(JsonElement obj, string name)
        {
            if (obj.ValueKind != JsonValueKind.Object) return false;
            return obj.TryGetProperty(name, out var el) && el.ValueKind == JsonValueKind.True;
        }
    }
}
