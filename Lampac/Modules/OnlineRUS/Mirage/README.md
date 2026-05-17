# Mirage

Онлайн-модуль для Lampac: поиск карточки, выдача переводов/серий и получение HLS через встроенный браузер (Playwright). Публичные маршруты: `GET /lite/mirage`, `GET /lite/mirage/video`, сегменты плейлиста — `GET /lite/mirage/trans/{fileName}`, похожие по названию — `GET /lite/mirage-search`.

## Требования к ресурсам

Ориентир по памяти: **~1 ГБ RAM** на стороне хоста (браузерный контекст, кеш сегментов в `cache/mirage/`).

## Браузер: Chrome или Edge

Нужен **Google Chrome** или **Microsoft Edge**. Обычный **Chromium из репозитория дистрибутива** для этого модуля **не подходит** — укажите путь к установленному Chrome или Edge в `init.conf` (ключ `executablePath` в секции `chromium`), чтобы Playwright запускал нужный бинарник.

Примеры путей (проверьте у себя в системе):

- Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe` или `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` или `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`
- Linux: путь к `google-chrome`, `chrome` или `microsoft-edge`, как установлено у вас

## Включение Playwright (`chromium`)

В `init.conf` (поддерживается формат **JSONC** — можно использовать `//` комментарии). Модуль не отдаёт онлайн-источник, если Chromium отключён.

Вариант с долгоживущим контекстом (меньше холодных стартов, выше удержание памяти):

```jsonc
"chromium": {
  "enable": true,
  "executablePath": "/path/to/chrome-or-edge",
  "context": {
    "keepopen": true,
    "keepalive": 600   // минуты
  }
}
```

Вариант без удержания контекста:

```jsonc
"chromium": {
  "enable": true,
  "executablePath": "/path/to/chrome-or-edge",
  "context": {
    "keepopen": false
  }
}
```

Остальные поля секции `chromium` см. в корневом `README.md` и в `config/example.init.conf`.

## Настройка модуля `Mirage`

Ключ в конфиге: **`Mirage`** (как в `init.conf`).

- **`m4s`**: переключение целевого качества в плеере для извлечения потока.
  - `false` — **1080p**
  - `true` — **2160p** (UHD), если у выбранного файла на стороне источника есть UHD

Пример:

```jsonc
"Mirage": {
  "enable": true,
  // false — 1080, true — 2160 (при наличии UHD)
  "m4s": false
}
```

## Прочее

- Кеш сегментов и временные файлы: каталог **`cache/mirage/`** (периодически очищается логикой контроллера).
- Лимит WAF для трансляций: префикс маршрута **`^/lite/mirage/trans/`** (см. `MirageController`).
