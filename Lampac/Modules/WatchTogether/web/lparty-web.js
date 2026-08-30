/**
 * Port of the lparty.js protocol (Lampa watch-party) to a plain web page.
 * Wire-compatible: same channels, same messages, same timings.
 * Original: https://nrsua.github.io/lampa-nrs/lparty.js
 *
 * The transport is the itty.ws relay, which is stateless: it broadcasts inside a
 * channel and adds a server timestamp plus a member list. All room logic lives
 * here, so there is no server side to write.
 */

export const DEFAULT_RELAY = "{relay}";
export const LOBBY_CHANNEL = "lparty-lobby-v1";
export const ROOM_PREFIX = "lparty-r-";

/**
 * Copied verbatim from the original. These are calibrated against their relay and
 * their players: change them on one side only and two clients pull each other in
 * different directions, which is worse than no correction at all.
 */
export const TUNING = {
  toleranceS: 0.3,
  // Correction starts above correctOnS and only stops below toleranceS. Without that
  // hysteresis the rate flapped around a single threshold on every heartbeat.
  correctOnS: 0.7,
  hardSeekS: 1.5,
  // Native Apple HLS seeks coarsely and ignores playbackRate, so it gets a looser bound.
  hardSeekNativeS: 3.0,
  rateGain: 0.1,
  maxRateOffset: 0.1,
  rateResetMs: 4000,
  heartbeatMs: 2000,
  pingIntervalMs: 8000,
  echoTimeoutMs: 30000,
  reconnectMs: 4000,
  joinTimeoutMs: 6000,
  // The original 1500 was too tight: replies land ~1.2 s after the query and missed
  // the window. Purely local, so it does not affect wire compatibility.
  lobbyCollectMs: 2500,
  userActionMs: 2000,
  systemSyncMs: 500,
  initialLockMs: 3000,
  expectPlayMs: 500,

  // Buffering barrier, added in plugin 1.3.0. The host pauses everyone at one
  // position and waits for a `ready` from each participant it is holding for.
  holdMaxMs: 15000,
  holdBufferS: 6,
  holdMinBufferS: 2,
  holdStallMs: 3000,
  holdNudgeMs: 4000,

  rewindGraceMs: 2500,
  hardSeekCooldownMs: 3000,
  reconnectHelloMs: 60000,

  // User seeks
  seekGuardMs: 4000, // how long a position we set ourselves stays "ours"
  seekBroadcastMinMs: 2000, // a scrub is throttled into one trailing broadcast, never dropped
  seekMinJumpS: 1.0, // below this the position barely moved; nothing to announce
  pendingActMaxMs: 15000, // how long a peer's seek is retried before giving up

  // End of media. Purely local, like the two above: they change what we say and what we obey,
  // never the wire, so a Lampa peer needs no matching calibration.
  endSlackS: 1.0, // a reported position this near our own duration is a file running out
  reportGapMs: 1500, // how far apart two reports must be to say whether their sender moves
};

const NO_RANGES = -2;
const OUT_OF_RANGE = -1;

// ---------------------------------------------------------------- pure functions

/**
 * The original hashes UTF-8 bytes (unescape(encodeURIComponent(s))), so the built-in
 * crypto.subtle yields a byte-identical digest — verified against their own code.
 * Needs a secure context; GitHub Pages is always https, so that costs nothing.
 */
export async function sha256hex(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function roomChannel(roomId, password) {
  const hex = await sha256hex(
    (roomId || "").toUpperCase() + "|" + (password || ""),
  );
  return ROOM_PREFIX + hex.substr(0, 24);
}

export function newRoomId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no lookalike I/O/0/1
  let id = "";
  for (let i = 0; i < 6; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

/** Where the room should be right now, given it plays from basePosition since atServerTime. */
export function expectedPositionNow(state, basePosition, atServerTime, nowMs) {
  if (state !== "playing" || !atServerTime || atServerTime <= 0)
    return basePosition;
  const elapsedSec = (nowMs - atServerTime) / 1000;
  if (elapsedSec < 0 || elapsedSec > 3600) return basePosition; // garbage timestamp
  return basePosition + elapsedSec;
}

/**
 * diff = our position minus the expected one. Positive diff means we ran ahead.
 *
 * @param opts.correcting   already nudging the rate — keep going until inside toleranceS
 * @param opts.hardSeekS    threshold for giving up on rate and jumping
 * @param opts.canAdjustRate false for players that ignore playbackRate (native Apple HLS)
 */
export function syncDecision(diff, opts = {}, t = TUNING) {
  const {
    correcting = false,
    hardSeekS = t.hardSeekS,
    canAdjustRate = true,
  } = opts;
  const abs = Math.abs(diff);

  if (abs > hardSeekS) return { action: "seek", rate: 1 };

  // Enter correction only on a real gap, leave it only when properly closed.
  const enterAt = correcting ? t.toleranceS : t.correctOnS;
  if (canAdjustRate && abs > enterAt) {
    const offset = Math.max(
      -t.maxRateOffset,
      Math.min(t.maxRateOffset, diff * t.rateGain),
    );
    return { action: "rate", rate: 1 - offset };
  }

  return { action: "reset", rate: 1 };
}

/**
 * Whether a reported position is that sender's file running out rather than a place in it.
 * Lampa announces the end of an episode as a pause carrying the duration to the millisecond,
 * and obeyed literally that skips whatever is left here and parks on the last frame.
 *
 * Unknown or infinite duration — a player still loading, a live stream — answers no: there is
 * nothing to compare against, and a live stream has no end to be at.
 */
export function atMediaEnd(position, duration, t = TUNING) {
  if (!Number.isFinite(duration) || duration <= 0) return false;
  return position >= duration - t.endSlackS;
}

/**
 * Whether the sender of two reports is standing still while calling itself playing — a peer
 * refilling its buffer. Lampa's heartbeat repeats position and state without checking that
 * playback advanced, and each repeat read as the room having jumped backwards.
 *
 * @returns true / false, or null when these two reports cannot say (a different sender, a
 *          sender that is paused, less than one heartbeat apart, or a jump backwards, which is
 *          a seek and is heard as one)
 */
export function reportStalled(prev, report, t = TUNING) {
  if (!prev || prev.pid !== report.pid || !report.playing) return null;
  const gap = report.at - prev.at;
  if (gap < t.reportGapMs) return null;
  const moved = report.position - prev.position;
  if (moved < 0) return null;
  // Against the sender's own rate: at half speed a player covers half the gap, and flat
  // arithmetic would call that a stall — one peer picking 0.5x would stop everybody else.
  const due = (gap / 1000) * Math.max(0.05, report.speed || 1);
  return moved * 2 < due;
}

/** Take the sample with the lowest RTT — it is the least distorted one. */
export function pickOffset(samples) {
  if (!samples.length) return 0;
  let best = samples[0];
  for (const s of samples) if (s.rtt < best.rtt) best = s;
  return best.offset;
}

// ---------------------------------------------------------------- relay socket

class Sock {
  constructor({
    relay,
    channel,
    alias = "",
    echo = false,
    reconnect = false,
    onEvent = () => {},
  }) {
    this.relay = relay;
    this.channel = channel;
    this.alias = alias;
    this.echo = echo;
    this.reconnect = reconnect;
    this.onEvent = onEvent;
    this.ws = null;
    this.uid = null;
    this.members = [];
    this.closed = false;
    this.retryTimer = null;
    this.onReady = null;
  }

  url() {
    let q = "announce=true&list=true";
    if (this.echo) q += "&echo=true";
    if (this.alias) q += "&as=" + encodeURIComponent(this.alias);
    return this.relay + encodeURIComponent(this.channel) + "?" + q;
  }

  open() {
    if (this.closed) return;
    if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1))
      return;

    try {
      this.ws = new WebSocket(this.url());
    } catch (err) {
      this.scheduleRetry();
      return;
    }

    this.ws.onopen = () => this.onEvent({ kind: "open" });

    this.ws.onmessage = (e) => {
      let d;
      try {
        d = JSON.parse(e.data);
      } catch (err) {
        return;
      }
      if (!d) return;

      if (d.type === "join") {
        if (d.self) {
          this.uid = d.uid;
          this.members = [];
          for (const u of d.users || []) {
            if (!this.findMember(u.uid))
              this.members.push({ uid: u.uid, alias: u.alias || "" });
          }
          // The relay does not always list us among the users; host election counts
          // members, so we have to be in our own list.
          if (!this.findMember(this.uid))
            this.members.push({ uid: this.uid, alias: this.alias });
          this.onEvent({
            kind: "ready",
            date: d.date,
            total: d.total,
            members: this.members,
          });
        } else {
          if (!this.findMember(d.uid))
            this.members.push({ uid: d.uid, alias: d.alias || "" });
          this.onEvent({
            kind: "join",
            date: d.date,
            uid: d.uid,
            alias: d.alias || "",
            total: d.total,
          });
        }
        return;
      }

      if (d.type === "leave") {
        this.members = this.members.filter((m) => m.uid !== d.uid);
        this.onEvent({
          kind: "leave",
          date: d.date,
          uid: d.uid,
          alias: d.alias || "",
          total: d.total,
        });
        return;
      }

      if (d.type === "error") {
        this.onEvent({ kind: "error", date: d.date, text: d.message });
        return;
      }

      if (d.message && typeof d.message === "object") {
        this.onEvent({
          kind: "msg",
          date: d.date,
          uid: d.uid,
          alias: d.alias || "",
          msg: d.message,
          mine: d.uid === this.uid,
        });
      }
    };

    this.ws.onclose = () => {
      this.uid = null;
      this.members = [];
      this.onEvent({ kind: "close" });
      this.scheduleRetry();
    };

    this.ws.onerror = () => {};
  }

  scheduleRetry() {
    if (!this.reconnect || this.closed) return;
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.open();
    }, TUNING.reconnectMs);
  }

  findMember(uid) {
    return this.members.find((m) => m.uid === uid) || null;
  }

  alive() {
    return !!this.ws && this.ws.readyState === 1;
  }

  send(obj) {
    if (!this.alive()) return false;
    try {
      this.ws.send(JSON.stringify(obj));
      return true;
    } catch (err) {
      return false;
    }
  }

  close() {
    this.closed = true;
    clearTimeout(this.retryTimer);
    this.retryTimer = null;
    if (this.ws) {
      try {
        this.ws.close();
      } catch (err) {}
      this.ws = null;
    }
  }
}

// ---------------------------------------------------------------- room

const emptyMeta = () => ({
  title: "",
  poster: "",
  url: "",
  tmdb_id: 0,
  source: "",
  type: "",
});

export class Party {
  /**
   * @param video   the <video> element we drive
   * @param relay   relay base URL (itty.ws by default)
   * @param name    display name
   * @param publish whether to advertise the room in the lobby (like lparty_publish)
   * @param onEvent (type, payload) — notice | members | room | stream | left | error
   *
   * notice and error carry {key, ...params} rather than finished text: UI strings
   * live in i18n.js and the protocol module knows nothing about language.
   */
  constructor({
    video,
    relay = DEFAULT_RELAY,
    name = "",
    publish = true,
    onEvent = () => {},
  }) {
    this.video = video;
    this.name = name;
    this.publish = publish;
    this.onEvent = onEvent;
    this.setRelay(relay);

    // sessionStorage rather than localStorage: in this protocol our own pid arriving
    // from a foreign uid means "the same device reconnected", and the client drops the
    // stale session. With one id shared browser-wide, two tabs would evict each other.
    // The pid is opaque to Lampa, so this does not affect compatibility.
    this.pid = sessionStorage.getItem("lampac_unic_id");
    if (!this.pid) {
      this.pid = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem("lampac_unic_id", this.pid);
    }

    this.room = null;
    this.lobbyHost = null;
    this.inRoom = false;
    this.joining = false;
    this.joinTimer = null;
    this.createPending = false;
    this.createTimer = null;

    this.roomId = null;
    this.password = "";
    this.roomName = "";
    this.owner = null;
    this.meta = emptyMeta();
    this.pidByUid = {};

    this.serverTimeOffset = 0;
    this.pingSamples = [];
    this.echoSeq = 0;
    this.echoPending = {};
    this.pingTimer = null;
    this.watchdogTimer = null;

    this.isSystemSyncing = false;
    this.lastUserActionTime = 0;
    this.initialSyncLock = false;
    this.targetInitialState = null;
    this.expected = { seek: -1, play: false, pause: false };
    this.expectedSeekTimer = null;
    this.rateTimer = null;
    this.enforceTimer = null;
    this.buffering = false;
    this.bufferPaused = false;
    this.autoplayBlocked = false;

    this.rewindUntil = 0;
    this.lastHardSeekAt = 0;
    this.knownPids = {};
    // The last heartbeat we took a position from, to read its sender's own progress off two of
    // them, plus whether that sender is currently not moving.
    this.lastReport = null;
    this.hostStalled = false;

    // Set by the page when the stream plays through the browser's own HLS support
    // (Safari): that player ignores playbackRate and seeks coarsely.
    this.nativePlayback = false;
    this.correcting = false;

    this.seekGuardUntil = 0;
    this.lastKnownPosition = 0;
    this.lastSeekBroadcastAt = 0;
    this.pendingSeekBroadcast = null;
    this.pendingAct = null;

    this.holdActive = false;
    this.holdPosition = 0;
    this.holdWaiting = {};
    this.holdReadySent = false;
    this.holdTimer = null;
    this.holdBufferSeen = -1;
    this.holdBufferAt = 0;
    this.holdNudgeDone = false;

    this.#hookVideo();
    this.heartbeat = setInterval(() => this.#heartbeat(), TUNING.heartbeatMs);
    this.tick = setInterval(() => this.#tick(), 1000);
  }

  setRelay(relay) {
    let v = (relay || "").trim() || DEFAULT_RELAY;
    if (v.charAt(v.length - 1) !== "/") v += "/";
    this.relay = v;
  }

  displayName() {
    return (this.name || "").trim() || this.pid;
  }
  serverNow() {
    return Date.now() + this.serverTimeOffset;
  }
  iAmHost() {
    return !!this.owner && this.owner === this.pid;
  }
  memberCount() {
    return this.room ? this.room.members.length : 0;
  }

  emit(type, payload) {
    this.onEvent(type, payload);
  }

  /** Snapshot for the debug readout. */
  debug() {
    const best = this.pingSamples.length
      ? Math.min(...this.pingSamples.map((s) => s.rtt))
      : null;
    return {
      ws:
        this.room && this.room.ws
          ? ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.room.ws.readyState]
          : "NO_WS",
      room: this.roomId,
      host: this.owner,
      iAmHost: this.iAmHost(),
      members: this.memberCount(),
      offset: Math.round(this.serverTimeOffset),
      rtt: this.pingSamples.length
        ? this.pingSamples[this.pingSamples.length - 1].rtt
        : null,
      bestRtt: best,
      pending: Object.keys(this.echoPending).length,
      position: this.video ? this.video.currentTime : null,
      rate: this.video ? this.video.playbackRate : null,
      lock: this.initialSyncLock,
      hold: this.holdActive,
      holdWaiting: Object.keys(this.holdWaiting),
      buffered: this.video ? this.#bufferedAhead(this.video.currentTime) : null,
    };
  }

  // -------------------------------------------------------------- clock

  send(obj) {
    if (!this.room || !this.room.alive()) return false;
    obj.u = this.pid;
    obj.k = ++this.echoSeq;
    this.echoPending[obj.k] = Date.now();
    return this.room.send(obj);
  }

  #handleEcho(key, serverDate) {
    const t0 = this.echoPending[key];
    if (!t0) return;
    delete this.echoPending[key];

    const t1 = Date.now();
    const rtt = t1 - t0;
    this.pingSamples.push({ offset: serverDate + rtt / 2 - t1, rtt });
    if (this.pingSamples.length > 8) this.pingSamples.shift();
    this.serverTimeOffset = pickOffset(this.pingSamples);
  }

  #startClock() {
    this.#stopClock();
    this.pingTimer = setInterval(() => {
      if (this.room && this.room.alive()) this.send({ t: "ping" });
    }, TUNING.pingIntervalMs);

    // If no echo comes back within 30 s the socket is alive only on paper — drop and reconnect.
    this.watchdogTimer = setInterval(() => {
      if (!this.room || !this.room.alive()) return;
      const now = Date.now();
      for (const key of Object.keys(this.echoPending)) {
        if (now - this.echoPending[key] > TUNING.echoTimeoutMs) {
          this.echoPending = {};
          try {
            this.room.ws.close();
          } catch (err) {}
          return;
        }
      }
    }, 5000);
  }

  #stopClock() {
    clearInterval(this.pingTimer);
    this.pingTimer = null;
    clearInterval(this.watchdogTimer);
    this.watchdogTimer = null;
  }

  // -------------------------------------------------------------- lobby

  #ad() {
    return {
      id: this.roomId,
      name: this.roomName,
      title: this.meta.title || "",
      poster: this.meta.poster || "",
      owner: this.displayName(),
      members: this.memberCount(),
      pwd: this.password ? 1 : 0,
      tmdb: this.meta.tmdb_id || 0,
      type: this.meta.type || "movie",
    };
  }

  #startLobbyAgent() {
    this.#stopLobbyAgent();
    if (!this.publish) return;
    // Never advertise a passwordless room, even one we only joined or inherited as host.
    if (!this.password) return;

    this.lobbyHost = new Sock({
      relay: this.relay,
      channel: LOBBY_CHANNEL,
      echo: false,
      reconnect: true,
      onEvent: (e) => {
        if (e.kind !== "msg" || e.mine) return;
        if (!e.msg || e.msg.t !== "who") return;
        if (!this.inRoom || !this.roomId) return;
        // Spread the replies so a dozen rooms do not answer in one burst.
        setTimeout(
          () => {
            if (this.lobbyHost && this.inRoom)
              this.lobbyHost.send({ t: "ad", r: this.#ad() });
          },
          Math.floor(Math.random() * 350) + 50,
        );
      },
    });
    this.lobbyHost.open();
  }

  #stopLobbyAgent() {
    if (this.lobbyHost) {
      this.lobbyHost.close();
      this.lobbyHost = null;
    }
  }

  /** Collects room advertisements and returns the list. */
  browse() {
    return new Promise((resolve) => {
      const found = {};
      let finished = false;
      let timer = null;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        probe.close();
        resolve(
          Object.values(found).sort(
            (a, b) => (b.members || 0) - (a.members || 0),
          ),
        );
      };

      const probe = new Sock({
        relay: this.relay,
        channel: LOBBY_CHANNEL,
        echo: false,
        reconnect: false,
        onEvent: (e) => {
          if (e.kind === "ready") {
            probe.send({ t: "who" });
            // The window starts when the socket is ready, not when browse() is called:
            // connecting to the relay takes ~400 ms and ate a third of the budget, while
            // rooms answer with up to 400 ms of jitter plus two RTT legs.
            clearTimeout(timer);
            timer = setTimeout(finish, TUNING.lobbyCollectMs);
            return;
          }
          if (
            e.kind === "msg" &&
            !e.mine &&
            e.msg &&
            e.msg.t === "ad" &&
            e.msg.r &&
            e.msg.r.id
          ) {
            found[e.msg.r.id] = e.msg.r;
          }
        },
      });
      probe.open();

      // The relay never answered at all — do not hang forever.
      timer = setTimeout(finish, TUNING.lobbyCollectMs + TUNING.joinTimeoutMs);
    });
  }

  // -------------------------------------------------------------- join / leave

  async #connect(roomId, password, onReady) {
    if (this.room) {
      this.room.close();
      this.room = null;
    }

    this.roomId = roomId;
    this.password = password || "";

    const channel = await roomChannel(roomId, password);
    this.room = new Sock({
      relay: this.relay,
      channel,
      alias: this.displayName(),
      echo: true,
      reconnect: true,
      onEvent: (e) => this.#onRoomEvent(e),
    });
    this.room.onReady = onReady;
    this.room.open();
    this.#startClock();
  }

  async join(roomId, password, fallbackName) {
    this.joining = true;
    this.roomName = fallbackName || roomId;

    await this.#connect(roomId, password, (ev) => {
      // We are alone in the channel — no room exists for this code/password.
      if (ev.total <= 1) {
        this.#failJoin();
        return;
      }
      this.send({ t: "hello", n: this.displayName() });
    });

    clearTimeout(this.joinTimer);
    this.joinTimer = setTimeout(() => this.#failJoin(), TUNING.joinTimeoutMs);
  }

  #failJoin() {
    if (!this.joining) return;
    this.emit("error", { key: "join_failed" });
    this.leave(false);
  }

  async create({
    url,
    title = "",
    name = "",
    password = "",
    poster = "",
    tmdbId = 0,
    source = "",
    type = "movie",
  }) {
    if (this.createPending) return null;
    if (this.inRoom) {
      this.emit("error", {
        key: "already_in_room",
        name: this.roomName || this.roomId,
      });
      return null;
    }
    if (!url) {
      this.emit("error", { key: "need_url" });
      return null;
    }
    // A room in the lobby list is visible to strangers on a public relay — it needs a password.
    if (this.publish && !password) {
      this.emit("error", { key: "need_pwd_public" });
      return null;
    }

    this.createPending = true;
    const id = newRoomId();

    this.roomName = name || "Room-" + id;
    this.owner = this.pid;
    this.meta = { title, poster, url, tmdb_id: tmdbId, source, type };

    await this.#connect(id, password, () => {
      this.createPending = false;
      clearTimeout(this.createTimer);
      this.createTimer = null;

      this.inRoom = true;
      this.joining = false;
      this.initialSyncLock = false;
      this.targetInitialState = null;

      this.#startLobbyAgent();
      this.emit("room", this.info());
      this.emit("stream", {
        url: this.meta.url,
        title: this.meta.title || this.roomName,
        poster: this.meta.poster,
      });
      this.emit("notice", { key: "room_created", id });
    });

    clearTimeout(this.createTimer);
    this.createTimer = setTimeout(() => {
      this.createTimer = null;
      if (this.createPending) {
        this.createPending = false;
        this.emit("error", { key: "create_failed" });
        this.leave(false);
      }
    }, TUNING.joinTimeoutMs);

    return id;
  }

  leave(sendBye = true) {
    if (this.room) {
      if (sendBye && this.room.alive()) this.send({ t: "bye" });
      this.room.close();
      this.room = null;
    }
    this.#stopLobbyAgent();
    this.#stopClock();
    this.#reset();
    this.emit("left");
    this.emit("members", 0);
  }

  #reset() {
    this.#clearRate();
    clearTimeout(this.expectedSeekTimer);
    this.expectedSeekTimer = null;
    clearTimeout(this.enforceTimer);
    this.enforceTimer = null;
    clearTimeout(this.joinTimer);
    this.joinTimer = null;
    clearTimeout(this.createTimer);
    this.createTimer = null;

    this.expected = { seek: -1, play: false, pause: false };
    this.initialSyncLock = false;
    this.targetInitialState = null;
    this.isSystemSyncing = false;
    this.inRoom = false;
    this.joining = false;
    this.createPending = false;
    this.roomId = null;
    this.password = "";
    this.roomName = "";
    this.owner = null;
    this.meta = emptyMeta();
    this.pidByUid = {};
    this.echoPending = {};
    this.pingSamples = [];

    this.rewindUntil = 0;
    this.lastHardSeekAt = 0;
    this.knownPids = {};
    this.correcting = false;
    this.seekGuardUntil = 0;
    this.lastKnownPosition = 0;
    this.lastSeekBroadcastAt = 0;
    this.#clearPendingSync();
    this.holdActive = false;
    this.holdPosition = 0;
    this.holdWaiting = {};
    this.holdReadySent = false;
    this.#resetHoldProgress();
    clearTimeout(this.holdTimer);
    this.holdTimer = null;
  }

  info() {
    return {
      id: this.roomId,
      name: this.roomName,
      owner: this.owner,
      iAmHost: this.iAmHost(),
      members: this.memberCount(),
      meta: this.meta,
      password: this.password,
    };
  }

  /** The host switches stream/episode — everyone else follows. */
  setStream(url, title) {
    if (!this.inRoom || !this.iAmHost() || !url) return;
    this.meta.url = url;
    this.meta.title = title || "";
    // Followers drop the old file's timeline when the `url` reaches them; we are about to be
    // somewhere else entirely too, and nothing we recorded about the previous episode survives
    // the switch — see clearPendingSync.
    this.#clearPendingSync();
    this.send({ t: "url", url, ti: this.meta.title });
    this.emit("stream", {
      url,
      title: this.meta.title || this.roomName,
      poster: this.meta.poster,
    });
  }

  // -------------------------------------------------------------- buffering barrier

  /** Seconds of buffer available ahead of `position`, or NO_RANGES / OUT_OF_RANGE. */
  #bufferedAhead(position) {
    const vid = this.video;
    let ranges;
    try {
      ranges = vid.buffered;
    } catch (err) {
      return NO_RANGES;
    }
    if (!ranges || !ranges.length) return NO_RANGES;

    for (let i = 0; i < ranges.length; i++) {
      if (position >= ranges.start(i) - 1 && position <= ranges.end(i))
        return ranges.end(i) - position;
    }
    return OUT_OF_RANGE;
  }

  #resetHoldProgress() {
    this.holdBufferSeen = -1;
    this.holdBufferAt = Date.now();
    this.holdNudgeDone = false;
  }

  /** Are we buffered enough to resume? Also nudges a player that stopped filling. */
  #holdReadyNow() {
    const vid = this.video;
    if (!vid) return false;

    const now = Date.now();
    const ahead = this.#bufferedAhead(this.holdPosition);

    if (ahead > this.holdBufferSeen + 0.25) {
      this.holdBufferSeen = ahead;
      this.holdBufferAt = now;
    }

    if (ahead === NO_RANGES) return vid.readyState >= 3;
    if (ahead >= TUNING.holdBufferS) return true;
    if (vid.readyState >= 4 && ahead > 0) return true;

    const idle = now - (this.holdBufferAt || now);

    // The buffer stopped growing but we have something: waiting longer is pointless.
    if (ahead >= TUNING.holdMinBufferS && idle > TUNING.holdStallMs)
      return true;

    // Some players stall until poked; a tiny seek restarts the fill.
    if (
      !this.holdNudgeDone &&
      idle > TUNING.holdNudgeMs &&
      vid.readyState >= 1
    ) {
      this.holdNudgeDone = true;
      this.#setExpectedSeek(this.holdPosition);
      vid.currentTime = this.holdPosition + 0.05;
    }

    return false;
  }

  /** Host side: freeze everyone at the current position and wait for the newcomer. */
  #startJoinHold(newcomerPid) {
    if (!this.inRoom || !this.iAmHost()) return;
    const vid = this.video;

    if (!this.holdActive) {
      this.holdActive = true;
      this.holdPosition = vid ? vid.currentTime || 0 : 0;
      this.holdWaiting = {};
      this.holdReadySent = false;
      this.#resetHoldProgress();

      if (vid && !vid.paused) {
        this.#expectPause();
        vid.pause();
      }
      this.emit("notice", { key: "notice_hold" });
    }

    if (newcomerPid && newcomerPid !== this.pid)
      this.holdWaiting[newcomerPid] = true;

    this.send({ t: "hold", p: this.holdPosition });

    clearTimeout(this.holdTimer);
    this.holdTimer = setTimeout(() => this.#finishHold(), TUNING.holdMaxMs);
  }

  #markHoldReady(fromPid) {
    if (!this.holdActive || !this.iAmHost()) return;
    if (fromPid) delete this.holdWaiting[fromPid];
    this.#checkHoldDone();
  }

  #checkHoldDone() {
    if (!this.holdActive || !this.iAmHost()) return;
    if (Object.keys(this.holdWaiting).length) return;
    if (!this.#holdReadyNow()) return;
    this.#finishHold();
  }

  #finishHold() {
    if (!this.holdActive) return;
    const position = this.holdPosition;
    this.send({ t: "go", p: position });
    this.#releaseHold(position);
  }

  #releaseHold(position) {
    const wasHolding = this.holdActive;

    this.holdActive = false;
    this.holdWaiting = {};
    this.holdReadySent = false;
    this.#resetHoldProgress();
    clearTimeout(this.holdTimer);
    this.holdTimer = null;

    this.initialSyncLock = false;
    this.targetInitialState = null;

    if (wasHolding) this.emit("notice", { key: "notice_go" });

    const vid = this.video;
    if (!vid) return;

    if (
      typeof position === "number" &&
      Math.abs((vid.currentTime || 0) - position) > 0.5
    ) {
      this.#setExpectedSeek(position);
      vid.currentTime = position;
    }

    if (vid.paused) {
      this.#expectPlay();
      const p = vid.play();
      if (p && p.catch)
        p.catch(() => {
          this.expected.play = false;
        });
    }
  }

  /** Guest side: obey a hold from the host. */
  #applyHold(position) {
    this.holdActive = true;
    this.holdPosition = position || 0;
    this.holdReadySent = false;
    this.#resetHoldProgress();
    this.emit("notice", { key: "notice_hold" });

    const vid = this.video;
    if (!vid) return;

    if (!vid.paused) {
      this.#expectPause();
      vid.pause();
    }
    if (Math.abs((vid.currentTime || 0) - this.holdPosition) > 1) {
      this.#setExpectedSeek(this.holdPosition);
      vid.currentTime = this.holdPosition;
    }
  }

  #tick() {
    // Before the video check: a deferred act must be able to expire even when there is no
    // player, otherwise it silences the host heartbeat indefinitely.
    this.#applyPendingAct();

    const vid = this.video;
    if (!vid) return;

    this.#holdTick();

    // A seek of ours to the position we already occupy never produces a 'seeked' event,
    // which would keep the guard armed for its whole window and swallow the user's next seek.
    if (
      this.expected.seek >= 0 &&
      !vid.seeking &&
      Math.abs((vid.currentTime || 0) - this.expected.seek) <= 0.5
    )
      this.#clearExpectedSeek();

    if (!this.#seekIsOurs()) this.lastKnownPosition = vid.currentTime || 0;
  }

  #holdTick() {
    if (!this.holdActive) return;
    if (this.iAmHost()) {
      this.#checkHoldDone();
      return;
    }
    if (this.holdReadySent) return;
    if (!this.#holdReadyNow()) return;
    if (!this.send({ t: "ready" })) return;
    this.holdReadySent = true;
  }

  #isRewinding() {
    return Date.now() < this.rewindUntil;
  }

  /**
   * The user is scrubbing. Lampa gets this from its own rewind event; on the web the
   * closest signal is a seek we did not initiate. While it lasts we neither obey
   * incoming sync nor broadcast intermediate positions.
   */
  #onUserRewind() {
    if (!this.inRoom || this.initialSyncLock) return;
    this.rewindUntil = Date.now() + TUNING.rewindGraceMs;
    this.lastUserActionTime = Date.now();
    this.#clearExpectedSeek();
  }

  // -------------------------------------------------------------- receiving

  #onRoomEvent(e) {
    if (e.kind === "ready") {
      this.echoPending = {};
      if (this.room && this.room.onReady) {
        const cb = this.room.onReady;
        this.room.onReady = null;
        cb(e);
        return;
      }
      // Reconnected after a drop: introduce ourselves again.
      if (this.inRoom) {
        this.send({ t: "hello", n: this.displayName() });
        if (this.iAmHost()) this.#sendHostState();
      }
      this.emit("members", this.memberCount());
      return;
    }

    if (e.kind === "close" || e.kind === "join") {
      this.emit("members", this.memberCount());
      return;
    }
    if (e.kind === "error") {
      this.emit("error", { key: "relay_error", text: e.text });
      return;
    }
    if (e.kind === "leave") {
      this.#onMemberLeave(e);
      return;
    }
    if (e.kind !== "msg" || !e.msg) return;

    if (e.mine) {
      if (e.msg.k) this.#handleEcho(e.msg.k, e.date);
      return;
    }

    this.#handleMessage(e.msg, e);
  }

  #handleMessage(m, e) {
    if (m.u) this.pidByUid[e.uid] = m.u;

    // Our own pid from a foreign uid — another tab of ours opened and evicted this one.
    if (m.u === this.pid && m.t === "hello") {
      this.emit("error", { key: "kicked" });
      this.leave(false);
      return;
    }

    if (m.t === "hello") {
      if (!this.inRoom) return;
      this.emit("notice", { key: "joined", name: m.n || e.alias });

      // A hello from someone we saw within the last minute is a reconnect, not a new
      // viewer — freezing the room again for it would be pure noise.
      const seenAt = m.u ? this.knownPids[m.u] : 0;
      const reconnected =
        seenAt && Date.now() - seenAt < TUNING.reconnectHelloMs;
      if (m.u) this.knownPids[m.u] = Date.now();
      if (this.iAmHost() && !reconnected) this.#startJoinHold(m.u);

      setTimeout(
        () => {
          if (!this.inRoom) return;
          this.send({ t: "me", n: this.displayName() });
          if (this.iAmHost()) this.#sendHostState();
        },
        Math.floor(Math.random() * 250) + 50,
      );
      this.emit("members", this.memberCount());
      return;
    }

    if (m.t === "hold") {
      if (!this.inRoom && !this.joining) return;
      if (this.owner && m.u !== this.owner) return; // only the host may hold
      this.#applyHold(m.p || 0);
      return;
    }

    if (m.t === "ready") {
      this.#markHoldReady(m.u);
      return;
    }

    if (m.t === "go") {
      if (!this.inRoom && !this.joining) return;
      if (this.owner && m.u !== this.owner) return;
      this.#releaseHold(typeof m.p === "number" ? m.p : this.holdPosition);
      return;
    }

    if (m.t === "me") {
      this.emit("members", this.memberCount());
      return;
    }

    if (m.t === "state") {
      if (this.joining) this.#acceptRoomState(m, e.date);
      return;
    }

    if (m.t === "host") {
      this.owner = m.u;
      this.#clearPendingSync();
      this.emit("notice", { key: "host_changed", name: m.n || e.alias });
      this.emit("room", this.info());
      return;
    }

    if (m.t === "url") {
      if (!this.inRoom || !m.url) return;
      if (this.owner && m.u !== this.owner) return; // only the host may change the stream
      this.meta.url = m.url;
      this.meta.title = m.ti || this.meta.title;
      this.#clearPendingSync();
      this.emit("stream", {
        url: m.url,
        title: m.ti || this.roomName,
        poster: this.meta.poster,
      });
      return;
    }

    if (m.t === "buf") {
      // Our own player announces when it starts and stops refilling; Lampa never does, which is
      // what the reading off two heartbeats below is for. Only the reference member's, same rule
      // as a periodic sync — a guest's buffering is its own business.
      if (!this.inRoom) return;
      if (this.owner && m.u !== this.owner) return;
      this.hostStalled = !!m.v;
      if (this.hostStalled) this.#waitForHost();
      return;
    }

    if (m.t === "sync" || m.t === "act") {
      if (!this.inRoom) return;

      // A report at the end of our own file is that sender's episode running out, not a place to
      // follow it to: their client announces the end of an episode as a pause carrying the
      // duration, and obeyed literally it skipped whatever was left here and parked us on the
      // last frame. Dropped before the notice, because nobody paused anything: our own copy
      // plays out and the room's next `url` is heard as usual.
      if (atMediaEnd(m.p || 0, this.video ? this.video.duration : NaN)) return;

      if (m.t === "act" && m.v) {
        const key = {
          resumed: "act_resumed",
          playing: "act_resumed",
          paused: "act_paused",
          seeked: "act_seeked",
        }[m.v];
        if (key) this.emit("notice", { key, name: m.n || e.alias });
      }

      // Periodic sync is the host's word alone: the host ignores everyone else's and
      // guests ignore each other's. Explicit user actions (act) still come from anyone.
      if (
        m.t === "sync" &&
        (this.iAmHost() || (this.owner && m.u !== this.owner))
      )
        return;

      const state = m.s === "playing" ? "playing" : "paused";
      const position = m.p || 0;

      if (this.initialSyncLock) {
        this.targetInitialState = { state, position, atServerTime: e.date };
        return;
      }

      const vid = this.video;
      if (!vid) return;

      if (this.#isRewinding() || this.holdActive) return;
      // Our own action newer than two seconds outranks theirs. Answering with a counter
      // sync used to cause ping-pong, so now we simply stay put.
      if (Date.now() - this.lastUserActionTime < TUNING.userActionMs) return;

      // A seek of ours is waiting out the debounce, so the heartbeat cannot know about it
      // yet and its position is stale by definition. Explicit acts still get through.
      if (m.t === "sync" && this.pendingSeekBroadcast) return;

      // Whether the member we take positions from is actually moving, which its own two reports
      // answer and its state field does not: a peer that is refilling goes on saying "playing" at
      // the same position every heartbeat, and each of those read as the room having jumped
      // backwards — seeks in alternating directions while the room in truth sat still.
      if (m.t === "sync") {
        const report = {
          pid: m.u,
          position,
          playing: state === "playing",
          at: Date.now(),
          // Their protocol has no speed field, so its silence means 1 rather than nothing.
          speed: typeof m.sp === "number" ? m.sp : 1,
        };
        const verdict = reportStalled(this.lastReport, report);
        this.lastReport = report;
        if (verdict !== null) this.hostStalled = verdict;
      }

      if (this.hostStalled) {
        // A deliberate action outranks the wait: whoever sent it is plainly not stuck, and the
        // room is being moved on purpose. Only the heartbeats of a stalled member are ignored.
        if (m.t === "sync") {
          this.#waitForHost();
          return;
        }
        this.hostStalled = false;
      }

      // Anything newer supersedes a deferred seek; a stale snapshot must not outlive it.
      this.pendingAct = null;

      this.isSystemSyncing = true;
      this.#applySync(state, position, e.date);
      setTimeout(() => {
        this.isSystemSyncing = false;
      }, TUNING.systemSyncMs);

      // If an explicit seek could not land, keep it and retry rather than dropping it.
      // The threshold matches applySync's hard seek, so a drift it chose to close with
      // playbackRate is not mistaken for a missed jump.
      if (m.t === "act" && m.v === "seeked") {
        const target = expectedPositionNow(
          state,
          position,
          e.date,
          this.serverNow(),
        );
        if (
          Math.abs((vid.currentTime || 0) - target) > this.#hardSeekThreshold()
        ) {
          this.pendingAct = {
            state,
            position,
            atServerTime: e.date,
            at: Date.now(),
            until: Date.now() + TUNING.pendingActMaxMs,
          };
        }
      }
      return;
    }

    if (m.t === "bye") {
      this.emit("members", this.memberCount());
    }
  }

  #sendHostState() {
    this.send({
      t: "state",
      rn: this.roomName,
      own: this.owner || this.pid,
      url: this.meta.url,
      ti: this.meta.title,
      po: this.meta.poster,
      tm: this.meta.tmdb_id,
      src: this.meta.source,
      ty: this.meta.type,
      s: this.video && !this.video.paused ? "playing" : "paused",
      p: this.video ? this.video.currentTime || 0 : 0,
    });
  }

  #acceptRoomState(msg, atServerTime) {
    clearTimeout(this.joinTimer);
    this.joinTimer = null;
    this.joining = false;

    if (!msg.url) {
      this.emit("error", { key: "no_stream" });
      this.leave(true);
      return;
    }

    this.inRoom = true;
    this.roomName = msg.rn || this.roomName;
    this.owner = msg.own || null;
    this.meta = {
      title: msg.ti || "",
      poster: msg.po || "",
      url: msg.url,
      tmdb_id: msg.tm || 0,
      source: msg.src || "",
      type: msg.ty || "movie",
    };

    const state = msg.s === "playing" ? "playing" : "paused";
    const position = msg.p || 0;

    // A room paused at the very start has nothing to catch up to; the lock would only hurt.
    const needsInitialSync = state === "playing" || position > 0.5;
    this.initialSyncLock = needsInitialSync;
    this.targetInitialState = needsInitialSync
      ? { state, position, atServerTime }
      : null;

    this.emit("room", this.info());
    this.emit("notice", { key: "join_ok", name: this.roomName });
    this.emit("stream", {
      url: this.meta.url,
      title: this.meta.title || this.roomName,
      poster: this.meta.poster,
    });
    this.#startLobbyAgent();
  }

  #onMemberLeave(e) {
    const leaverPid = this.pidByUid[e.uid];
    delete this.pidByUid[e.uid];
    this.emit("members", this.memberCount());
    if (!this.inRoom) return;

    this.emit("notice", { key: "left_room", name: e.alias || null });

    // Someone we were holding for is gone — stop waiting for their `ready`.
    if (leaverPid && this.holdWaiting[leaverPid])
      this.#markHoldReady(leaverPid);

    if (!this.owner || leaverPid !== this.owner) return;

    // The host left: after half a second the member with the lowest uid takes over.
    setTimeout(() => {
      if (!this.inRoom || !this.room || !this.room.uid) return;
      if (this.#hostStillPresent()) return;

      const uids = [
        this.room.uid,
        ...this.room.members
          .map((m) => m.uid)
          .filter((u) => u !== this.room.uid),
      ].sort();
      if (uids[0] === this.room.uid) {
        this.owner = this.pid;
        this.#clearPendingSync();
        this.send({ t: "host", n: this.displayName() });
        this.emit("notice", { key: "you_are_host" });
        this.emit("room", this.info());
        this.#startLobbyAgent();
      }
    }, 500);
  }

  #hostStillPresent() {
    if (!this.owner) return false;
    if (this.owner === this.pid) return true;
    if (!this.room) return false;
    return this.room.members.some((m) => this.pidByUid[m.uid] === this.owner);
  }

  // -------------------------------------------------------------- sending and sync

  #sendSync(state, verb) {
    if (!this.inRoom || this.initialSyncLock || this.holdActive) return;
    const vid = this.video;
    if (!vid) return;

    if (verb)
      this.send({
        t: "act",
        s: state,
        p: vid.currentTime || 0,
        v: verb,
        n: this.displayName(),
      });
    else this.send({ t: "sync", s: state, p: vid.currentTime || 0 });
  }

  /** Only the host beats, and it reports pause as well — guests just follow. */
  #heartbeat() {
    if (
      !this.inRoom ||
      this.initialSyncLock ||
      this.isSystemSyncing ||
      this.holdActive
    )
      return;
    if (!this.iAmHost()) return;
    if (this.expected.seek !== -1) return;
    if (this.pendingAct) return;
    const vid = this.video;
    if (!vid) return;
    // A finished file reports its last frame for ever, and offered as the room's position that
    // drags everybody onto the end credits. Silence lets them play their own copy out and reach
    // the end themselves; the next `url` is what moves the room on.
    if (vid.ended) return;
    this.#sendSync(vid.paused ? "paused" : "playing", null);
  }

  #setExpectedSeek(pos) {
    this.expected.seek = pos;
    this.seekGuardUntil = Date.now() + TUNING.seekGuardMs;
    clearTimeout(this.expectedSeekTimer);
    this.expectedSeekTimer = setTimeout(() => {
      this.expectedSeekTimer = null;
      this.expected.seek = -1;
    }, TUNING.seekGuardMs);
  }

  #clearExpectedSeek() {
    clearTimeout(this.expectedSeekTimer);
    this.expectedSeekTimer = null;
    this.expected.seek = -1;
    this.seekGuardUntil = 0;
  }

  /** True while the position currently settling is one we set, not the user. */
  #seekIsOurs() {
    return Date.now() < this.seekGuardUntil;
  }

  #hardSeekThreshold() {
    return this.nativePlayback ? TUNING.hardSeekNativeS : TUNING.hardSeekS;
  }
  #canAdjustRate() {
    return !this.nativePlayback;
  }

  /**
   * Everything here carries a position that only means anything for the video that was
   * playing when it was recorded, so it must die with it or it lands on the next episode.
   * Called wherever the room's timeline is replaced: a media change, a new reference member,
   * leaving the room.
   */
  #clearPendingSync() {
    clearTimeout(this.pendingSeekBroadcast);
    this.pendingSeekBroadcast = null;
    this.pendingAct = null;
    // A reading off two reports needs both of them to come from one file, and a stall belongs to
    // the file it happened in.
    this.lastReport = null;
    this.hostStalled = false;
    // The cooldown belongs to the file we have left too: kept, a jump made at the end of the old
    // episode spent the arrival in the new one waiting it out.
    this.lastHardSeekAt = 0;
  }

  /**
   * Announce a seek the user made. Throttling defers the burst rather than dropping it:
   * a dropped seek means the host heartbeat drags everyone back to the old position two
   * seconds later, which is exactly the bug this replaces.
   */
  #broadcastUserSeek() {
    const vid = this.video;
    if (!vid) return;
    if (
      Math.abs((vid.currentTime || 0) - this.lastKnownPosition) <
      TUNING.seekMinJumpS
    )
      return;

    this.lastKnownPosition = vid.currentTime || 0;
    this.lastUserActionTime = Date.now();

    if (Date.now() - this.lastSeekBroadcastAt < TUNING.seekBroadcastMinMs) {
      // A debounce, not a periodic flush: a long scrub must end in ONE extra broadcast,
      // not one every interval — each of those costs everyone a hard seek.
      clearTimeout(this.pendingSeekBroadcast);
      this.pendingSeekBroadcast = setTimeout(() => {
        this.pendingSeekBroadcast = null;
        if (!this.inRoom || this.initialSyncLock || this.holdActive) return;
        const v = this.video;
        if (!v) return;
        this.lastSeekBroadcastAt = Date.now();
        this.lastKnownPosition = v.currentTime || 0;
        this.lastUserActionTime = Date.now();
        this.#sendSync(v.paused ? "paused" : "playing", "seeked");
      }, TUNING.seekBroadcastMinMs);
      return;
    }

    clearTimeout(this.pendingSeekBroadcast);
    this.pendingSeekBroadcast = null;
    this.lastSeekBroadcastAt = Date.now();
    this.#sendSync(vid.paused ? "paused" : "playing", "seeked");
  }

  /**
   * A peer's explicit seek that could not land — we were buffering, mid-seek or inside
   * the hard-seek cooldown — is kept and retried instead of dropped. Dropping it lets
   * our own heartbeat drag the peer back to where they came from.
   */
  #applyPendingAct() {
    const act = this.pendingAct;
    if (!act) return;

    if (Date.now() > act.until) {
      this.pendingAct = null;
      return;
    }
    // A retry must never outrank something the user did afterwards.
    if (this.lastUserActionTime > act.at) {
      this.pendingAct = null;
      return;
    }

    if (
      !this.inRoom ||
      this.initialSyncLock ||
      this.#isRewinding() ||
      this.holdActive
    )
      return;
    if (Date.now() - this.lastUserActionTime < TUNING.userActionMs) return;

    const vid = this.video;
    if (!vid || this.#videoBusy()) return;
    if (Date.now() - this.lastHardSeekAt <= TUNING.hardSeekCooldownMs) return;

    this.pendingAct = null;
    this.isSystemSyncing = true;
    this.#applySync(act.state, act.position, act.atServerTime);
    setTimeout(() => {
      this.isSystemSyncing = false;
    }, TUNING.systemSyncMs);
  }

  #expectPlay() {
    this.expected.play = true;
    setTimeout(() => {
      this.expected.play = false;
    }, TUNING.expectPlayMs);
  }

  #expectPause() {
    this.expected.pause = true;
    setTimeout(() => {
      this.expected.pause = false;
    }, TUNING.expectPlayMs);
  }

  #clearRate() {
    clearTimeout(this.rateTimer);
    this.rateTimer = null;
    if (this.video && this.video.playbackRate !== 1)
      this.video.playbackRate = 1;
  }

  /**
   * The member we follow is not moving, so neither are we: stopping where we stand is the whole
   * of the wait, and the first report that moves resumes us through the normal path. Deliberately
   * not announced — nobody paused anything, and saying it would stop the room for real.
   *
   * The room is not told we are waiting: the protocol has no message for it, and a member that is
   * waiting has nothing to add anyway.
   */
  #waitForHost() {
    const vid = this.video;
    if (!vid || vid.paused) return;
    if (this.initialSyncLock || this.holdActive || this.#isRewinding()) return;
    this.#expectPause();
    vid.pause();
  }

  #applySync(state, basePosition, atServerTime) {
    const vid = this.video;
    if (!vid || vid.currentTime === undefined) return;

    // While the player is starving there is nothing to correct: seeking or changing
    // rate mid-buffering only makes the stall longer.
    const busy = this.#videoBusy();

    if (busy) {
      this.#clearRate();
    } else {
      const expected = expectedPositionNow(
        state,
        basePosition,
        atServerTime,
        this.serverNow(),
      );
      const { action, rate } = syncDecision(vid.currentTime - expected, {
        correcting: this.correcting,
        hardSeekS: this.#hardSeekThreshold(),
        canAdjustRate: this.#canAdjustRate(),
      });

      if (action === "seek") {
        this.#clearRate();
        this.correcting = false;
        // Chained hard seeks fight each other; one every few seconds is enough.
        if (Date.now() - this.lastHardSeekAt > TUNING.hardSeekCooldownMs) {
          this.lastHardSeekAt = Date.now();
          this.#setExpectedSeek(expected);
          vid.currentTime = expected;
        }
      } else if (action === "rate") {
        this.correcting = true;
        if (Math.abs(vid.playbackRate - rate) > 0.005) vid.playbackRate = rate;
        clearTimeout(this.rateTimer);
        this.rateTimer = setTimeout(() => {
          this.rateTimer = null;
          if (vid.playbackRate !== 1) vid.playbackRate = 1;
        }, TUNING.rateResetMs);
      } else {
        this.correcting = false;
        this.#clearRate();
      }
    }

    if (state === "paused") this.autoplayBlocked = false;

    if (state === "paused" && !vid.paused) {
      this.#expectPause();
      if (vid.playbackRate !== 1) vid.playbackRate = 1;
      vid.pause();
      return;
    }

    // Not on a file that has run out: play() on an ended element seeks to the start first, so the
    // room's next heartbeat would restart the episode from zero and the correction would then drag
    // us back to the end. If the correction above moved us back into the file, we are no longer
    // ended and this does not bite — which is the case where playing on is what we want.
    if (state === "playing" && vid.paused && !busy && !vid.ended) {
      this.#expectPlay();
      const p = vid.play();
      if (p && p.catch)
        p.catch(() => {
          this.expected.play = false;
          this.autoplayBlocked = true;
          this.emit("error", { key: "autoplay_blocked" });
        });
    }
  }

  #videoBusy() {
    const vid = this.video;
    // A seek in flight is the loader working — same rule as buffering, do not fight it.
    // A long jump can stay seeking for many seconds, and correcting the position
    // mid-flight is exactly what dragged the seeker back to the old spot.
    return !!this.buffering || !vid || vid.readyState < 3 || !!vid.seeking;
  }

  #enforceInitial() {
    if (!this.initialSyncLock || !this.targetInitialState) return;
    const vid = this.video;
    const { state, position, atServerTime } = this.targetInitialState;
    const expected = expectedPositionNow(
      state,
      position,
      atServerTime,
      this.serverNow(),
    );

    if (Math.abs(vid.currentTime - expected) > 1) {
      this.#setExpectedSeek(expected);
      vid.currentTime = expected;
    }

    if (state === "paused") {
      this.#expectPause();
      vid.pause();
    } else {
      this.#expectPlay();
      const p = vid.play();
      if (p && p.catch)
        p.catch(() => {
          this.autoplayBlocked = true;
          this.emit("error", { key: "autoplay_blocked" });
        });
    }

    if (!this.enforceTimer) {
      this.enforceTimer = setTimeout(() => {
        this.enforceTimer = null;
        this.initialSyncLock = false;
        this.targetInitialState = null;
        this.expected.play = false;
        this.expected.pause = false;
      }, TUNING.initialLockMs);
    }
  }

  #hookVideo() {
    const vid = this.video;
    if (!vid) return;

    const enforce = () => this.#enforceInitial();
    vid.addEventListener("loadedmetadata", enforce);
    vid.addEventListener("canplay", enforce);

    // A pause caused by buffering is not a user action and must not be broadcast.
    vid.addEventListener("waiting", () => {
      this.buffering = true;
    });
    vid.addEventListener("canplay", () => {
      this.buffering = false;
    });
    vid.addEventListener("playing", () => {
      this.buffering = false;
    });

    vid.addEventListener("play", () => {
      if (this.initialSyncLock) {
        if (
          this.targetInitialState &&
          this.targetInitialState.state === "paused"
        )
          vid.pause();
        return;
      }
      const wasExpected = this.expected.play;
      this.expected.play = false;
      if (wasExpected) return;
      if (this.bufferPaused) {
        this.bufferPaused = false;
        return;
      }
      // The click that lifts a blocked autoplay only catches us up with a room that is
      // already playing. Announcing it would put a "resumed" in everyone's face for
      // something nobody resumed.
      if (this.autoplayBlocked) {
        this.autoplayBlocked = false;
        return;
      }
      if (this.#isRewinding()) {
        this.lastUserActionTime = Date.now();
        return;
      }
      this.lastUserActionTime = Date.now();
      this.#sendSync("playing", "resumed");
    });

    vid.addEventListener("pause", () => {
      clearTimeout(this.rateTimer);
      this.rateTimer = null;
      vid.playbackRate = 1;
      if (this.initialSyncLock) return;
      const wasExpected = this.expected.pause;
      this.expected.pause = false;
      if (wasExpected) return;
      // Running out of file is not the viewer pausing, though the element leaves exactly the same
      // state behind: paused, at the duration, buffer full. Announced as an act it stopped the
      // whole room — including whoever had already moved on to the next episode — and put
      // "<us> paused" on every screen. Said nothing, the room plays on.
      if (vid.ended) return;
      if (this.buffering || vid.readyState < 3) {
        this.bufferPaused = true;
        return;
      }
      if (this.#isRewinding()) {
        this.lastUserActionTime = Date.now();
        return;
      }
      this.lastUserActionTime = Date.now();
      this.#sendSync("paused", "paused");
    });

    // Announce the jump when it STARTS, not when it settles: currentTime already holds the
    // target, while a long jump can stay unsettled for many seconds — and an unannounced
    // seeker gets dragged back by the host heartbeat the moment its buffer is ready.
    vid.addEventListener("seeking", () => {
      // Deliberately NOT gated on isSystemSyncing: that flag stays up for 500 ms after
      // every applied sync, a quarter of the time at a 2 s heartbeat, and it swallowed any
      // user seek started in that window. seekIsOurs() asks the real question — did we
      // move the position, or did the user?
      if (this.initialSyncLock || this.#seekIsOurs()) return;
      this.#onUserRewind();
      this.#broadcastUserSeek();
    });

    vid.addEventListener("seeked", () => {
      if (!this.isSystemSyncing) {
        clearTimeout(this.rateTimer);
        this.rateTimer = null;
        vid.playbackRate = 1;
      }
      if (this.initialSyncLock) {
        if (this.targetInitialState) {
          const { state, position, atServerTime } = this.targetInitialState;
          const expected = expectedPositionNow(
            state,
            position,
            atServerTime,
            this.serverNow(),
          );
          if (Math.abs(vid.currentTime - expected) > 1) {
            this.#setExpectedSeek(expected);
            vid.currentTime = expected;
          }
        }
        return;
      }
      if (this.isSystemSyncing) return;

      // We moved it, so there is nothing to announce — just stop guarding.
      if (this.#seekIsOurs()) {
        this.#clearExpectedSeek();
        this.lastKnownPosition = vid.currentTime || 0;
        return;
      }

      if (this.expected.seek !== -1) this.#clearExpectedSeek();

      // Usually already announced on 'seeking'; this covers players that skip that event.
      this.#broadcastUserSeek();
    });
  }

  destroy() {
    clearInterval(this.heartbeat);
    clearInterval(this.tick);
    this.leave(true);
  }
}
