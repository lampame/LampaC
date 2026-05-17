# Shared

Общая **библиотека** (.NET 10), на которую ссылаются **`Core`** и все подключаемые модули. Сама по себе не запускается; поставляется как **`Shared.dll`** (при publish часть зависимостей уходит в **`runtimes/references/`** вместе с другими сборками модулей).

Обзор продукта и дерево репозитория — [корневой README](../README.md). Точка входа хоста — [`Core/README.md`](../Core/README.md).

---

## Назначение по областям

| Область | Примеры |
| --- | --- |
| **Конфигурация** | [`CoreInit.cs`](CoreInit.cs) — глобальный снимок настроек, слияние **`init.conf`** / **`init.yaml`**, фоновый watcher (~1 с), событие **`EventListener.UpdateInitFile`**, бэкапы в **`database/backup/init/`** |
| **Контроллеры** | [`BaseController`](Controllers/BaseController.cs), [`BaseOnlineController`](Controllers/BaseOnlineController.cs), [`BaseSisiController`](Controllers/BaseSisiController.cs), [`BaseENGController`](Controllers/BaseENGController.cs) — кеш, заголовки, интеграция с Kit, общие утилиты HTTP/JSON |
| **Модули** | Интерфейсы [`IModuleLoaded`](Models/Module/Interfaces/IModuleLoaded.cs), [`IModuleConfigure`](Models/Module/Interfaces/IModuleConfigure.cs); [`ModuleRepository`](Services/Module/ModuleRepository.cs); модели [`RootModule`](Models/Module/RootModule.cs), манифесты |
| **Динамическая компиляция** | [`CSharpEval`](Services/CSharpEval.cs) — Roslyn: компиляция папок модулей с **`manifest.json`**, скрипты, ссылки из TPAs и доп. DLL |
| **HTTP и сеть** | [`Http`](Services/HTTP/Http.cs), [`FriendlyHttp`](Services/HTTP/FriendlyHttp.cs), RCH-клиент, пулы буферов и JSON ([`Services/Pools/`](Services/Pools/)) |
| **Кеш** | [`HybridCache`](Services/Hybrid/HybridCache.cs), [`HybridFileCache`](Services/Hybrid/HybridFileCache.cs), [`ResponseCache`](Services/ResponseCache.cs), [`FileCache`](Services/FileCache.cs) |
| **Браузер** | [`PlaywrightCore/`](PlaywrightCore/) — Chromium / Firefox обёртки для обхода JS-защит |
| **Модели конфигов** | [`Models/AppConf/`](Models/AppConf/) — `listen`, `BaseModule`, `WAF`, `online`, пулы, прокси и т.д. |
| **Шаблоны и SISI/NextHUB** | [`Models/Templates/`](Models/Templates/), [`Models/SISI/`](Models/SISI/), [`Models/NextHUB/`](Models/NextHUB/) |
| **Прочее** | GeoIP ([`GeoIP2`](Services/Utilities/GeoIP2.cs)), Kit ([`CryptoKit`](Services/Kit/CryptoKit.cs)), атрибуты авторизации и Staticache |

---

## Жизненный цикл конфигурации

1. При первом обращении к **`CoreInit`** загружается **`init.conf`** (и при наличии **`init.yaml`**).
2. Фоновый цикл сравнивает время изменения файлов и при изменении вызывает **`updateConf`**, обновляет **`CurrentConf`**, пишет бэкап и **`current.conf`**, рассылает **`EventListener.UpdateInitFile`**.
3. Модули подписываются на это событие и перечитывают свои секции (например **`ModuleInvoke.Init`**).

---

## Зависимости NuGet

Актуальный список — [`Shared.csproj`](Shared.csproj): Playwright, EF Core, Newtonsoft.Json, YamlDotNet, Serilog, HtmlAgilityPack, MaxMind, NetVips, Roslyn (CSharp + Scripting) и др.

---

## Соглашения для новых модулей

- Реализовать публичный класс **`ModInit`** с **`IModuleLoaded`**; при регистрации в DI — также **`IModuleConfigure`**.
- Конфиг модуля задавать через **`ModuleInvoke.Init("ИмяМодуля", …)`** и подписку на **`EventListener.UpdateInitFile`** по образцу существующих модулей.
- Контроллеры онлайн/SISI по возможности наследовать от **`BaseOnlineController`** / **`BaseSisiController`**.

Пакет: **`Microsoft.Extensions.DependencyModel`** используется при разрешении зависимостей для компиляции модулей.
