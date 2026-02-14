# Lampac

---

<table>
<tr>
<td width="100%">

### ⚠️ Важно

**Это последний доступный код проекта.**  
Репозиторий больше не поддерживается и не доступен автором Lampaca.

**🙋 Ищем maintainera**  
Если вы хотите взять на себя поддержку и развитие проекта — создайте [issue](https://github.com/lampac-talks/lampac/issues) или свяжитесь с сообществом.

**🔒 Безопасность**  
Автор оригинального репозитория убрал код и поддержку, в том числе чтобы дистанцироваться от возможных проблем. В данном релизе могут присутствовать известные уязвимости (в том числе связанные с получением uid) — это стоит учитывать при развёртывании.

<span style="color:#c00">**Установка и использование кода — на свой страх и риск. Ни авторы, ни правообладатели ответственности не несут.**</span>

</td>
</tr>
</table>

---

# AI Документация

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lampac-talks/lampac)

# Установка на linux

спасибо @nikk, @Denis

```bash
curl -L -k -s https://lampac.sh | bash
```

* Минимальные требования: 1 CPU, 1GB RAM, 2GB HDD
* Рекомендуемые требования: 1 CPU, 2GB RAM, 5GB SSD
* Порт генерируется рандомно и выводится в конце установки скрипта
* Изменить или посмотреть порт можно в init.conf -
```grep "port" /home/lampac/init.conf```

# Домашняя (облегченная) - linux

```bash
curl -L -k -s https://lampac.sh/home | bash
```

* Минимальные требования: 1 CPU, 500Mb RAM, 1GB HDD
* Рекомендуемые требования: 1 CPU, 1GB RAM, 1GB SSD
* DLNA/Chromium/Firefox по умолчанию отключен, включается в init.conf
* TorrServer по умолчанию отключен, включается в module/manifest.json

# Установка на Windows

1. Установить ".NET Core 9 (SDK Installer)" <https://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.12/9.0.113.md>
2. Распаковать <https://github.com/lampac-talks/lampac/releases/latest/download/publish.zip>
3. Запустить lampac.exe

# Запуск в Docker

```bash
docker run -d -p 9118:9118 --restart always --name lampac lampac-talks/lampac
```

**tags**: latest (linux/amd64) / arm32 (linux/arm/v7) / arm64 (linux/arm64/v8)

# Запуск в Android

1. Termux - <https://github.com/lampac-talks/lampac/blob/main/Termux/README.md>
2. BWA - <https://bwa.to>

# Тестируемые устройства

* Debian 11/12 x64
* Windows 10 x64
* Raspberry arm64 (Debian 11)

# Админка

ip:9118/admin

# Плагины для Lampa

1. Все плагины сразу - <http://IP:9118/on.js>
2. онлайн   - <http://IP:9118/online.js>
3. xxx      - <http://IP:9118/sisi.js>
4. DLNA     - <http://IP:9118/dlna.js>
5. Tracks   - <http://IP:9118/tracks.js>
6. Backup   - <http://IP:9118/backup.js>
7. Синхронизация   - <http://IP:9118/sync.js>
8. TorrServer      - <http://IP:9118/ts.js>
9. Парсер Jackett  - IP:9118

# Плагины для Lampa Lite

1. онлайн/jackett  - <http://IP:9118/lite.js>
2. xxx     - <http://IP:9118/sisi.js>

# Общие настройки

1. Отключить TorrServer/DNLA/Jackett/etc можно в module/manifest.json
2. Настройки Jackett в module/JacRed.conf (пример JacRed.example.conf)
3. Основные настройки в init.conf (пример example.conf)

# Источники онлайн

Filmix, KinoPub, Alloha, Rezka, GetsTV, iptv.online, Kinobase, Zetflix, Collaps, Lumex, VDBmovies, VideoDB, Vibix, Videoseed, VeoVeo, HDVB, Kodik, Ashdi (Украинский), Eneyida (Украинский), KinoUKR (Украинский), FanCDN, Kinotochka, CDNmovies, Redheadsound, VoKino, Rutube, VK Видео, Plvideo, Anilibria, AniLiberty, AniMedia, AnimeLib, MoonAnime (Украинский), Animevost, Animebesst, AnimeGo, HydraFlix (ENG), VidSrc (ENG), MovPI (ENG), Videasy (ENG), 2Embed (ENG), VidLink (ENG), AutoEmbed (ENG), SmashyStream (ENG), PlayEmbed (ENG), RgShows (ENG)

# Источники 18+

PornHub, PornHubPremium, Bongacams, Chaturbate, Cam4, Ebalovo, Eporner, HQporner, Porntrex, Spankbang, Xhamster, Xnxx, Xvideos, Lenporno, Porno365, Vtrahe, RUSporno, ProstoPorno, PornOne, Brazzrus, FilmAdult, Sosushka, Youjizz, NoodleMagazine, Veporn, XXXperevod, Huyamba, Pornk, PornoAkt, Porn4days, Beeg, Porndig, 24video, yaeby, trahkino, sex-studentki, hochu.tv, oxax.tv, Rusvideos, Porno666, Pornobolt, JopaOnline, Ebun, Pornobriz, 24rolika, SemBatsa, Lenkino, Ebasos, Vporno, BigBoss, GayPornTube

# Торренты

Kinozal, NNM-Club, Rutor, Rutracker, Megapeer, Torrentby, Bitru, Toloka (Украинский), BigFanGroup, Selezen, LostFilm, Anilibria, Animelayer, Anifilm

# Источники с API для порталов

* Filmix, Alloha, Lumex (VideoCDN), Kodik

# Привязка PRO аккаунтов

* Filmix - <http://IP:9118/lite/filmixpro>
* KinoPub - <http://IP:9118/lite/kinopubpro>
* VoKino - <http://IP:9118/lite/vokinotk>
* HDRezka - <http://IP:9118/lite/rhs/bind>
* GetsTV - <http://IP:9118/lite/getstv/bind>
* iptv.online - <http://IP:9118/lite/iptvonline/bind>

# Remote Control Hub

Для балансеров которые недоступны на VPS но доступны в вашей сети, можно включить rhub и парсить данные на самом устройстве android/smart

```json
"Ashdi": {
  "rhub": true
},
"BongaCams": {
  "rhub": true
}
```

# Плагин DLNA.js

* Просмотр медиа файлов с папки dlna
* Возможность удалять просмотренные папки/файлы
* Загрузка торрентов в папку dlna

Зажмите кнопку "OK" на выбранном торренте/папке/файле для вызова списка действий

# Плагин Sync.js

Синхронизация между разными устройствами

* Для синхронизации все устройства должны быть авторизованы в cub.red под одним аккаунтом, либо на устройствах вместо плагина IP:9118/sync.js, должен использоваться IP:9118/sync/js/{uid}, где {uid} это любые символы, либо идентификатор в accsdb, например IP:9118/sync/js/myhome
* email или {uid} должен совпадать на устройствах которые вы хотите синхронизовать между собой
* Синхронизация куба должна быть отключена

# Плагин Tracks.js

Заменяет название аудиодорожек и субтитров в плеере

Автор: @aabytt

1. Добавить плагин "<http://IP:9118/tracks.js>"
2. В init.conf заменить значение "ffprobe.os" на один из вариантов "win", "linux"

# Плагин TmdbProxy.js

Проксирование постеров для сайта TMDB

1. Добавить плагин "<http://IP:9118/tmdbproxy.js>"
2. В настройках TMDB включить проксирование

# Плагин Catalog.js

Альтернативные источники каталога cub и tmdb

1. Добавить плагин "<http://IP:9118/catalog.js>"
2. Выбрать каталог в настройках лампы "Настройки - Остальное - Основной источник"

# Доступ к доменам .onion

1. Запустить tor на порту 9050
2. В init.conf указать .onion домен в host

# Media Station X

1. Settings -> Start Parameter -> Setup
2. Enter current ip address and port "IP:9118"

Убрать/Добавить адреса можно в msx.json

# Виджеты

1. Для Samsung "IP:9118/samsung.wgt"

# Работа с базами данных

* Microsoft.EntityFrameworkCore 9.0.8 - MS SQL Server, SQLite
* Npgsql 9.0.3 - PostgreSQL
* Pomelo.EntityFrameworkCore.MySql 9.0.0 - MariaDB, MySQL
* MongoDB.Driver 3.4.3 - MongoDB
* StackExchange.Redis 2.9.11 - Redis

# Параметры init.conf

* checkOnlineSearch - Делать предварительный поиск скрывая балансеры без ответа
* multiaccess - Настройка кеша в онлайн с учетом многопользовательского доступа
* accsdb - Доступ к API через авторизацию (для jackett используется apikey)
* useproxy - Парсит источник через прокси указанные в "proxy"
* streamproxy - Перенаправляет видео через "<http://IP:9118/proxy/{uri}>"
* localip - Заменить на "false" если скрипт установлен за пределами внутренней сети
* findkp - Каталог для поиск kinopoisk_id (alloha|tabus|vsdn)
* corseu - Использовать прокси cloudflare

# Пример init.conf

* Список всех параметров, а так же значения по умолчанию смотреть в current.conf и example.conf
* В init.conf нужно указывать только те параметры, которые хотите изменить
* Редактировать init.conf можно так же через ip:9118/admin

```json
{
  "listenport": 9120, // изменили порт
  "dlna": {
    "downloadSpeed": 25000000 // ограничили скорость загрузки до 200 Mbit/s
  },
  "Rezka": {
    "streamproxy": true // отправили видеопоток через "http://IP:9118/proxy/{uri}" 
  },
  "Zetflix": {
    "displayname": "Zetflix - 1080p", // изменили название
    "geostreamproxy": ["UA"], // поток для UA будет идти через "http://IP:9118/proxy/{uri}" 
    "apn": "http://apn.cfhttp.top" // заменяем прокси "http://IP:9118/proxy/{uri}" на "http://apn.cfhttp.top/{uri}"
  },
  "Kodik": {
    "useproxy": true, // использовать прокси
    "proxy": {        // использовать 91.1.1.1 и 92.2.2.2
      "list": [
        "socks5://91.1.1.1:5481", // socks5
        "91.2.2.2:5481" // http
      ]
    }
  },
  "Ashdi": {
    "useproxy": true // использовать прокси 93.3.3.3
  },
  "Filmix": {
    "token": "protoken" // добавили токен от PRO аккаунта
  },
  "PornHub": {
    "enable": false // отключили PornHub
  },
  "proxy": {
    "list": [
      "93.3.3.3:5481"
    ]
  },
  "globalproxy": [
    {
      "pattern": "\\.onion",  // запросы на домены .onion отправить через прокси
      "list": [
        "socks5://127.0.0.1:9050" // прокси сервер tor
      ]
    }
  ],
  "overrideResponse": [ // Заменили ответ на данные из файла myfile.json
    {
      "pattern": "/msx/start.json",
      "action": "file",
      "type": "application/json; charset=utf-8",
      "val": "myfile.json"
    }
  ]
}
```

# Ошибка: Illegal instruction

Процессор не поддерживает инструкции AVX

1. Установите ImageMagick

```bash
apt install -y imagemagick libpng-dev libjpeg-dev libwebp-dev
```

1. В init.conf добавьте

```json
"imagelibrary": "ImageMagick"
```

1. Если проблема сохраняется, замените на

```json
"imagelibrary": "none"
```
