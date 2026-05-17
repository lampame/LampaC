# SISI

Модуль контента **18+** для Lampac: плагин Lampa **`/sisi.js`**, история просмотров и закладки в **SQLite** (`SisiContext`), общие лимиты **WAF** для маршрутов платформ.

## Структура в репозитории

| Часть | Путь | Роль |
| --- | --- | --- |
| **Ядро SISI** | каталог **`SISI/`** в корне решения | `ModInit`, `SisiApi` (`/sisi.js`), контекст БД, закладки/история, подмешивание `limit_map` в WAF |
| **Платформы 18+** | **`Modules/Adult/<Имя>/`** | Отдельный .NET-проект на каждый источник: контроллеры, маршруты (`/phub`, `/xnx`, …), `manifest.json` |

При публикации **`Core`** исходники копируются в **`module/SISI/…`** и **`module/Adult/…`** (см. `Core/Core.csproj`). Общая карта решения — [`NextGen.slnx`](../NextGen.slnx), обзор архитектуры — [корневой README](../README.md) (разделы «Архитектура», «Модули»).

**Маршруты и плагины:** в таблице ниже перечислены **публичные корни** платформ. Классы **`PornHub`** и **`PornHubPremium`** живут в одном проекте **`Modules/Adult/PornHub/`** (разные маршруты).

## Платформы (маршруты)

Базовые HTTP-маршруты (корень сайта Lampac):

| Контроллер / источник | Маршрут (пример) | Проект (папка) | Примечание |
| --- | --- | --- | --- |
| `BongaCams` | `/bgs` | `Modules/Adult/BongaCams/` | |
| `Chaturbate` | `/chu` | `Modules/Adult/Chaturbate/` | в т.ч. `/chu/potok` |
| `Ebalovo` | `/elo` | `Modules/Adult/Ebalovo/` | |
| `Eporner` | `/epr` | `Modules/Adult/Eporner/` | |
| `HQporner` | `/hqr` | `Modules/Adult/HQporner/` | |
| `PornHub` | `/phub` | `Modules/Adult/PornHub/` | варианты `/phubgay`, `/phubsml` |
| `PornHubPremium` | `/phubprem` | `Modules/Adult/PornHub/` | тот же проект, отдельный контроллер |
| `Porntrex` | `/ptx` | `Modules/Adult/Porntrex/` | |
| `Runetki` | `/runetki` | `Modules/Adult/Runetki/` | |
| `Spankbang` | `/sbg` | `Modules/Adult/Spankbang/` | |
| `Tizam` | `/tizam` | `Modules/Adult/Tizam/` | |
| `Xhamster` | `/xmr` | `Modules/Adult/Xhamster/` | варианты `/xmrgay`, `/xmrsml` |
| `Xnxx` | `/xnx` | `Modules/Adult/Xnxx/` | |
| `Xvideos` | `/xds` | `Modules/Adult/Xvideos/` | варианты `/xdsgay`, `/xdssml` |
| `XvideosRED` | `/xdsred` | `Modules/Adult/XvideosRED/` | |

Дополнительные вложенные маршруты (`/vidosik`, `/stars` и т.д.) см. в соответствующих файлах `Controllers/*.cs` внутри каждого проекта **`Modules/Adult/...`**.

## Связь с NextHUB

**SISI** (ядро + **`Modules/Adult/*`**) — нативные C#-источники с фиксированными маршрутами. **NextHUB** (`Modules/NextHUB`) — отдельный модуль для десятков сайтов на YAML; маршрут **`/nexthub`**. Оба относятся к контенту 18+, но не дублируют друг друга. Подробнее — [`Modules/NextHUB/README.md`](../Modules/NextHUB/README.md).

## Конфигурация

В `SISI/ModInit.cs` при инициализации подмешиваются лимиты **WAF** для путей вида `/(sisi|bgs|chu|runetki|elo|epr|hqr|phub|ptx|sbg|tizam|xmr|xnx|xds)` (**5** req/s, `pathId: true`). Секция **`sisi`** в `init.conf` задаёт поведение плагина, историю, закладки и т.д. (см. также `SISI/Config/ModuleConf.cs`, `SiteConf`).

## Каталоги данных

При старте ядра SISI создаются каталоги **`wwwroot/bookmarks/img`** и **`wwwroot/bookmarks/preview`** (относительно рабочей директории процесса) для сохранения обложек закладок, если это включено в конфиге.
