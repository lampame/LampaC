(function () {
  "use strict";

  if (window.WatchTogether_plugin_started) {
    console.log("[WatchTogether]", "Already running.");
    return;
  }
  window.WatchTogether_plugin_started = true;

  var META = {
    name: "WatchTogether",
    version: "2.0.0",
    author: "arabianq, nrsua, levende",
  };

  var DEFAULT_RELAY = "{relay}";
  var DEFAULT_INVITE = "{invite}";
  // Wire-protocol constants shared with all lparty clients (JustPlus etc.) — do not rename.
  var LOBBY_CHANNEL = "lparty-lobby-v1";
  var ROOM_PREFIX = "lparty-r-";

  var _rawLang = (Lampa.Storage.get("language") || "en").toLowerCase();
  var i18n = {
    uk: {
      menu_title: "WatchTogether",
      settings_title: "WatchTogether",
      param_show_head: "Відображати WatchTogether на головній",
      param_show_head_descr:
        "Кнопка WatchTogether у верхній панелі головного екрана.",
      param_name: "Ім'я користувача",
      param_name_descr:
        "Як вас бачитимуть інші в кімнатах. Якщо очистити - буде згенеровано випадкове ім'я.",
      param_use_pwd: "Використовувати пароль",
      param_use_pwd_descr:
        "Запитувати пароль при створенні кімнати та підставляти у власні кімнати.",
      param_pwd: "Пароль за замовчуванням",
      param_pwd_descr: "Буде використано при створенні кімнат із паролем.",
      param_publish: "Показувати кімнату в списку",
      param_publish_descr:
        "Вимкніть, щоб до вашої кімнати можна було зайти лише за кодом.",
      param_relay: "Адреса реле",
      param_relay_descr: "WebSocket-реле. За замовчуванням " + DEFAULT_RELAY,
      param_invite: "Адреса запрошення",
      param_invite_descr:
        "Базове посилання для QR-коду. За замовчуванням " + DEFAULT_INVITE,
      head_title: "WatchTogether - список кімнат",
      create_btn: "Створити кімнату за посиланням",
      join_code_btn: "Увійти за кодом кімнати",
      full_card_btn: "WatchTogether - Дивитися з друзями",
      settings_open_rooms: "Відкрити список кімнат",
      settings_open_rooms_descr:
        "Показує список доступних кімнат і дозволяє створити свою",
      empty_list: "Відкритих кімнат немає",
      searching: "Пошук кімнат...",
      input_url: "Посилання на потік (m3u8 / mp4)",
      input_room_name: "Назва кімнати",
      input_password: "Пароль кімнати",
      input_join_password: "Введіть пароль кімнати",
      input_room_code: "Код кімнати",
      connecting: "Підключення...",
      create_fail: "Не вдалося створити кімнату",
      create_ok: function (n) {
        return 'Кімнату "' + n + '" створено';
      },
      room_code: function (c) {
        return "Код кімнати: " + c;
      },
      join_ok: function (n) {
        return 'Ви увійшли до кімнати "' + n + '"';
      },
      no_room: "Кімнату не знайдено або невірний пароль",
      no_stream: "У цій кімнаті немає потоку",
      kicked: "Ви увійшли до цієї кімнати з іншого пристрою",
      host_left: "Хост покинув кімнату - перегляд завершено",
      net_err: "Помилка мережі",
      need_url: "Не задано посилання на потік",
      publish_needs_pwd: "Немає у публічному списку: доступ лише за кодом",
      create_from_player: "Поділитися останнім потоком",
      pending_share:
        "Запустіть відтворення - кімнату буде створено автоматично",
      label_owner: "Хост",
      label_members: "Глядачів",
      badge_room: "Кімната",
      badge_viewers: "Глядачів",
      notice_joined: function (n) {
        return n + " приєднався";
      },
      notice_left: function (n) {
        return n + " покинув кімнату";
      },
      notice_paused: function (n) {
        return n + " поставив паузу";
      },
      notice_resumed: function (n) {
        return n + " продовжив відтворення";
      },
      notice_seeked: function (n) {
        return n + " перемотав";
      },
      notice_host_changed: function (n) {
        return "Новий хост: " + n;
      },
      player_create_descr: "Створити кімнату на цей потік",
      player_qr_descr: "Показати QR-код для запрошення друзів",
      qr_title: "Приєднатися до кімнати",
      qr_hint: "Скануйте камерою телефона",
      qr_copy: "Копіювати посилання",
      qr_share: "Поділитися",
      qr_copied: "Посилання скопійовано",
      qr_copy_fail: "Не вдалося скопіювати посилання",
      already_in_room: function (n) {
        return 'Ви вже в кімнаті "' + n + '"';
      },
      leave_btn: "Покинути кімнату",
      left_ok: "Ви покинули кімнату",
      notice_hold: "Пауза - чекаємо, поки всі завантажать буфер",
      notice_go: "Усі готові - продовжуємо",
    },
    en: {
      menu_title: "WatchTogether",
      settings_title: "WatchTogether",
      param_show_head: "Show WatchTogether on the main screen",
      param_show_head_descr:
        "WatchTogether button in the top bar of the main screen.",
      param_name: "Display name",
      param_name_descr:
        "How others see you in rooms. Clear it to generate a random name.",
      param_use_pwd: "Use password",
      param_use_pwd_descr:
        "Ask for password when creating a room and prefill your default.",
      param_pwd: "Default password",
      param_pwd_descr: "Used when creating password-protected rooms.",
      param_publish: "List room publicly",
      param_publish_descr: "Turn off to make your room reachable by code only.",
      param_relay: "Relay address",
      param_relay_descr: "WebSocket relay. Default is " + DEFAULT_RELAY,
      param_invite: "Invite address",
      param_invite_descr:
        "Base link used in the QR code. Default is " + DEFAULT_INVITE,
      head_title: "WatchTogether - available rooms",
      create_btn: "Create room from URL",
      join_code_btn: "Join by room code",
      full_card_btn: "WatchTogether - Watch with friends",
      settings_open_rooms: "Open room browser",
      settings_open_rooms_descr:
        "Shows the list of available rooms and lets you create your own",
      empty_list: "No open rooms",
      searching: "Looking for rooms...",
      input_url: "Stream URL (m3u8 / mp4)",
      input_room_name: "Room name",
      input_password: "Room password",
      input_join_password: "Enter room password",
      input_room_code: "Room code",
      connecting: "Connecting...",
      create_fail: "Failed to create room",
      create_ok: function (n) {
        return 'Room "' + n + '" created';
      },
      room_code: function (c) {
        return "Room code: " + c;
      },
      join_ok: function (n) {
        return 'Joined room "' + n + '"';
      },
      no_room: "Room not found or wrong password",
      no_stream: "This room has no stream",
      kicked: "You joined this room from another device",
      host_left: "Host left the room - session ended",
      net_err: "Network error",
      need_url: "Stream URL is empty",
      publish_needs_pwd: "Not in the public list: access by code only",
      create_from_player: "Share last stream",
      pending_share: "Start playback - the room will be created automatically",
      label_owner: "Host",
      label_members: "Viewers",
      badge_room: "Room",
      badge_viewers: "Viewers",
      notice_joined: function (n) {
        return n + " joined";
      },
      notice_left: function (n) {
        return n + " left the room";
      },
      notice_paused: function (n) {
        return n + " paused";
      },
      notice_resumed: function (n) {
        return n + " resumed playback";
      },
      notice_seeked: function (n) {
        return n + " seeked";
      },
      notice_host_changed: function (n) {
        return "New host: " + n;
      },
      player_create_descr: "Create a room for this stream",
      player_qr_descr: "Show a QR code to invite friends",
      qr_title: "Join the room",
      qr_hint: "Scan with your phone camera",
      qr_copy: "Copy link",
      qr_share: "Share",
      qr_copied: "Link copied",
      qr_copy_fail: "Could not copy the link",
      already_in_room: function (n) {
        return 'You are already in room "' + n + '"';
      },
      leave_btn: "Leave room",
      left_ok: "You left the room",
      notice_hold: "Paused - waiting for everyone to buffer",
      notice_go: "Everyone is ready - resuming",
    },
    ru: {
      menu_title: "WatchTogether",
      settings_title: "WatchTogether",
      param_show_head: "Показывать WatchTogether на главной",
      param_show_head_descr:
        "Кнопка WatchTogether в верхней панели главного экрана.",
      param_name: "Имя пользователя",
      param_name_descr:
        "Как вас будут видеть в комнатах. Если очистить - будет сгенерировано случайное имя.",
      param_use_pwd: "Использовать пароль",
      param_use_pwd_descr:
        "Запрашивать пароль при создании комнаты и подставлять в свои комнаты.",
      param_pwd: "Пароль по умолчанию",
      param_pwd_descr: "Будет использоваться при создании комнат с паролем.",
      param_publish: "Показывать комнату в списке",
      param_publish_descr:
        "Выключите, чтобы в вашу комнату можно было войти только по коду.",
      param_relay: "Адрес реле",
      param_relay_descr: "WebSocket-реле. По умолчанию " + DEFAULT_RELAY,
      param_invite: "Адрес приглашения",
      param_invite_descr:
        "Базовая ссылка для QR-кода. По умолчанию " + DEFAULT_INVITE,
      head_title: "WatchTogether - список комнат",
      create_btn: "Создать комнату по ссылке",
      join_code_btn: "Войти по коду комнаты",
      full_card_btn: "WatchTogether - Смотреть с друзьями",
      settings_open_rooms: "Открыть список комнат",
      settings_open_rooms_descr:
        "Показывает список доступных комнат и позволяет создать свою",
      empty_list: "Открытых комнат нет",
      searching: "Поиск комнат...",
      input_url: "Ссылка на поток (m3u8 / mp4)",
      input_room_name: "Название комнаты",
      input_password: "Пароль комнаты",
      input_join_password: "Введите пароль комнаты",
      input_room_code: "Код комнаты",
      connecting: "Подключение...",
      create_fail: "Не удалось создать комнату",
      create_ok: function (n) {
        return 'Комната "' + n + '" создана';
      },
      room_code: function (c) {
        return "Код комнаты: " + c;
      },
      join_ok: function (n) {
        return 'Вошли в комнату "' + n + '"';
      },
      no_room: "Комната не найдена или неверный пароль",
      no_stream: "В этой комнате нет потока",
      kicked: "Вы вошли в комнату с другого устройства",
      host_left: "Хост покинул комнату - просмотр завершён",
      net_err: "Ошибка сети",
      need_url: "Не задана ссылка на поток",
      publish_needs_pwd: "Нет в публичном списке: доступ только по коду",
      create_from_player: "Поделиться последним потоком",
      pending_share:
        "Запустите воспроизведение - комната будет создана автоматически",
      label_owner: "Хост",
      label_members: "Зрителей",
      badge_room: "Комната",
      badge_viewers: "Зрителей",
      notice_joined: function (n) {
        return n + " присоединился";
      },
      notice_left: function (n) {
        return n + " покинул комнату";
      },
      notice_paused: function (n) {
        return n + " поставил паузу";
      },
      notice_resumed: function (n) {
        return n + " продолжил воспроизведение";
      },
      notice_seeked: function (n) {
        return n + " перемотал";
      },
      notice_host_changed: function (n) {
        return "Новый хост: " + n;
      },
      player_create_descr: "Создать комнату с этим потоком",
      player_qr_descr: "Показать QR-код для приглашения друзей",
      qr_title: "Присоединиться к комнате",
      qr_hint: "Сканируйте камерой телефона",
      qr_copy: "Копировать ссылку",
      qr_share: "Поделиться",
      qr_copied: "Ссылка скопирована",
      qr_copy_fail: "Не удалось скопировать ссылку",
      already_in_room: function (n) {
        return 'Вы уже в комнате "' + n + '"';
      },
      leave_btn: "Покинуть комнату",
      left_ok: "Вы покинули комнату",
      notice_hold: "Пауза - ждём, пока все загрузят буфер",
      notice_go: "Все готовы - продолжаем",
    },
  };
  var T = i18n[_rawLang] || i18n["en"];

  var LOBBY_COLLECT_MS = 1500;
  var JOIN_TIMEOUT_MS = 6000;
  var JOIN_EMPTY_TIMEOUT_MS = 2500;
  var PING_INTERVAL_MS = 8000;
  var ECHO_TIMEOUT_MS = 30000;
  var RECONNECT_MS = 4000;

  var ROOM_ORPHAN_MS = 20000;
  var EPISODE_SWITCH_MS = 20000;

  var SYNC_HEARTBEAT_MS = 2000;
  var SYNC_TOLERANCE_S = 0.3;
  var SYNC_CORRECT_ON_S = 0.7;
  var SYNC_HARD_SEEK_S = 1.5;
  var SYNC_HARD_SEEK_APPLE_S = 3.0;
  var SEEK_GUARD_MS = 4000;
  var SEEK_BROADCAST_MIN_MS = 2000;
  var SEEK_MIN_JUMP_S = 1.0;
  var SYNC_RATE_GAIN = 0.1;
  var SYNC_MAX_RATE_OFFSET = 0.1;
  var SYNC_RATE_RESET_MS = 4000;
  var REWIND_GRACE_MS = 2500;

  // Playback speed of the room. Announced in the sp field of
  // state/sync/act/hold/go frames; the rate correction works around this base.
  var roomSpeed = 1.0;

  function applyRoomSpeed(m) {
    if (!m || typeof m.sp !== "number" || !(m.sp >= 0.25 && m.sp <= 4.0))
      return;
    if (Math.abs(m.sp - roomSpeed) < 0.005) return;
    roomSpeed = m.sp;
    var vid = getVideo();
    if (
      vid &&
      canAdjustRate() &&
      !vid._lp_correcting &&
      !isSystemSyncing &&
      Math.abs((vid.playbackRate || 1) - roomSpeed) > 0.01
    ) {
      vid.playbackRate = roomSpeed;
    }
  }

  var HOLD_MAX_MS = 15000;
  var HOLD_BUFFER_S = 6;
  var HOLD_MIN_BUFFER_S = 2;
  var HOLD_STALL_MS = 3000;
  var HOLD_NUDGE_MS = 4000;
  var NO_RANGES = -2;
  var OUT_OF_RANGE = -1;
  var PENDING_SHARE_MS = 300000;
  var SHARE_START_DELAY_MS = 600;
  var HARD_SEEK_COOLDOWN_MS = 3000;
  var PENDING_ACT_MAX_MS = 15000;
  var RECONNECT_HELLO_MS = 60000;
  var LOG_LIMIT = 400;

  var logRing = [];

  var playerLaunch = Lampa.Storage.get("watchtogether_player", "inner");

  function lplog() {
    var text = Array.prototype.slice.call(arguments).join(" ");
    var stamp = new Date().toISOString().substr(11, 12);

    logRing.push(stamp + "  " + text);
    if (logRing.length > LOG_LIMIT) logRing.shift();

    return text;
  }

  var pid = Lampa.Storage.get("watchtogether_pid", "");
  if (!pid) {
    pid = Lampa.Utils.uid(12).toLowerCase();
    Lampa.Storage.set("watchtogether_pid", pid);
  }

  var NAME_ADJECTIVES = [
    "Amber",
    "Arctic",
    "Atomic",
    "Brave",
    "Bright",
    "Calm",
    "Chilly",
    "Clever",
    "Cosmic",
    "Crimson",
    "Curious",
    "Dizzy",
    "Dusty",
    "Electric",
    "Emerald",
    "Fancy",
    "Fearless",
    "Frosty",
    "Fuzzy",
    "Gentle",
    "Golden",
    "Happy",
    "Hidden",
    "Humble",
    "Indigo",
    "Iron",
    "Jolly",
    "Lively",
    "Lucky",
    "Lunar",
    "Magic",
    "Marble",
    "Mighty",
    "Mystic",
    "Neon",
    "Nimble",
    "Noble",
    "Northern",
    "Plasma",
    "Polar",
    "Quiet",
    "Rapid",
    "Retro",
    "Royal",
    "Rusty",
    "Scarlet",
    "Shiny",
    "Silent",
    "Silver",
    "Sleepy",
    "Snowy",
    "Solar",
    "Sunny",
    "Swift",
    "Thunder",
    "Tiny",
    "Turbo",
    "Velvet",
    "Vivid",
    "Wild",
  ];

  var NAME_NOUNS = [
    "Badger",
    "Bandit",
    "Bear",
    "Beaver",
    "Bison",
    "Camel",
    "Captain",
    "Cheetah",
    "Comet",
    "Condor",
    "Cookie",
    "Coyote",
    "Crane",
    "Dingo",
    "Dolphin",
    "Donkey",
    "Dragon",
    "Eagle",
    "Falcon",
    "Ferret",
    "Fox",
    "Gecko",
    "Ghost",
    "Gibbon",
    "Griffin",
    "Hamster",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Husky",
    "Ibex",
    "Jaguar",
    "Kitten",
    "Koala",
    "Kraken",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lynx",
    "Mammoth",
    "Marmot",
    "Meteor",
    "Monkey",
    "Moose",
    "Narwhal",
    "Ninja",
    "Nomad",
    "Ocelot",
    "Octopus",
    "Osprey",
    "Otter",
    "Owl",
    "Panda",
    "Panther",
    "Parrot",
    "Pelican",
    "Penguin",
    "Pilot",
    "Pirate",
    "Puffin",
    "Puma",
    "Rabbit",
    "Raccoon",
    "Ranger",
    "Raven",
    "Rhino",
    "Robot",
    "Rocket",
    "Salmon",
    "Seal",
    "Shark",
    "Sparrow",
    "Tiger",
    "Toucan",
    "Turtle",
    "Viking",
    "Walrus",
    "Wizard",
    "Wolf",
    "Wombat",
    "Yeti",
    "Zebra",
  ];

  function pickOne(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomDisplayName() {
    return (
      pickOne(NAME_ADJECTIVES) +
      pickOne(NAME_NOUNS) +
      (10 + Math.floor(Math.random() * 90))
    );
  }

  function getDisplayName() {
    var custom = (Lampa.Storage.get("watchtogether_display_name", "") || "")
      .toString()
      .trim();
    if (!custom) {
      custom = randomDisplayName();
      Lampa.Storage.set("watchtogether_display_name", custom);
      lplog("display name generated: " + custom);
    }
    return custom;
  }

  function isUsePassword() {
    return Lampa.Storage.field("watchtogether_use_password") === true;
  }

  function getDefaultPassword() {
    return (
      Lampa.Storage.get("watchtogether_default_password", "") || ""
    ).toString();
  }

  function isPublish() {
    return Lampa.Storage.field("watchtogether_publish") !== false;
  }

  function isShowHead() {
    return Lampa.Storage.get("watchtogether_show_head", "true") === true;
  }

  function getRelay() {
    var v = (Lampa.Storage.get("watchtogether_relay", "") || "")
      .toString()
      .trim();
    if (!v) v = DEFAULT_RELAY;
    if (v.charAt(v.length - 1) !== "/") v += "/";
    return v;
  }

  function getInvite() {
    var v = (Lampa.Storage.get("watchtogether_invite", "") || "")
      .toString()
      .trim();
    return v || DEFAULT_INVITE;
  }

  function safe(s) {
    return (s + "").replace(/[<>&"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  var uiPrevController = "content";

  function controllerName() {
    try {
      var e = Lampa.Controller.enabled();
      return (e && e.name) || "";
    } catch (err) {
      return "";
    }
  }

  function rememberController() {
    var name = controllerName();
    if (
      name &&
      name !== "select" &&
      name !== "keybord" &&
      name !== "settings_input"
    )
      uiPrevController = name;
    return uiPrevController;
  }

  function restoreController(name) {
    var target = name || uiPrevController || "content";

    if (target === "content" && playerIsOpen()) target = "player";

    try {
      Lampa.Controller.toggle(target);
      if (controllerName() === target) return;
    } catch (err) {}

    if (playerIsOpen()) {
      try {
        Lampa.Controller.toggle("player");
      } catch (err) {}
      if (controllerName() === "player") return;
    }

    try {
      Lampa.Controller.toggle("content");
    } catch (err) {}
  }

  function askInput(params, done) {
    Lampa.Input.edit(
      {
        title: params.title,
        value: params.value || "",
        free: true,
        nosave: true,
      },
      function (value) {
        restoreController();
        done(value);
      },
    );
  }

  function closeSettings() {
    var guard = 0;
    while ($("body").hasClass("settings--open") && guard++ < 4) {
      var name = controllerName();
      if (name !== "settings" && name !== "settings_component") break;
      try {
        Lampa.Controller.back();
      } catch (err) {
        break;
      }
    }
  }

  function playerIsOpen() {
    try {
      if (Lampa.Player && typeof Lampa.Player.opened === "function")
        return !!Lampa.Player.opened();
    } catch (err) {}
    return !!document.querySelector(".player");
  }

  var SHA_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  function sha256hex(str) {
    var msg = unescape(encodeURIComponent(str));
    var len = msg.length;
    var bitLen = len * 8;
    var blocks = (((len + 8) >> 6) + 1) * 16;
    var w = [];
    var i, j;

    for (i = 0; i < blocks; i++) w[i] = 0;
    for (i = 0; i < len; i++)
      w[i >> 2] |= (msg.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    w[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
    w[blocks - 1] = bitLen;

    var H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ];
    var m = [];

    function rr(v, n) {
      return (v >>> n) | (v << (32 - n));
    }

    for (i = 0; i < blocks; i += 16) {
      var a = H[0],
        b = H[1],
        c = H[2],
        d = H[3],
        e = H[4],
        f = H[5],
        g = H[6],
        h = H[7];

      for (j = 0; j < 64; j++) {
        if (j < 16) {
          m[j] = w[i + j] | 0;
        } else {
          var s0 = rr(m[j - 15], 7) ^ rr(m[j - 15], 18) ^ (m[j - 15] >>> 3);
          var s1 = rr(m[j - 2], 17) ^ rr(m[j - 2], 19) ^ (m[j - 2] >>> 10);
          m[j] = (m[j - 16] + s0 + m[j - 7] + s1) | 0;
        }
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + SHA_K[j] + m[j]) | 0;
        var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        var mj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + mj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    var out = "";
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        var byte = (H[i] >>> (j * 8)) & 0xff;
        out += (byte < 16 ? "0" : "") + byte.toString(16);
      }
    }
    return out;
  }

  function roomChannel(roomId, password) {
    return (
      ROOM_PREFIX +
      sha256hex((roomId || "").toUpperCase() + "|" + (password || "")).substr(
        0,
        24,
      )
    );
  }

  function newRoomId() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var id = "";
    for (var i = 0; i < 6; i++)
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }

  function Sock(opts) {
    var self = this;
    this.channel = opts.channel;
    this.alias = opts.alias || "";
    this.echo = !!opts.echo;
    this.onEvent = opts.onEvent || function () {};
    this.reconnect = !!opts.reconnect;
    this.ws = null;
    this.uid = null;
    this.members = [];
    this.closed = false;
    this.retryTimer = null;

    this.url = function () {
      var q = "announce=true&list=true";
      if (self.echo) q += "&echo=true";
      if (self.alias) q += "&as=" + encodeURIComponent(self.alias);
      return getRelay() + encodeURIComponent(self.channel) + "?" + q;
    };

    this.open = function () {
      if (self.closed) return;
      if (self.ws && (self.ws.readyState === 0 || self.ws.readyState === 1))
        return;

      try {
        self.ws = new WebSocket(self.url());
      } catch (err) {
        self.scheduleRetry();
        return;
      }

      self.ws.onopen = function () {
        console.log("[WatchTogether] ws open", self.channel);
        self.onEvent({ kind: "open" });
      };

      self.ws.onmessage = function (e) {
        var d;
        try {
          d = JSON.parse(e.data);
        } catch (err) {
          return;
        }
        if (!d) return;

        if (d.type === "join") {
          if (d.self) {
            self.uid = d.uid;
            self.members = [];
            var list = d.users || [];
            for (var i = 0; i < list.length; i++) {
              if (!self.findMember(list[i].uid))
                self.members.push({
                  uid: list[i].uid,
                  alias: list[i].alias || "",
                });
            }
            if (!self.findMember(self.uid))
              self.members.push({ uid: self.uid, alias: self.alias });
            self.onEvent({
              kind: "ready",
              date: d.date,
              total: d.total,
              members: self.members,
            });
          } else {
            if (!self.findMember(d.uid))
              self.members.push({ uid: d.uid, alias: d.alias || "" });
            self.onEvent({
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
          for (var k = self.members.length - 1; k >= 0; k--) {
            if (self.members[k].uid === d.uid) self.members.splice(k, 1);
          }
          self.onEvent({
            kind: "leave",
            date: d.date,
            uid: d.uid,
            alias: d.alias || "",
            total: d.total,
          });
          return;
        }

        if (d.type === "error") {
          console.log("[WatchTogether] relay error:", d.message);
          self.onEvent({ kind: "error", date: d.date, text: d.message });
          return;
        }

        if (d.message && typeof d.message === "object") {
          self.onEvent({
            kind: "msg",
            date: d.date,
            uid: d.uid,
            alias: d.alias || "",
            msg: d.message,
            mine: d.uid === self.uid,
          });
        }
      };

      self.ws.onclose = function () {
        console.log(
          "[WatchTogether] ws close",
          self.channel,
          self.closed ? "(by us)" : "(remote)",
        );
        self.uid = null;
        self.members = [];
        self.onEvent({ kind: "close" });
        self.scheduleRetry();
      };

      self.ws.onerror = function () {};
    };

    this.scheduleRetry = function () {
      if (!self.reconnect || self.closed) return;
      if (self.retryTimer) clearTimeout(self.retryTimer);
      self.retryTimer = setTimeout(function () {
        self.retryTimer = null;
        self.open();
      }, RECONNECT_MS);
    };

    this.findMember = function (uid) {
      for (var i = 0; i < self.members.length; i++)
        if (self.members[i].uid === uid) return self.members[i];
      return null;
    };

    this.alive = function () {
      return !!self.ws && self.ws.readyState === 1;
    };

    this.send = function (obj) {
      if (!self.alive()) return false;
      try {
        self.ws.send(JSON.stringify(obj));
        return true;
      } catch (err) {
        return false;
      }
    };

    this.close = function () {
      self.closed = true;
      if (self.retryTimer) {
        clearTimeout(self.retryTimer);
        self.retryTimer = null;
      }
      if (self.ws) {
        try {
          self.ws.close();
        } catch (err) {}
        self.ws = null;
      }
    };
  }

  var room = null;
  var lobbyHost = null;
  var inRoom = false;
  var joining = false;
  var joinTimer = null;

  var currentRoomId = null;
  var currentRoomPassword = "";
  var currentRoomName = "";
  var currentRoomOwner = null;
  var currentRoomMeta = {
    title: "",
    poster: "",
    url: "",
    tmdb_id: 0,
    source: "",
    type: "",
  };

  var pidByUid = {};

  var episodeSwitchAt = 0;
  var roomAliveAt = 0;

  function markEpisodeSwitch() {
    episodeSwitchAt = Date.now();
  }
  function clearEpisodeSwitch() {
    episodeSwitchAt = 0;
  }
  function isEpisodeSwitching() {
    return (
      episodeSwitchAt > 0 && Date.now() - episodeSwitchAt < EPISODE_SWITCH_MS
    );
  }

  var serverTimeOffset = 0;
  var pingSamples = [];
  var echoSeq = 0;
  var echoPending = {};
  var pingTimer = null;
  var watchdogTimer = null;

  var isSystemSyncing = false;
  var lastUserActionTime = 0;
  var rewindUntil = 0;
  var lastHardSeekAt = 0;
  var knownPids = {};

  var holdActive = false;
  var holdPosition = 0;
  var holdWaiting = {};
  var holdReadySent = false;
  var holdTimer = null;
  var holdBufferSeen = -1;
  var holdBufferAt = 0;
  var holdNudgeDone = false;
  var initialSyncLock = false;
  var targetInitialState = null;
  var expectedState = { seek: -1, play: false, pause: false };

  var lastStreamUrl = null;
  var lastStreamTitle = null;
  var pendingShareCard = null;
  var pendingShareAt = 0;
  var lastViewedCard = null;

  function serverNow() {
    return Date.now() + serverTimeOffset;
  }

  function iAmHost() {
    return !!currentRoomOwner && currentRoomOwner === pid;
  }

  function memberCount() {
    return room ? room.members.length : 0;
  }

  function getTmdbId(card) {
    if (!card) return 0;
    return card.id || card.tmdb_id || 0;
  }

  function getCardPoster(card) {
    if (!card) return "";
    if (card.poster_path)
      return "https://image.tmdb.org/t/p/w300" + card.poster_path;
    return card.img || card.background_image || "";
  }

  function expectedPositionNow(state, basePosition, atServerTime) {
    if (state !== "playing" || !atServerTime || atServerTime <= 0)
      return basePosition;
    var elapsedSec = (serverNow() - atServerTime) / 1000;
    if (elapsedSec < 0 || elapsedSec > 3600) return basePosition;
    return basePosition + elapsedSec;
  }

  function roomSend(obj) {
    if (!room || !room.alive()) return false;
    obj.u = pid;
    obj.k = ++echoSeq;
    echoPending[obj.k] = Date.now();
    return room.send(obj);
  }

  function handleEcho(key, serverDate) {
    var t0 = echoPending[key];
    if (!t0) return;
    delete echoPending[key];

    var t1 = Date.now();
    var rtt = t1 - t0;
    var offset = serverDate + rtt / 2 - t1;

    pingSamples.push({ offset: offset, rtt: rtt });
    if (pingSamples.length > 8) pingSamples.shift();

    var best = pingSamples[0];
    for (var i = 1; i < pingSamples.length; i++)
      if (pingSamples[i].rtt < best.rtt) best = pingSamples[i];
    serverTimeOffset = best.offset;
  }

  function startClockTimers() {
    stopClockTimers();
    pingTimer = setInterval(function () {
      if (room && room.alive()) roomSend({ t: "ping" });
    }, PING_INTERVAL_MS);

    watchdogTimer = setInterval(function () {
      if (!room || !room.alive()) return;
      var now = Date.now();
      for (var key in echoPending) {
        if (!echoPending.hasOwnProperty(key)) continue;
        if (now - echoPending[key] > ECHO_TIMEOUT_MS) {
          console.log(
            "[WatchTogether]",
            lplog("echo watchdog timeout - forcing reconnect"),
          );
          echoPending = {};
          try {
            room.ws.close();
          } catch (err) {}
          return;
        }
      }
    }, 5000);
  }

  function stopClockTimers() {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
    if (watchdogTimer) {
      clearInterval(watchdogTimer);
      watchdogTimer = null;
    }
  }

  function buildAd() {
    return {
      id: currentRoomId,
      name: currentRoomName,
      title: currentRoomMeta.title || "",
      poster: currentRoomMeta.poster || "",
      owner: getDisplayName(),
      members: memberCount(),
      pwd: currentRoomPassword ? 1 : 0,
      tmdb: currentRoomMeta.tmdb_id || 0,
      type: currentRoomMeta.type || "movie",
    };
  }

  function startLobbyAgent() {
    stopLobbyAgent();
    if (!isPublish()) return;
    // Never advertise a passwordless room, even one we only joined or inherited as host:
    // the lobby is a public relay, so anyone reading it could walk straight in.
    if (!currentRoomPassword) return;

    lobbyHost = new Sock({
      channel: LOBBY_CHANNEL,
      alias: "",
      echo: false,
      reconnect: true,
      onEvent: function (e) {
        if (e.kind !== "msg" || e.mine) return;
        if (!e.msg || e.msg.t !== "who") return;
        if (!inRoom || !currentRoomId) return;

        var ad = buildAd();
        setTimeout(
          function () {
            if (lobbyHost && inRoom) lobbyHost.send({ t: "ad", r: ad });
          },
          Math.floor(Math.random() * 350) + 50,
        );
      },
    });
    lobbyHost.open();
  }

  function stopLobbyAgent() {
    if (lobbyHost) {
      lobbyHost.close();
      lobbyHost = null;
    }
  }

  function discoverRooms(done) {
    var found = {};
    var finished = false;

    var probe = new Sock({
      channel: LOBBY_CHANNEL,
      alias: "",
      echo: false,
      reconnect: false,
      onEvent: function (e) {
        if (e.kind === "ready") {
          probe.send({ t: "who" });
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

    setTimeout(function () {
      if (finished) return;
      finished = true;
      probe.close();

      var list = [];
      for (var id in found) {
        if (!found.hasOwnProperty(id)) continue;
        list.push(found[id]);
      }
      list.sort(function (a, b) {
        return (b.members || 0) - (a.members || 0);
      });
      done(list);
    }, LOBBY_COLLECT_MS);
  }

  var ICON_FILM =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M8 4v16M16 4v16M3 12h18M3 8h5M3 16h5M16 8h5M16 16h5"></path></svg>';

  function ensureRoomStyle() {
    if (document.getElementById("watchtogether-room-style")) return;

    var style = document.createElement("style");

    style.id = "watchtogether-room-style";
    style.textContent =
      ".selectbox-item__icon > .watchtogether-poster{width:3.4em;height:5.1em;border-radius:0.3em;" +
      "background-color:#3e3e3e;object-fit:cover;}" +
      ".watchtogether-poster--empty{display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);}" +
      ".watchtogether-poster--empty > svg{width:1.6em;height:1.6em;}";

    document.head.appendChild(style);
  }

  function roomPosterStub() {
    return (
      '<div class="watchtogether-poster watchtogether-poster--empty">' +
      ICON_FILM +
      "</div>"
    );
  }

  function roomPoster(r) {
    if (!r.poster) return roomPosterStub();
    return '<img class="watchtogether-poster" src="' + safe(r.poster) + '" />';
  }

  function bindPosterFallback(item) {
    item.find("img.watchtogether-poster").on("error", function () {
      $(this).replaceWith(roomPosterStub());
    });
  }

  var browserBusy = false;

  function openRoomBrowser() {
    if (browserBusy) return;
    browserBusy = true;

    rememberController();
    dropStaleRoom();

    Lampa.Noty.show(T.searching);

    discoverRooms(function (rooms) {
      browserBusy = false;

      rememberController();

      var items = [];

      if (inRoom) {
        items.push({
          title:
            '<span style="color:#ff8a80">&#10005; ' +
            T.leave_btn +
            " [" +
            safe(currentRoomId || "") +
            "]</span>",
          action: "leave",
        });
      }

      items.push({
        title: '<span style="color:#00e676">+ ' + T.create_btn + "</span>",
        action: "create",
      });
      items.push({
        title: '<span style="color:#64b5f6">#  ' + T.join_code_btn + "</span>",
        action: "code",
      });

      if (rooms.length) ensureRoomStyle();

      for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        var lock = r.pwd ? " &#128274;" : "";
        var line2 = [];

        if (r.title) line2.push(safe(r.title));
        line2.push(T.label_owner + ": " + safe(r.owner || ""));
        line2.push(T.label_members + ": " + (r.members || 0));

        items.push({
          template: "selectbox_icon",
          icon: roomPoster(r),
          title:
            "<b>" +
            safe(r.name || r.id) +
            '</b> <span style="opacity:.5">[' +
            safe(r.id) +
            "]</span>" +
            lock,
          subtitle: line2.join(" &middot; "),
          onDraw: bindPosterFallback,
          room: r,
        });
      }

      if (rooms.length === 0) {
        items.push({
          title: '<span style="opacity:.6">' + T.empty_list + "</span>",
          disabled: true,
        });
      }

      Lampa.Select.show({
        title: T.head_title,
        items: items,
        onSelect: function (a) {
          restoreController();

          if (a.disabled) return;
          if (a.action === "leave") return manualLeaveRoom();
          if (a.action === "create") return askCreateRoom();
          if (a.action === "code") return askRoomCode();
          if (a.room) return tryJoinRoom(a.room);
        },
        onBack: function () {
          restoreController();
        },
      });
    });
  }

  function manualLeaveRoom() {
    if (!inRoom && !joining) return;
    leaveRoom(true);
    Lampa.Noty.show(T.left_ok);
  }

  function askRoomCode() {
    askInput({ title: T.input_room_code, value: "" }, function (val) {
      var id = (val || "").toString().trim().toUpperCase();
      if (!id) return;
      tryJoinRoom({ id: id, pwd: 1, name: id });
    });
  }

  function tryJoinRoom(r) {
    dropStaleRoom();

    if (inRoom) {
      Lampa.Noty.show(
        T.already_in_room(currentRoomName || currentRoomId || ""),
      );
      return;
    }

    if (!r.pwd) return joinRoom(r.id, "", r.name || r.id);

    var prefill = isUsePassword() ? getDefaultPassword() : "";
    askInput({ title: T.input_join_password, value: prefill }, function (val) {
      joinRoom(r.id, val || "", r.name || r.id);
    });
  }

  function resetRoomState() {
    stopClockTimers();

    $(".watchtogether-room-badge").remove();

    var vid = getVideo();
    if (vid) clearRateAdjust(vid);

    if (expectedSeekTimer) {
      clearTimeout(expectedSeekTimer);
      expectedSeekTimer = null;
    }
    clearPendingSync();
    expectedState = { seek: -1, play: false, pause: false };
    initialSyncLock = false;
    targetInitialState = null;
    isSystemSyncing = false;
    rewindUntil = 0;
    holdActive = false;
    holdPosition = 0;
    holdWaiting = {};
    holdReadySent = false;
    resetHoldProgress();
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    inRoom = false;
    joining = false;
    currentRoomId = null;
    currentRoomPassword = "";
    currentRoomName = "";
    currentRoomOwner = null;
    currentRoomMeta = {
      title: "",
      poster: "",
      url: "",
      tmdb_id: 0,
      source: "",
      type: "",
    };
    lastStreamUrl = stripRoomParam(lastStreamUrl);
    pidByUid = {};
    knownPids = {};
    echoPending = {};
    pingSamples = [];
    lastHardSeekAt = 0;
    clearEpisodeSwitch();
    roomAliveAt = 0;

    createPending = false;
    if (createTimer) {
      clearTimeout(createTimer);
      createTimer = null;
    }
    if (joinTimer) {
      clearTimeout(joinTimer);
      joinTimer = null;
    }
  }

  function dropStaleRoom() {
    if ((inRoom || joining) && !playerIsOpen()) {
      console.log(
        "[WatchTogether]",
        lplog("stale room detected (player closed) - leaving"),
      );
      leaveRoom(true);
      return true;
    }
    return false;
  }

  function leaveRoom(sendBye) {
    if (inRoom || joining)
      console.log("[WatchTogether]", lplog("leave room", currentRoomId || ""));
    if (room) {
      if (sendBye && room.alive()) roomSend({ t: "bye" });
      room.close();
      room = null;
    }
    stopLobbyAgent();
    resetRoomState();
  }

  function stripRoomParam(url) {
    if (!url) return url;
    return url.replace(/([?&])room=[^&]*&?/, "$1").replace(/[?&]$/, "");
  }

  function withRoomParam(url) {
    if (!url || !currentRoomId || url.search(/[?&]room=/) !== -1) return url;
    var data = btoa(
      unescape(
        encodeURIComponent(currentRoomId + ":" + (currentRoomPassword || "")),
      ),
    );
    return (
      url +
      (url.indexOf("?") === -1 ? "?" : "&") +
      "room=" +
      encodeURIComponent(data)
    );
  }

  function inviteLink() {
    return withRoomParam(getInvite());
  }

  function connectRoom(roomId, password, onReady) {
    if (room) {
      room.close();
      room = null;
    }

    currentRoomId = roomId;
    currentRoomPassword = password || "";
    roomAliveAt = Date.now();

    room = new Sock({
      channel: roomChannel(roomId, password),
      alias: getDisplayName(),
      echo: true,
      reconnect: true,
      onEvent: onRoomEvent,
    });
    room._onReady = onReady;
    room.open();
    startClockTimers();
  }

  function androidRoomHandoff(roomId, password, name, meta) {
    currentRoomId = roomId;
    currentRoomPassword = password || "";
    currentRoomName = name || roomId;
    currentRoomMeta = {
      title: (meta && meta.title) || "",
      poster: (meta && meta.poster) || "",
      url: (meta && meta.url) || inviteLink(),
      tmdb_id: (meta && meta.tmdb_id) || 0,
      source: (meta && meta.source) || "",
      type: (meta && meta.type) || "movie",
    };

    console.log(
      "[WatchTogether] android player: room",
      roomId,
      "handed to player, no relay socket from lampa",
    );

    closeSettings();
    playRoomStream(
      currentRoomMeta.url,
      currentRoomMeta.title || currentRoomName,
      currentRoomMeta.poster,
    );
  }

  function joinRoom(roomId, password, fallbackName) {
    if (playerLaunch === "android")
      return androidRoomHandoff(roomId, password, fallbackName, null);

    Lampa.Noty.show(T.connecting);

    joining = true;
    currentRoomName = fallbackName || roomId;

    connectRoom(roomId, password, function (ev) {
      console.log("[WatchTogether] join: channel ready, total", ev.total);
      roomSend({
        t: "hello",
        n: getDisplayName(),
        cd: iAmHost() && isPublish() ? currentRoomId : undefined,
      });

      if (ev.total <= 1) {
        if (joinTimer) clearTimeout(joinTimer);
        joinTimer = setTimeout(failJoin, JOIN_EMPTY_TIMEOUT_MS);
      }
    });

    if (joinTimer) clearTimeout(joinTimer);
    joinTimer = setTimeout(failJoin, JOIN_TIMEOUT_MS);
  }

  function failJoin() {
    if (!joining) return;
    console.log("[WatchTogether] join failed - no answer from room");
    Lampa.Noty.show(T.no_room);
    leaveRoom(false);
  }

  function extendJoinDeadline() {
    if (!joining) return;
    if (joinTimer) clearTimeout(joinTimer);
    joinTimer = setTimeout(failJoin, JOIN_TIMEOUT_MS);
  }

  function acceptRoomState(msg, atServerTime) {
    if (joinTimer) {
      clearTimeout(joinTimer);
      joinTimer = null;
    }
    joining = false;

    if (!msg.url) {
      Lampa.Noty.show(T.no_stream);
      leaveRoom(true);
      return;
    }

    inRoom = true;
    roomAliveAt = Date.now();
    currentRoomName = msg.rn || currentRoomName;
    currentRoomOwner = msg.own || null;
    if (typeof msg.sp === "number" && msg.sp >= 0.25 && msg.sp <= 4.0)
      roomSpeed = msg.sp;
    currentRoomMeta = {
      title: msg.ti || "",
      poster: msg.po || "",
      url: msg.url,
      tmdb_id: msg.tm || 0,
      source: msg.src || "",
      type: msg.ty || "movie",
    };

    var roomState = msg.s === "playing" ? "playing" : "paused";
    var roomPos = msg.p || 0;

    var needsInitialSync = roomState === "playing" || roomPos > 0.5;

    initialSyncLock = needsInitialSync;
    targetInitialState = needsInitialSync
      ? {
          state: roomState,
          position: roomPos,
          atServerTime: atServerTime,
        }
      : null;

    Lampa.Noty.show(T.join_ok(currentRoomName));

    closeSettings();

    playRoomStream(
      currentRoomMeta.url,
      currentRoomMeta.title || currentRoomName,
      currentRoomMeta.poster || "",
    );
  }

  function askCreateRoom() {
    if (lastStreamUrl) {
      Lampa.Select.show({
        title: T.create_btn,
        items: [
          {
            title:
              T.create_from_player + " (" + safe(lastStreamTitle || "") + ")",
            share: true,
          },
          { title: T.input_url, share: false },
        ],
        onSelect: function (a) {
          restoreController();

          if (a.share)
            askRoomDetails({
              stream_url: lastStreamUrl,
              title: lastStreamTitle || "",
            });
          else promptStreamUrl();
        },
        onBack: function () {
          restoreController();
        },
      });
    } else {
      promptStreamUrl();
    }
  }

  function promptStreamUrl() {
    askInput({ title: T.input_url, value: "" }, function (val) {
      if (!val) return Lampa.Noty.show(T.need_url);
      askRoomDetails({ stream_url: val, title: "" });
    });
  }

  function askRoomDetails(seed) {
    askInput(
      {
        title: T.input_room_name,
        value: seed.title || "Room " + Math.floor(Math.random() * 1000),
      },
      function (name) {
        if (!name) name = "Room";
        seed.name = name;

        askRoomPassword(seed, function () {
          createRoom(seed, false);
        });
      },
    );
  }

  // Publishing implies a password, so ask for one whenever either switch wants it.
  // An empty answer is allowed - the room is then simply kept out of the lobby list.
  function askRoomPassword(seed, done) {
    if (!isUsePassword() && !isPublish()) {
      seed.password = "";
      return done();
    }

    askInput(
      { title: T.input_password, value: getDefaultPassword() },
      function (pwd) {
        seed.password = pwd || "";
        done();
      },
    );
  }

  var createPending = false;
  var createTimer = null;
  function createRoom(seed, hostAlreadyPlaying) {
    if (createPending) return;

    if (!hostAlreadyPlaying) dropStaleRoom();

    if (inRoom) {
      Lampa.Noty.show(
        T.already_in_room(currentRoomName || currentRoomId || ""),
      );
      return;
    }
    if (!seed.stream_url) {
      Lampa.Noty.show(T.need_url);
      return;
    }

    createPending = true;

    var id = newRoomId();

    currentRoomName = seed.name || "Room-" + id;
    currentRoomOwner = pid;
    currentRoomMeta = {
      title: seed.title || "",
      poster: seed.poster || "",
      url: seed.stream_url,
      tmdb_id: seed.tmdb_id || 0,
      source: seed.source || "",
      type: seed.type || "movie",
    };

    connectRoom(id, seed.password || "", function () {
      createPending = false;
      if (createTimer) {
        clearTimeout(createTimer);
        createTimer = null;
      }

      inRoom = true;
      joining = false;
      roomAliveAt = Date.now();

      initialSyncLock = false;
      targetInitialState = null;

      startLobbyAgent();

      // One notification, not a queue: each Noty replaces the previous one, so the
      // name, the code and the unlisted warning have to travel together or get eaten.
      var lines = [T.create_ok(currentRoomName), T.room_code(id)];
      if (!currentRoomPassword && isPublish()) lines.push(T.publish_needs_pwd);
      // Noty renders with .html() and its time is in ms - \n would collapse, 8 would blink.
      Lampa.Noty.show(lines.join("<br>"), { time: 8000 });

      var vid = getVideo();

      if (hostAlreadyPlaying && playerIsOpen() && vid) {
        roomSend({
          t: "sync",
          s: vid.paused ? "paused" : "playing",
          p: vid.currentTime || 0,
        });
      } else {
        if (hostAlreadyPlaying)
          console.log(
            "[WatchTogether]",
            lplog("player was expected open but is not - starting it"),
          );

        closeSettings();

        playRoomStream(
          currentRoomMeta.url,
          currentRoomMeta.title || currentRoomName,
          currentRoomMeta.poster || "",
        );
      }
    });

    if (createTimer) clearTimeout(createTimer);
    createTimer = setTimeout(function () {
      createTimer = null;
      if (createPending) {
        createPending = false;
        Lampa.Noty.show(T.create_fail);
        leaveRoom(false);
      }
    }, JOIN_TIMEOUT_MS);
  }

  function autoCreateRoomFromPending(card, streamUrl) {
    var title =
      card.title ||
      card.name ||
      card.original_title ||
      card.original_name ||
      "";
    var type =
      card.name || card.number_of_seasons || card.first_air_date
        ? "tv"
        : "movie";

    var seed = {
      stream_url: streamUrl,
      title: title,
      poster: getCardPoster(card),
      tmdb_id: getTmdbId(card),
      source: card.source || "tmdb",
      type: type,
      name: title || "Room " + Math.floor(Math.random() * 1000),
      password: "",
    };

    askRoomPassword(seed, function () {
      createRoom(seed, true);
    });
  }

  function onRoomEvent(e) {
    if (e.kind === "ready") {
      echoPending = {};

      if (room && room._onReady) {
        var cb = room._onReady;
        room._onReady = null;
        cb(e);
        return;
      }

      if (inRoom) {
        roomSend({
          t: "hello",
          n: getDisplayName(),
          cd: iAmHost() && isPublish() ? currentRoomId : undefined,
        });
        if (iAmHost()) sendHostState();
      }
      updateRoomBadge();
      return;
    }

    if (e.kind === "close") {
      updateRoomBadge();
      return;
    }

    if (e.kind === "join") {
      updateRoomBadge();
      return;
    }

    if (e.kind === "leave") {
      onMemberLeave(e);
      return;
    }

    if (e.kind !== "msg" || !e.msg) return;

    if (e.mine) {
      if (e.msg.k) handleEcho(e.msg.k, e.date);
      return;
    }

    var m = e.msg;
    if (m.u) pidByUid[e.uid] = m.u;

    if (m.u === pid && m.t === "hello") {
      Lampa.Noty.show(T.kicked);
      leaveRoom(false);
      return;
    }

    if (m.t === "hello") {
      if (!inRoom) return;
      Lampa.Noty.show(T.notice_joined(m.n || e.alias));

      var seenAt = m.u ? knownPids[m.u] : 0;
      var reconnected = seenAt && Date.now() - seenAt < RECONNECT_HELLO_MS;
      if (m.u) knownPids[m.u] = Date.now();

      console.log(
        "[WatchTogether] hello from",
        m.u,
        reconnected ? "(reconnect)" : "(new)",
      );

      if (iAmHost() && !reconnected) startJoinHold(m.u);

      setTimeout(
        function () {
          if (!inRoom) return;
          roomSend({ t: "me", n: getDisplayName() });
          if (iAmHost()) sendHostState();
        },
        Math.floor(Math.random() * 250) + 50,
      );
      updateRoomBadge();
      return;
    }

    if (m.t === "hold") {
      if (!inRoom && !joining) return;
      if (currentRoomOwner && m.u !== currentRoomOwner) return;
      extendJoinDeadline();
      applyRoomSpeed(m);
      applyHold(m.p || 0);
      return;
    }

    if (m.t === "ready") {
      markHoldReady(m.u);
      return;
    }

    if (m.t === "go") {
      if (!inRoom && !joining) return;
      if (currentRoomOwner && m.u !== currentRoomOwner) return;
      applyRoomSpeed(m);
      releaseHold(typeof m.p === "number" ? m.p : holdPosition);
      return;
    }

    if (m.t === "me") {
      updateRoomBadge();
      return;
    }

    if (m.t === "state") {
      if (joining) acceptRoomState(m, e.date);
      return;
    }
    if (m.t === "host") {
      currentRoomOwner = m.u;
      clearPendingSync();
      Lampa.Noty.show(T.notice_host_changed(m.n || e.alias));
      return;
    }

    if (m.t === "url") {
      if (!inRoom || !m.url) return;
      if (currentRoomOwner && m.u !== currentRoomOwner) return;

      currentRoomMeta.url = m.url;
      currentRoomMeta.title = m.ti || currentRoomMeta.title;
      markEpisodeSwitch();
      clearPendingSync();
      try {
        playRoomStream(m.url, m.ti || currentRoomName, "");
      } catch (err) {}
      return;
    }

    if (m.t === "sync" || m.t === "act") {
      if (!inRoom) return;

      if (
        m.t === "sync" &&
        (iAmHost() || (currentRoomOwner && m.u !== currentRoomOwner))
      )
        return;

      applyRoomSpeed(m);

      if (m.t === "act" && m.v) {
        var text = formatNotice(m.v, m.n || e.alias);
        if (text) Lampa.Noty.show(text);
      }

      var state = m.s === "playing" ? "playing" : "paused";
      var position = m.p || 0;

      // вхідна пауза на кінці серії — це природне завершення відео у партнера, а не дія користувача
      if (m.t === "act" && state === "paused") {
        var d = getVideo() && getVideo().duration;
        if (d && isFinite(d) && d > 0 && position >= d - 1.0) return;
      }

      if (initialSyncLock) {
        targetInitialState = {
          state: state,
          position: position,
          atServerTime: e.date,
        };
        return;
      }

      var vid = getVideo();
      if (!vid) return;

      if (isRewinding() || holdActive) return;
      if (Date.now() - lastUserActionTime < 2000) return;
      // a seek of ours is waiting out the debounce - the heartbeat cannot know about it yet,
      // so its position is stale by definition. explicit acts still get through
      if (m.t === "sync" && pendingSeekBroadcast) return;

      // anything newer supersedes a deferred seek - never let a stale snapshot outlive it
      pendingAct = null;

      isSystemSyncing = true;
      applySync(vid, state, position, e.date);
      setTimeout(function () {
        isSystemSyncing = false;
      }, 500);

      // an explicit seek that could not land (buffering / seek cooldown) is kept and retried
      // instead of being dropped - dropping it lets our heartbeat drag the peer back.
      // threshold matches applySync's hard seek, so a drift it chose to fix by playbackRate
      // is not mistaken for a missed seek
      if (m.t === "act" && m.v === "seeked") {
        var target = expectedPositionNow(state, position, e.date);
        if (Math.abs((vid.currentTime || 0) - target) > hardSeekThreshold()) {
          pendingAct = {
            state: state,
            position: position,
            atServerTime: e.date,
            at: Date.now(),
            until: Date.now() + PENDING_ACT_MAX_MS,
          };
          console.log(
            "[WatchTogether]",
            "act seek deferred, target",
            target.toFixed(2),
          );
        }
      }
      return;
    }

    if (m.t === "bye") {
      updateRoomBadge();
      return;
    }
  }

  function sendHostState() {
    roomSend({
      t: "state",
      rn: currentRoomName,
      own: currentRoomOwner || pid,
      // the code in the clear lets the server re-announce this room in the
      // lobby; withheld when publishing is off, so the room stays unlisted
      cd: isPublish() ? currentRoomId : undefined,
      url: currentRoomMeta.url,
      ti: currentRoomMeta.title,
      po: currentRoomMeta.poster,
      tm: currentRoomMeta.tmdb_id,
      src: currentRoomMeta.source,
      ty: currentRoomMeta.type,
      s: hostPlaybackState(),
      p: hostPlaybackPosition(),
      sp: roomSpeed,
    });
  }

  function hostPlaybackState() {
    var vid = getVideo();
    if (!vid) return "paused";
    return vid.paused ? "paused" : "playing";
  }

  function hostPlaybackPosition() {
    var vid = getVideo();
    return vid ? vid.currentTime || 0 : 0;
  }

  function onMemberLeave(e) {
    if (!inRoom) {
      updateRoomBadge();
      return;
    }

    var leaverPid = pidByUid[e.uid];
    delete pidByUid[e.uid];

    Lampa.Noty.show(T.notice_left(e.alias || ""));
    updateRoomBadge();

    if (leaverPid && holdWaiting[leaverPid]) markHoldReady(leaverPid);

    var hostGone = currentRoomOwner && leaverPid === currentRoomOwner;
    if (!hostGone) return;

    setTimeout(function () {
      if (!inRoom || !room || !room.uid) return;
      if (hostStillPresent()) return;

      var uids = [room.uid];
      for (var i = 0; i < room.members.length; i++) {
        if (room.members[i].uid !== room.uid) uids.push(room.members[i].uid);
      }
      uids.sort();

      if (uids[0] === room.uid) {
        currentRoomOwner = pid;
        clearPendingSync();
        roomSend({ t: "host", n: getDisplayName() });
        Lampa.Noty.show(T.notice_host_changed(getDisplayName()));
        startLobbyAgent();
      }
    }, 500);
  }

  function hostStillPresent() {
    if (!currentRoomOwner) return false;
    if (currentRoomOwner === pid) return true;
    if (!room) return false;
    for (var i = 0; i < room.members.length; i++) {
      if (pidByUid[room.members[i].uid] === currentRoomOwner) return true;
    }
    return false;
  }

  function formatNotice(verb, who) {
    if (!who) return "";
    if (verb === "joined") return T.notice_joined(who);
    if (verb === "left") return T.notice_left(who);
    if (verb === "paused") return T.notice_paused(who);
    if (verb === "resumed" || verb === "playing") return T.notice_resumed(who);
    if (verb === "seeked") return T.notice_seeked(who);
    if (verb === "host_changed") return T.notice_host_changed(who);
    return who + " · " + verb;
  }

  function getVideo() {
    var vid = null;
    if (typeof Lampa.PlayerVideo !== "undefined" && Lampa.PlayerVideo.video)
      vid = Lampa.PlayerVideo.video();
    if (!vid)
      vid =
        document.querySelector(".player-video__display video") ||
        document.querySelector(".player video") ||
        document.querySelector("video");
    return vid;
  }

  function roomMarker() {
    if (!currentRoomId) return "";
    try {
      return btoa(
        unescape(
          encodeURIComponent(currentRoomId + ":" + (currentRoomPassword || "")),
        ),
      );
    } catch (err) {
      return "";
    }
  }

  function playRoomStream(url, title, poster) {
    console.log(
      "[WatchTogether]",
      "start room stream via",
      playerLaunch,
      url ? url.substr(0, 60) : "",
    );

    if (Lampa.Player.runas) Lampa.Player.runas(playerLaunch);

    Lampa.Player.play({
      url: url,
      title: title || "",
      poster: poster || "",
      launch_player: playerLaunch,
    });
  }

  function pauseVideo(vid) {
    if (typeof Lampa.PlayerVideo !== "undefined" && Lampa.PlayerVideo.pause)
      Lampa.PlayerVideo.pause();
    else if (vid) vid.pause();
  }

  function playVideo(vid, onFail) {
    if (typeof Lampa.PlayerVideo !== "undefined" && Lampa.PlayerVideo.play)
      return Lampa.PlayerVideo.play();
    if (!vid) return;
    var p = vid.play();
    if (p && p["catch"])
      p["catch"](function () {
        if (onFail) onFail();
      });
  }

  function bufferedAhead(vid, position) {
    var ranges;

    try {
      ranges = vid.buffered;
    } catch (err) {
      return NO_RANGES;
    }
    if (!ranges || !ranges.length) return NO_RANGES;

    for (var i = 0; i < ranges.length; i++) {
      if (position >= ranges.start(i) - 1 && position <= ranges.end(i)) {
        return ranges.end(i) - position;
      }
    }

    return OUT_OF_RANGE;
  }

  function holdReadyNow(vid) {
    if (!vid) return false;

    var now = Date.now();
    var ahead = bufferedAhead(vid, holdPosition);

    if (ahead > holdBufferSeen + 0.25) {
      holdBufferSeen = ahead;
      holdBufferAt = now;
    }

    if (ahead === NO_RANGES) return vid.readyState >= 3;

    if (ahead >= HOLD_BUFFER_S) return true;
    if (vid.readyState >= 4 && ahead > 0) return true;

    var idle = now - (holdBufferAt || now);

    if (ahead >= HOLD_MIN_BUFFER_S && idle > HOLD_STALL_MS) {
      console.log(
        "[WatchTogether]",
        "hold: buffer stopped growing at",
        ahead.toFixed(2) + "s - accepting",
      );
      return true;
    }

    if (!holdNudgeDone && idle > HOLD_NUDGE_MS && vid.readyState >= 1) {
      holdNudgeDone = true;
      console.log(
        "[WatchTogether]",
        "hold: nudging loader, ahead=" +
          ahead.toFixed(2) +
          " pos=" +
          (vid.currentTime || 0).toFixed(2),
      );
      setExpectedSeek(holdPosition);
      vid.currentTime = holdPosition + 0.05;
    }

    return false;
  }

  function resetHoldProgress() {
    holdBufferSeen = -1;
    holdBufferAt = Date.now();
    holdNudgeDone = false;
  }

  function startJoinHold(newcomerPid) {
    if (!inRoom || !iAmHost()) return;

    var vid = getVideo();

    if (!holdActive) {
      holdActive = true;
      holdPosition = vid ? vid.currentTime || 0 : 0;
      holdWaiting = {};
      holdReadySent = false;
      resetHoldProgress();

      if (vid && !vid.paused) {
        expectPause();
        pauseVideo(vid);
      }

      Lampa.Noty.show(T.notice_hold);
      console.log("[WatchTogether]", "hold start at", holdPosition.toFixed(2));
    }

    if (newcomerPid && newcomerPid !== pid) holdWaiting[newcomerPid] = true;

    roomSend({ t: "hold", p: holdPosition, sp: roomSpeed });

    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(finishHold, HOLD_MAX_MS);
  }

  function markHoldReady(fromPid) {
    if (!holdActive || !iAmHost()) return;
    if (fromPid) delete holdWaiting[fromPid];
    checkHoldDone();
  }

  function checkHoldDone() {
    if (!holdActive || !iAmHost()) return;

    for (var key in holdWaiting) {
      if (holdWaiting.hasOwnProperty(key)) return;
    }

    if (!holdReadyNow(getVideo())) return;

    finishHold();
  }

  function finishHold() {
    if (!holdActive) return;

    var position = holdPosition;

    console.log("[WatchTogether]", "hold finish at", position.toFixed(2));
    roomSend({ t: "go", p: position, sp: roomSpeed });
    releaseHold(position);
  }

  function releaseHold(position) {
    var wasHolding = holdActive;

    holdActive = false;
    holdWaiting = {};
    holdReadySent = false;
    resetHoldProgress();
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }

    initialSyncLock = false;
    targetInitialState = null;

    if (wasHolding) Lampa.Noty.show(T.notice_go);

    var vid = getVideo();
    if (!vid) return;

    if (
      typeof position === "number" &&
      Math.abs((vid.currentTime || 0) - position) > 0.5
    ) {
      setExpectedSeek(position);
      vid.currentTime = position;
    }

    if (vid.paused) {
      expectPlay();
      playVideo(vid, function () {
        expectedState.play = false;
      });
    }
  }

  function applyHold(position) {
    holdActive = true;
    holdPosition = position || 0;
    holdReadySent = false;
    resetHoldProgress();

    Lampa.Noty.show(T.notice_hold);
    console.log("[WatchTogether]", "hold received at", holdPosition.toFixed(2));

    var vid = getVideo();
    if (!vid) return;

    if (!vid.paused) {
      expectPause();
      pauseVideo(vid);
    }

    if (Math.abs((vid.currentTime || 0) - holdPosition) > 1) {
      setExpectedSeek(holdPosition);
      vid.currentTime = holdPosition;
    }
  }

  function holdTick() {
    if (!holdActive) return;

    if (iAmHost()) return checkHoldDone();

    if (holdReadySent) return;

    var vid = getVideo();
    if (!holdReadyNow(vid)) return;
    if (!roomSend({ t: "ready" })) return;

    holdReadySent = true;
    console.log(
      "[WatchTogether]",
      "hold: ready sent, ahead=" + bufferedAhead(vid, holdPosition).toFixed(2),
    );
  }

  function sendSync(state, verb) {
    if (!inRoom || initialSyncLock || holdActive) return;
    var vid = getVideo();
    if (!vid) return;

    if (verb) {
      roomSend({
        t: "act",
        s: state,
        p: vid.currentTime || 0,
        v: verb,
        n: getDisplayName(),
        sp: roomSpeed,
      });
    } else {
      roomSend({ t: "sync", s: state, p: vid.currentTime || 0, sp: roomSpeed });
    }
  }

  var expectedSeekTimer = null;
  var seekGuardUntil = 0;
  var lastSeekBroadcastAt = 0;
  var lastKnownPosition = 0;
  var pendingSeekBroadcast = null;
  var pendingAct = null;

  // both carry a position that only makes sense for the video that was playing when they were
  // recorded - they must die with it, or they land on the next episode
  function clearPendingSync() {
    if (pendingSeekBroadcast) {
      clearTimeout(pendingSeekBroadcast);
      pendingSeekBroadcast = null;
    }
    pendingAct = null;
  }

  function applyPendingAct() {
    if (!pendingAct) return;

    if (Date.now() > pendingAct.until) {
      console.log(
        "[WatchTogether]",
        "act seek given up after " + PENDING_ACT_MAX_MS + "ms",
      );
      pendingAct = null;
      return;
    }

    // same gates the live path applies - a retry must never outrank a newer local action
    if (lastUserActionTime > pendingAct.at) {
      console.log(
        "[WatchTogether]",
        "act seek dropped, superseded by local action",
      );
      pendingAct = null;
      return;
    }
    if (!inRoom || initialSyncLock || isRewinding() || holdActive) return;
    if (Date.now() - lastUserActionTime < 2000) return;

    var vid = getVideo();
    if (!vid) return;
    if (videoBusy(vid)) return;
    if (Date.now() - lastHardSeekAt <= HARD_SEEK_COOLDOWN_MS) return;

    var act = pendingAct;
    pendingAct = null;

    console.log("[WatchTogether]", "act seek retry");
    isSystemSyncing = true;
    applySync(vid, act.state, act.position, act.atServerTime);
    setTimeout(function () {
      isSystemSyncing = false;
    }, 500);
  }

  function setExpectedSeek(pos) {
    expectedState.seek = pos;
    seekGuardUntil = Date.now() + SEEK_GUARD_MS;

    if (expectedSeekTimer) clearTimeout(expectedSeekTimer);
    expectedSeekTimer = setTimeout(function () {
      expectedSeekTimer = null;
      expectedState.seek = -1;
    }, SEEK_GUARD_MS);
  }

  function clearExpectedSeek() {
    if (expectedSeekTimer) {
      clearTimeout(expectedSeekTimer);
      expectedSeekTimer = null;
    }
    expectedState.seek = -1;
    seekGuardUntil = 0;
  }

  function seekIsOurs() {
    return Date.now() < seekGuardUntil;
  }

  function broadcastUserSeek(vid) {
    if (
      Math.abs((vid.currentTime || 0) - lastKnownPosition) < SEEK_MIN_JUMP_S
    ) {
      console.log(
        "[WatchTogether]",
        "seek ignored, position barely moved",
        (vid.currentTime || 0).toFixed(2),
      );
      return;
    }

    if (isRewinding()) rewindUntil = Date.now() + 400;
    lastKnownPosition = vid.currentTime || 0;
    lastUserActionTime = Date.now();

    // throttle defers the burst, never drops it - a dropped seek means the host
    // heartbeat drags us back to its old position two seconds later
    if (Date.now() - lastSeekBroadcastAt < SEEK_BROADCAST_MIN_MS) {
      console.log(
        "[WatchTogether]",
        "seek broadcast deferred at",
        (vid.currentTime || 0).toFixed(2),
      );
      // debounce, not a periodic flush: a long scrub must end in ONE extra broadcast,
      // not one every SEEK_BROADCAST_MIN_MS - each of those costs everyone a hard seek
      if (pendingSeekBroadcast) clearTimeout(pendingSeekBroadcast);
      pendingSeekBroadcast = setTimeout(function () {
        pendingSeekBroadcast = null;
        if (!inRoom || initialSyncLock || holdActive) return;
        var v = getVideo();
        if (!v) return;
        lastSeekBroadcastAt = Date.now();
        lastKnownPosition = v.currentTime || 0;
        lastUserActionTime = Date.now();
        sendSync(v.paused ? "paused" : "playing", "seeked");
      }, SEEK_BROADCAST_MIN_MS);
      return;
    }

    if (pendingSeekBroadcast) {
      clearTimeout(pendingSeekBroadcast);
      pendingSeekBroadcast = null;
    }
    lastSeekBroadcastAt = Date.now();
    sendSync(vid.paused ? "paused" : "playing", "seeked");
  }

  function isRewinding() {
    return Date.now() < rewindUntil;
  }

  function onUserRewind() {
    if (!inRoom || initialSyncLock) return;
    rewindUntil = Date.now() + REWIND_GRACE_MS;
    lastUserActionTime = Date.now();
    clearExpectedSeek();
  }

  function expectPlay() {
    expectedState.play = true;
    setTimeout(function () {
      expectedState.play = false;
    }, 500);
  }

  function expectPause() {
    expectedState.pause = true;
    setTimeout(function () {
      expectedState.pause = false;
    }, 500);
  }

  function clearRateAdjust(vid) {
    if (vid._lp_rate_timeout) {
      clearTimeout(vid._lp_rate_timeout);
      vid._lp_rate_timeout = null;
    }
    vid._lp_correcting = false;
    if (!canAdjustRate()) return;
    if (vid.playbackRate !== roomSpeed) vid.playbackRate = roomSpeed;
  }

  function videoBusy(vid) {
    // a seek in flight is the loader working - same rule as buffering, do not fight it.
    // a long jump can stay seeking for many seconds; correcting position mid-flight
    // is what dragged the seeker back to the old spot
    return !!vid._lp_buffering || vid.readyState < 3 || !!vid.seeking;
  }

  var appleNative = (function () {
    try {
      return !!(
        Lampa.Platform &&
        (Lampa.Platform.is("apple") || Lampa.Platform.is("apple_tv"))
      );
    } catch (err) {
      return false;
    }
  })();

  function canAdjustRate() {
    return !appleNative;
  }

  function hardSeekThreshold() {
    return appleNative ? SYNC_HARD_SEEK_APPLE_S : SYNC_HARD_SEEK_S;
  }

  function applySync(vid, state, basePosition, atServerTime) {
    if (vid.currentTime === undefined) return;

    var busy = videoBusy(vid);

    if (busy) {
      clearRateAdjust(vid);
    } else {
      var expected = expectedPositionNow(state, basePosition, atServerTime);
      var diff = vid.currentTime - expected;
      var absDiff = Math.abs(diff);

      if (absDiff > hardSeekThreshold()) {
        clearRateAdjust(vid);
        vid._lp_correcting = false;

        if (Date.now() - lastHardSeekAt > HARD_SEEK_COOLDOWN_MS) {
          lastHardSeekAt = Date.now();
          console.log(
            "[WatchTogether]",
            "hard seek",
            vid.currentTime.toFixed(2),
            "->",
            expected.toFixed(2),
          );
          setExpectedSeek(expected);
          vid.currentTime = expected;
        } else {
          console.log(
            "[WatchTogether]",
            "hard seek skipped (cooldown), drift",
            absDiff.toFixed(2),
          );
        }
      } else if (
        canAdjustRate() &&
        (vid._lp_correcting
          ? absDiff > SYNC_TOLERANCE_S
          : absDiff > SYNC_CORRECT_ON_S)
      ) {
        vid._lp_correcting = true;

        var raw = diff * SYNC_RATE_GAIN;
        var offset = Math.max(
          -SYNC_MAX_RATE_OFFSET,
          Math.min(SYNC_MAX_RATE_OFFSET, raw),
        );
        var newRate = roomSpeed - offset;
        if (Math.abs(vid.playbackRate - newRate) > 0.005)
          vid.playbackRate = newRate;
        if (vid._lp_rate_timeout) clearTimeout(vid._lp_rate_timeout);
        vid._lp_rate_timeout = setTimeout(function () {
          vid._lp_rate_timeout = null;
          vid._lp_correcting = false;
          if (vid.playbackRate !== roomSpeed) vid.playbackRate = roomSpeed;
        }, SYNC_RATE_RESET_MS);
      } else {
        vid._lp_correcting = false;
        clearRateAdjust(vid);
      }
    }

    if (state === "paused" && !vid.paused) {
      expectPause();
      clearRateAdjust(vid);
      pauseVideo(vid);
      return;
    }

    if (state === "playing" && vid.paused && !busy) {
      expectPlay();
      playVideo(vid, function () {
        expectedState.play = false;
      });
    }
  }

  setInterval(function () {
    if (inRoom || joining) {
      if (playerIsOpen()) roomAliveAt = Date.now();
      else if (roomAliveAt && Date.now() - roomAliveAt > ROOM_ORPHAN_MS) {
        console.log(
          "[WatchTogether]",
          lplog("room without player - auto leave"),
        );
        leaveRoom(true);
      }
    }

    if (!inRoom) {
      $(".watchtogether-room-badge").remove();
      return;
    }

    // before the video check - a deferred act must be able to expire while there is no player,
    // otherwise it silences the host heartbeat indefinitely
    applyPendingAct();

    var vid = getVideo();
    if (!vid) return;
    updateRoomBadge();
    holdTick();

    // our own seek that never produced a 'seeked' event (target equals current position) would
    // otherwise keep the guard armed for the full SEEK_GUARD_MS and swallow the next user seek
    if (
      expectedState.seek >= 0 &&
      !vid.seeking &&
      Math.abs((vid.currentTime || 0) - expectedState.seek) <= 0.5
    )
      clearExpectedSeek();

    if (!seekIsOurs()) lastKnownPosition = vid.currentTime || 0;

    if (vid._lp_hooked) return;
    vid._lp_hooked = true;

    // A joining client starts at the room's speed before the first sync lands.
    if (canAdjustRate() && Math.abs((vid.playbackRate || 1) - roomSpeed) > 0.01)
      vid.playbackRate = roomSpeed;

    var enforceInitial = function () {
      if (!initialSyncLock || !targetInitialState) return;
      var expected = expectedPositionNow(
        targetInitialState.state,
        targetInitialState.position,
        targetInitialState.atServerTime,
      );
      if (Math.abs(vid.currentTime - expected) > 1) {
        setExpectedSeek(expected);
        vid.currentTime = expected;
      }
      if (targetInitialState.state === "paused") {
        expectPause();
        pauseVideo(vid);
      } else {
        expectPlay();
        playVideo(vid);
      }
      if (!vid._lp_enforce_timeout) {
        vid._lp_enforce_timeout = setTimeout(function () {
          vid._lp_enforce_timeout = null;
          initialSyncLock = false;
          targetInitialState = null;
          expectedState.play = false;
          expectedState.pause = false;
        }, 3000);
      }
    };

    if (vid.readyState >= 1) enforceInitial();
    else vid.addEventListener("loadedmetadata", enforceInitial);
    vid.addEventListener("canplay", enforceInitial);

    vid.addEventListener("waiting", function () {
      vid._lp_buffering = true;
      console.log(
        "[WatchTogether]",
        "buffering start at",
        (vid.currentTime || 0).toFixed(2),
      );
    });
    vid.addEventListener("canplay", function () {
      if (vid._lp_buffering)
        console.log(
          "[WatchTogether]",
          "buffering end at",
          (vid.currentTime || 0).toFixed(2),
        );
      vid._lp_buffering = false;
    });
    vid.addEventListener("playing", function () {
      if (vid._lp_buffering)
        console.log(
          "[WatchTogether]",
          "buffering end at",
          (vid.currentTime || 0).toFixed(2),
        );
      vid._lp_buffering = false;
    });
    vid.addEventListener("error", function () {
      console.log(
        "[WatchTogether]",
        "video error",
        vid.error ? "code " + vid.error.code : "",
      );
    });
    vid.addEventListener("stalled", function () {
      console.log("[WatchTogether]", "video stalled");
    });

    vid.addEventListener("ratechange", function () {
      if (
        !inRoom ||
        initialSyncLock ||
        holdActive ||
        isSystemSyncing ||
        vid._lp_correcting
      )
        return;
      var newRate = vid.playbackRate || 1.0;
      if (!(newRate >= 0.25 && newRate <= 4.0)) return;
      if (Math.abs(newRate - roomSpeed) < 0.01) return;
      roomSpeed = newRate;
      lastUserActionTime = Date.now();
      // Only the host drives the room speed; guests keep it for themselves.
      if (iAmHost()) {
        roomSend({
          t: "act",
          s: vid.paused ? "paused" : "playing",
          p: vid.currentTime || 0,
          n: getDisplayName(),
          sp: roomSpeed,
        });
      }
    });

    vid.addEventListener("play", function () {
      if (initialSyncLock) {
        if (targetInitialState && targetInitialState.state === "paused") {
          pauseVideo(vid);
        }
        return;
      }
      var wasExpected = expectedState.play;
      expectedState.play = false;
      if (wasExpected) return;

      if (holdActive) {
        console.log(
          "[WatchTogether]",
          "user started playback during hold - releasing it",
        );
        lastUserActionTime = Date.now();

        if (iAmHost()) {
          finishHold();
        } else {
          holdReadySent = true;
          roomSend({ t: "ready" });
          releaseHold(holdPosition);
        }
        return;
      }

      if (isRewinding()) {
        lastUserActionTime = Date.now();
        return;
      }
      if (vid._lp_buffer_paused) {
        vid._lp_buffer_paused = false;
        return;
      }
      lastUserActionTime = Date.now();
      sendSync("playing", "resumed");
    });

    vid.addEventListener("pause", function () {
      clearRateAdjust(vid);
      if (initialSyncLock) return;
      var wasExpected = expectedState.pause;
      expectedState.pause = false;
      if (wasExpected) return;

      if (isRewinding()) {
        lastUserActionTime = Date.now();
        return;
      }
      if (vid._lp_buffering || vid.readyState < 3) {
        vid._lp_buffer_paused = true;
        return;
      }
      if (vid.ended) return;
      lastUserActionTime = Date.now();
      sendSync("paused", "paused");
    });

    vid.addEventListener("seeked", function () {
      if (!isSystemSyncing) clearRateAdjust(vid);
      if (initialSyncLock) {
        if (targetInitialState) {
          var expected = expectedPositionNow(
            targetInitialState.state,
            targetInitialState.position,
            targetInitialState.atServerTime,
          );
          if (Math.abs(vid.currentTime - expected) > 1) {
            setExpectedSeek(expected);
            vid.currentTime = expected;
          }
        }
        return;
      }
      if (isSystemSyncing) return;

      if (seekIsOurs()) {
        console.log(
          "[WatchTogether]",
          "own seek settled at",
          (vid.currentTime || 0).toFixed(2),
        );
        clearExpectedSeek();
        lastKnownPosition = vid.currentTime || 0;
        return;
      }

      if (expectedState.seek !== -1) clearExpectedSeek();

      broadcastUserSeek(vid);
    });

    // announce the jump when it STARTS, not when it settles: currentTime already holds the
    // target, while a long jump can stay unsettled for many seconds - and an unannounced
    // seeker gets dragged back by the host heartbeat the moment its buffer is ready
    vid.addEventListener("seeking", function () {
      // deliberately NOT gated on isSystemSyncing: that flag stays up 500ms after every
      // applied sync, i.e. a quarter of the time at a 2s heartbeat, and it swallowed any
      // user seek started in that window. seekIsOurs() is armed only when we actually
      // moved the position ourselves, which is the real question here
      if (initialSyncLock || seekIsOurs()) return;
      broadcastUserSeek(vid);
    });
  }, 1000);

  setInterval(function () {
    if (!inRoom || initialSyncLock || isSystemSyncing || holdActive) return;
    if (!iAmHost()) return;
    if (expectedState.seek !== -1) return;
    if (pendingAct) return;
    var vid = getVideo();
    if (!vid) return;
    if (vid.ended) return;
    sendSync(vid.paused ? "paused" : "playing", null);
  }, SYNC_HEARTBEAT_MS);

  var debugRefreshTimer = null;

  function buildDebugHtml() {
    var wsState =
      room && room.ws
        ? ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][room.ws.readyState] ||
          "UNKNOWN"
        : "NO_WS";
    var lastRtt = pingSamples.length
      ? pingSamples[pingSamples.length - 1].rtt
      : "-";
    var bestRtt = "-";
    for (var i = 0; i < pingSamples.length; i++) {
      if (bestRtt === "-" || pingSamples[i].rtt < bestRtt)
        bestRtt = pingSamples[i].rtt;
    }
    var pendingCount = 0;
    for (var k in echoPending) {
      if (echoPending.hasOwnProperty(k)) pendingCount++;
    }

    var pos = "-",
      bufRdy = "-";
    var vid = getVideo();
    if (vid) {
      pos = (vid.currentTime || 0).toFixed(2);
      bufRdy = vid.readyState + (vid._lp_buffering ? "*" : "");
    }

    return [
      "<div><b>Relay:</b> " + safe(wsState) + "</div>",
      "<div><b>Room:</b> " +
        safe(currentRoomId || "-") +
        (currentRoomPassword ? " &#128274;" : "") +
        "</div>",
      "<div><b>Role:</b> " + (iAmHost() ? "host" : "guest") + "</div>",
      "<div><b>Members:</b> " + memberCount() + "</div>",
      "<div><b>Lobby:</b> " +
        (lobbyHost && lobbyHost.alive() ? "published" : "off") +
        "</div>",
      "<div><b>Clock offset:</b> " + Math.round(serverTimeOffset) + " ms</div>",
      "<div><b>RTT last/best:</b> " + lastRtt + " / " + bestRtt + " ms</div>",
      "<div><b>Echo pending:</b> " + pendingCount + "</div>",
      "<div><b>initialSyncLock:</b> " + initialSyncLock + "</div>",
      "<div><b>Video:</b> " + pos + " s (ready " + bufRdy + ")</div>",
    ].join("");
  }

  function updateRoomBadge() {
    if (!inRoom || !currentRoomId) return;

    var nameContainer = $(".player-info__name, .player-panel__name");
    if (nameContainer.length && !$(".watchtogether-room-badge").length) {
      var badge = $(
        '<div class="watchtogether-room-badge" style="position:relative;display:inline-block;margin-left:15px;padding:4px 12px;background:rgba(255,255,255,0.15);border-radius:6px;font-size:0.85em;color:#fff;cursor:pointer;">' +
          '<span class="watchtogether-room-badge-text"></span>' +
          '<div class="watchtogether-debug-panel" style="display:none;position:absolute;top:100%;left:0;margin-top:6px;padding:8px 12px;background:rgba(0,0,0,0.9);border:1px solid rgba(255,255,255,0.25);border-radius:6px;z-index:9999;white-space:nowrap;font-family:monospace;font-size:0.85em;line-height:1.5;text-align:left;color:#fff;"></div>' +
          "</div>",
      );
      badge.on("mouseenter", function () {
        var $p = $(this).find(".watchtogether-debug-panel");
        $p.html(buildDebugHtml()).css("display", "block");
        if (debugRefreshTimer) clearInterval(debugRefreshTimer);
        debugRefreshTimer = setInterval(function () {
          if ($p.is(":visible")) $p.html(buildDebugHtml());
          else {
            clearInterval(debugRefreshTimer);
            debugRefreshTimer = null;
          }
        }, 500);
      });
      badge.on("mouseleave", function () {
        $(this).find(".watchtogether-debug-panel").css("display", "none");
        if (debugRefreshTimer) {
          clearInterval(debugRefreshTimer);
          debugRefreshTimer = null;
        }
      });
      nameContainer.after(badge);
    }

    var $badge = $(".watchtogether-room-badge");
    if (!$badge.length) return;

    var ok = room && room.alive();
    var dotColor = ok ? "#00e676" : "#ff5252";
    var dot =
      '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' +
      dotColor +
      ';margin-right:8px;vertical-align:middle;"></span>';

    $badge
      .find(".watchtogether-room-badge-text")
      .html(
        dot +
          T.badge_room +
          ': <b style="color:#00e676;">' +
          safe(currentRoomName || currentRoomId) +
          "</b> " +
          '<span style="opacity:.6">[' +
          safe(currentRoomId) +
          "]</span> | " +
          T.badge_viewers +
          ": <b>" +
          memberCount() +
          "</b>",
      );
  }

  var passwordParamItem = null;
  function updatePasswordVisibility() {
    if (passwordParamItem)
      passwordParamItem.toggleClass("hide", !isUsePassword());
  }

  var displayNameParamItem = null;
  function syncDisplayNameField() {
    var name = getDisplayName();
    if (displayNameParamItem)
      displayNameParamItem.find(".settings-param__value").text(name);
  }

  function registerSettings() {
    if (!Lampa.SettingsApi) return;

    Lampa.SettingsApi.addComponent({
      component: "lparty",
      name: T.settings_title,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"></circle><path d="M10.5 9.5 L10.5 14.5 L15 12 Z" fill="currentColor" stroke="none"></path><circle cx="4" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="4" cy="20" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="20" r="1.8" fill="currentColor" stroke="none"></circle></svg>',
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: { name: "watchtogether_meta", type: "static" },
      field: {
        name: META.name + " v" + META.version,
        description: "Authors: " + META.author,
      },
      onRender: function (item) {
        item.on("hover:enter", function () {});
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: { name: "watchtogether_open_rooms", type: "button" },
      field: {
        name: T.settings_open_rooms,
        description: T.settings_open_rooms_descr,
      },
      onChange: function () {
        openRoomBrowser();
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_show_head",
        type: "trigger",
        default: true,
      },
      field: { name: T.param_show_head, description: T.param_show_head_descr },
      onChange: function () {
        syncHeadIcon();
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_display_name",
        type: "input",
        values: "",
        default: "",
        placeholder: getDisplayName(),
      },
      field: { name: T.param_name, description: T.param_name_descr },
      onRender: function (item) {
        displayNameParamItem = item;
        syncDisplayNameField();
      },
      onChange: function () {
        syncDisplayNameField();
      },
    });

    if (Lampa.Platform.is("android")) {
      Lampa.SettingsApi.addParam({
        component: "lparty",
        param: {
          name: "watchtogether_player",
          type: "select",
          values: {
            inner: Lampa.Lang.translate("settings_param_player_inner"),
            android: "Android",
          },
          default: "inner",
        },
        field: {
          name: Lampa.Lang.translate("settings_player_type"),
          description: Lampa.Lang.translate("settings_player_type_descr"),
        },
        onChange: function (value) {
          Lampa.Storage.set("watchtogether_player", value);
          playerLaunch = value;
        },
      });
    }

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: { name: "watchtogether_publish", type: "trigger", default: true },
      field: { name: T.param_publish, description: T.param_publish_descr },
      onChange: function () {
        if (inRoom && iAmHost()) {
          if (isPublish()) startLobbyAgent();
          else stopLobbyAgent();
        }
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_use_password",
        type: "trigger",
        default: false,
      },
      field: { name: T.param_use_pwd, description: T.param_use_pwd_descr },
      onChange: function () {
        updatePasswordVisibility();
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_default_password",
        type: "input",
        values: "",
        default: "",
        placeholder: "",
      },
      field: { name: T.param_pwd, description: T.param_pwd_descr },
      onRender: function (item) {
        passwordParamItem = item;
        updatePasswordVisibility();
      },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_relay",
        type: "input",
        values: "",
        default: DEFAULT_RELAY,
        placeholder: DEFAULT_RELAY,
      },
      field: { name: T.param_relay, description: T.param_relay_descr },
    });

    Lampa.SettingsApi.addParam({
      component: "lparty",
      param: {
        name: "watchtogether_invite",
        type: "input",
        values: "",
        default: DEFAULT_INVITE,
        placeholder: DEFAULT_INVITE,
      },
      field: { name: T.param_invite, description: T.param_invite_descr },
    });
  }

  var headButton = null;

  function addHeadIcon() {
    if (window.WatchTogether_head_added) return;
    if (!Lampa.Head || typeof Lampa.Head.addIcon !== "function") return;
    window.WatchTogether_head_added = true;

    var svg =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"></circle><path d="M10.5 9.5 L10.5 14.5 L15 12 Z" fill="currentColor" stroke="none"></path><circle cx="4" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="4" cy="20" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="20" r="1.8" fill="currentColor" stroke="none"></circle></svg>';
    headButton = Lampa.Head.addIcon(svg, openRoomBrowser);
    if (headButton && headButton.attr) headButton.attr("title", T.menu_title);
  }

  function syncHeadIcon() {
    var show = isShowHead();
    if (show) addHeadIcon();
    if (headButton && headButton.toggleClass)
      headButton.toggleClass("hide", !show);
  }

  if (window.appready) syncHeadIcon();
  else
    Lampa.Listener.follow("app", function (e) {
      if (e.type === "ready") syncHeadIcon();
    });

  Lampa.Listener.follow("full", function (e) {
    if (e.type !== "complite") return;

    var cardData =
      (e.data && e.data.movie) ||
      (e.object && e.object.activity && e.object.activity.object
        ? e.object.activity.object.item
        : null) ||
      (e.object && e.object.item);
    if (!cardData) return;

    lastViewedCard = cardData;
  });

  function onPlayerStart(e) {
    if (!e || !e.url) return;
    lastStreamUrl = e.url;
    lastStreamTitle =
      (e.movie && (e.movie.title || e.movie.name)) || e.title || "";

    roomAliveAt = Date.now();

    var switching = isEpisodeSwitching();
    clearEpisodeSwitch();

    if (switching && inRoom) {
      if (iAmHost()) {
        currentRoomMeta.url = e.url;
        currentRoomMeta.title = lastStreamTitle;
        roomSend({ t: "url", url: e.url, ti: lastStreamTitle });
      }
      return;
    }

    if (pendingShareCard) {
      var card = pendingShareCard;
      var url = e.url;
      var fresh = Date.now() - pendingShareAt < PENDING_SHARE_MS;

      pendingShareCard = null;
      pendingShareAt = 0;

      if (fresh) {
        uiPrevController = "player";

        setTimeout(function () {
          console.log("[WatchTogether]", "auto create room from card menu");
          autoCreateRoomFromPending(card, url);
        }, SHARE_START_DELAY_MS);
      }
    }
  }

  if (typeof Lampa.PlayerVideo !== "undefined" && Lampa.PlayerVideo.listener) {
    Lampa.PlayerVideo.listener.follow("start", onPlayerStart);
    Lampa.PlayerVideo.listener.follow("rewind", onUserRewind);
  }

  if (typeof Lampa.Player !== "undefined" && Lampa.Player.listener) {
    Lampa.Player.listener.follow("start", onPlayerStart);
    Lampa.Player.listener.follow("destroy", function () {
      clearPendingSync();

      var vid = getVideo();
      if (vid) {
        vid._lp_hooked = false;
        clearRateAdjust(vid);
      }

      if (!inRoom && !joining) return;

      if (isEpisodeSwitching()) return;

      leaveRoom(true);
    });
  }

  if (
    typeof Lampa.PlayerPlaylist !== "undefined" &&
    Lampa.PlayerPlaylist.listener &&
    Lampa.PlayerPlaylist.listener.follow
  ) {
    Lampa.PlayerPlaylist.listener.follow("select", function () {
      if (inRoom && iAmHost()) markEpisodeSwitch();
    });
  }

  window.addEventListener("beforeunload", function () {
    if (inRoom) leaveRoom(true);
  });

  var ICON_COPY =
    '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var ICON_SHARE =
    '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"></path></svg>';

  function canShare() {
    try {
      return (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      );
    } catch (err) {
      return false;
    }
  }

  function legacyCopy(text) {
    try {
      var area = document.createElement("textarea");

      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";

      document.body.appendChild(area);
      area.select();
      if (area.setSelectionRange) area.setSelectionRange(0, text.length);

      var ok = document.execCommand("copy");

      document.body.removeChild(area);

      return !!ok;
    } catch (err) {
      return false;
    }
  }

  function copyToClipboard(text, done) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            done(true);
          },
          function () {
            done(legacyCopy(text));
          },
        );
        return;
      }
    } catch (err) {}

    done(legacyCopy(text));
  }

  function ensureQrStyle() {
    if (document.getElementById("watchtogether-qr-style")) return;

    var style = document.createElement("style");

    style.id = "watchtogether-qr-style";
    style.textContent =
      ".watchtogether-qr-actions{display:flex;justify-content:center;gap:0.8em;margin-top:0.9em;}" +
      ".watchtogether-qr-btn{display:inline-flex;align-items:center;justify-content:center;width:2.8em;height:2.8em;" +
      "border-radius:50%;background:rgba(255,255,255,0.14);color:#fff;cursor:pointer;" +
      "transition:background 0.2s,color 0.2s,transform 0.2s;padding:0.7em;}" +
      ".watchtogether-qr-btn.focus,.watchtogether-qr-btn:hover{background:#fff;color:#000;transform:scale(1.08);}";

    document.head.appendChild(style);
  }

  function showRoomQr() {
    var link = inviteLink();
    var qrUrl =
      "https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=" +
      encodeURIComponent(link);

    var isMobile =
      Lampa.Platform &&
      Lampa.Platform.screen &&
      Lampa.Platform.screen("mobile");
    uiPrevController = isMobile ? "player" : "player_panel";

    ensureQrStyle();

    var actions =
      '<div class="watchtogether-qr-actions">' +
      '<div class="watchtogether-qr-btn selector" data-watchtogether-action="copy" title="' +
      safe(T.qr_copy) +
      '">' +
      ICON_COPY +
      "</div>" +
      (canShare()
        ? '<div class="watchtogether-qr-btn selector" data-watchtogether-action="share" title="' +
          safe(T.qr_share) +
          '">' +
          ICON_SHARE +
          "</div>"
        : "") +
      "</div>";

    var body = $(
      '<div style="text-align:center;">' +
        '<div style="font-size:1.6em;font-weight:300;margin-bottom:0.8em;">' +
        T.qr_title +
        " - " +
        safe(currentRoomName || currentRoomId || "") +
        "</div>" +
        '<img src="' +
        qrUrl +
        '" style="width:20em;max-width:70vw;height:auto;background:#fff;padding:0.6em;border-radius:0.6em;" />' +
        '<div style="margin-top:1em;opacity:0.7;">' +
        T.qr_hint +
        "</div>" +
        '<div style="margin-top:0.5em;font-size:0.8em;opacity:0.5;word-break:break-all;">' +
        safe(link) +
        "</div>" +
        actions +
        "</div>",
    );

    Lampa.Modal.open({
      title: "",
      size: "medium",
      html: body,
      select: body.find('[data-watchtogether-action="copy"]')[0],
      onSelect: function (item) {
        var target = $(item);
        var action =
          target.attr("data-watchtogether-action") ||
          target
            .closest("[data-watchtogether-action]")
            .attr("data-watchtogether-action");

        if (action === "copy") {
          copyToClipboard(link, function (ok) {
            lplog("invite link copy", ok ? "ok" : "failed");
            Lampa.Noty.show(ok ? T.qr_copied : T.qr_copy_fail);
          });
          return;
        }

        if (action === "share") {
          try {
            var shared = navigator.share({
              title: T.qr_title,
              text: currentRoomName || currentRoomId || T.qr_title,
              url: link,
            });

            if (shared && shared["catch"])
              shared["catch"](function (err) {
                if (err && err.name === "AbortError") return;
                lplog("share failed", err && err.name);
              });
          } catch (err) {
            lplog("share threw", err && err.message);
          }
        }
      },
      onBack: function () {
        Lampa.Modal.close();
        restoreController();
      },
    });
  }

  function createRoomFromPlayer() {
    dropStaleRoom();

    if (inRoom) {
      Lampa.Noty.show(
        T.already_in_room(currentRoomName || currentRoomId || ""),
      );
      return;
    }
    if (!lastStreamUrl) {
      Lampa.Noty.show(T.need_url);
      return;
    }

    var isMobile =
      Lampa.Platform &&
      Lampa.Platform.screen &&
      Lampa.Platform.screen("mobile");
    uiPrevController = isMobile ? "player" : "player_panel";
    restoreController();

    autoCreateRoomFromPending(lastViewedCard || {}, lastStreamUrl);
  }

  if (
    typeof Lampa.Select !== "undefined" &&
    Lampa.Select.listener &&
    Lampa.Select.listener.follow
  ) {
    Lampa.Select.listener.follow("preshow", function (e) {
      if (!e || !e.active || !Array.isArray(e.active.items)) return;

      var items = e.active.items;
      var hasPlayer = false,
        hasFileMenu = false,
        isPlayerSettings = false,
        alreadyInjected = false;

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (!it) continue;
        if (it.player) hasPlayer = true;
        if (it.mark || it.timeclear || it.clearmark) hasFileMenu = true;
        if (
          it.method === "size" ||
          it.method === "speed" ||
          it.method === "subs" ||
          it.method === "share" ||
          it.method === "segments"
        )
          isPlayerSettings = true;
        if (it.watchtogether_inject || it.watchtogether_inject_player)
          alreadyInjected = true;
      }
      if (alreadyInjected) return;

      if (hasPlayer && hasFileMenu) {
        items.push({
          title: T.full_card_btn,
          player: "inner",
          watchtogether_inject: true,
        });

        var originalOnSelect = e.active.onSelect;
        e.active.onSelect = function (a) {
          if (a && a.watchtogether_inject) {
            pendingShareCard = lastViewedCard || {};
            pendingShareAt = Date.now();
            Lampa.Noty.show(T.pending_share);
          }
          if (originalOnSelect) originalOnSelect(a);
        };
        return;
      }

      if (isPlayerSettings) {
        items.push({
          title: T.full_card_btn,
          subtitle: inRoom ? T.player_qr_descr : T.player_create_descr,
          method: "watchtogether_create",
          watchtogether_inject_player: true,
        });

        var originalOnSelectP = e.active.onSelect;
        e.active.onSelect = function (a) {
          if (a && a.watchtogether_inject_player) {
            if (inRoom) showRoomQr();
            else createRoomFromPlayer();
            return;
          }
          if (originalOnSelectP) originalOnSelectP(a);
        };
      }
    });
  }

  window.WatchTogether = {
    version: META.version,
    log: function () {
      return logRing.join("\n");
    },
    dump: function () {
      console.log(logRing.join("\n"));
      return logRing.length;
    },
    state: function () {
      var vid = getVideo();
      return {
        room: currentRoomId,
        name: currentRoomName,
        host: iAmHost(),
        owner: currentRoomOwner,
        inRoom: inRoom,
        joining: joining,
        members: memberCount(),
        relay: room && room.ws ? room.ws.readyState : null,
        lobby: !!(lobbyHost && lobbyHost.alive()),
        hold: holdActive,
        holdPosition: holdPosition,
        holdWaiting: Object.keys(holdWaiting),
        initialSyncLock: initialSyncLock,
        clockOffset: Math.round(serverTimeOffset),
        echoPending: Object.keys(echoPending).length,
        video: vid
          ? {
              position: vid.currentTime,
              paused: vid.paused,
              rate: vid.playbackRate,
              readyState: vid.readyState,
              buffering: !!vid._lp_buffering,
            }
          : null,
      };
    },
    leave: function () {
      leaveRoom(true);
      return "left";
    },
  };

  registerSettings();
  console.log(
    "[WatchTogether]",
    lplog(
      "started, relay: " +
        getRelay() +
        ", lang: " +
        _rawLang +
        ", name: " +
        getDisplayName(),
    ),
  );
})();
