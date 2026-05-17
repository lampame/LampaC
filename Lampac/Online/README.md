# Online

**Ядро VOD-модуля** Lampac: выдача клиентского плагина **`/online.js`**, агрегирующие маршруты **`/lite/...`**, внешние идентификаторы и события провайдеров. Большинство конкретных источников (Rezka, Filmix, Kodik, …) вынесены в отдельные проекты под **`Modules/OnlineRUS`**, **`OnlinePaid`**, **`OnlineAnime`**, **`OnlineENG`**, **`OnlineUKR`**, **`OnlineGEO`** — каждый со своим контроллером и маршрутом вида **`/lite/{имя}`**.

Общая архитектура — [корневой README](../README.md). Базовые классы и конфиг — [`Shared`](../Shared/README.md).

---

## Состав проекта

| Файл / каталог | Назначение |
| --- | --- |
| [`ModInit.cs`](ModInit.cs) | **`IModuleLoaded`**, **`IModuleConfigure`**: конфиг секции **`online`**, регистрация **`ExternalidsContext`**, подмешивание **`limit_map`** в WAF |
| [`OnlineApi.cs`](OnlineApi.cs) | Контроллер плагина и общих API: **`online.js`**, **`externalids`**, **`lite/withsearch`**, **`lite/spider`**, **`lifeevents`**, **`lite/events`** и связанная логика |
| [`Controllers/PiTor.cs`](Controllers/PiTor.cs) | Источник **PiTor** / PidTor — маршруты **`/lite/pidtor`**, серии (см. атрибуты маршрутов в файле) |
| [`plugin.js`](plugin.js) | Шаблон клиентского плагина Lampa; при отдаче подмешиваются фрагменты из **`plugins/`** хоста и настройки из конфига |
| [`ModuleConf.cs`](ModuleConf.cs) | Расширение **`OnlineConf`**: spider, component, description, **`appReplace`** и др. |
| [`SQL/ExternalidsContext.cs`](SQL/ExternalidsContext.cs) | SQLite (EF Core) для маппинга внешних ID |
| [`manifest.json`](manifest.json) | Модуль включён по умолчанию (**`"enable": true`**); для динамической пересборки можно добавить **`"dynamic": true`** по аналогии с другими модулями |

Секция **`online`** в **`init.conf`** (имя инстанса, версия, приоритеты кнопок и т.д.) описана в [корневом README](../README.md).

---

## WAF

В [`ModInit`](ModInit.cs) в начало **`CoreInit.conf.WAF.limit_map`** добавляются правила:

- **`^/lite/`** — 10 запросов в секунду;
- **`^/(externalids|lifeevents)`** — 10 запросов в секунду.

---

## Связь с другими модулями

- Провайдеры из **`Modules/Online*/*`** регистрируют собственные контроллеры с маршрутами **`/lite/...`**; плагин и списки в **`OnlineApi`** стыкуются с ними через общие контракты и реестр источников.
- Настройки отдельных источников задаются в **`init.conf`** в одноимённых секциях (см. примеры в [корневом README](../README.md)).

---

## Публикация

При **`dotnet publish`** содержимое **`Online/`** копируется в **`module/Online/`** рядом с **`Core.dll`** (см. [`Core/Core.csproj`](../Core/Core.csproj)).

Решение: [`NextGen.slnx`](../NextGen.slnx).
