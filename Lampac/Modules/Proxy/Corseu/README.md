# Примеры запросов Corseu API
Для доступа к прокси-контроллеру `/corseu` в конфигурации (`init.conf`, `init.yaml`) должен быть указан токен в `Corseu.tokens`. Во всех запросах необходимо передавать `auth_token` с допустимым значением.

## GET-запрос, который можно открыть в браузере
```text
http://127.0.0.1:9118/corseu?auth_token=MY_SECRET_TOKEN&browser=http&url=https%3A%2F%2Fhttpbin.org%2Fget&method=GET&timeout=30&encoding=utf8&usedefaultHeaders=true&autoredirect=true
```

## POST-запрос со всеми параметрами
```js
// GET-запрос (например, в браузере или Node.js)
const getUrl = new URL("http://127.0.0.1:9118/corseu");
getUrl.searchParams.set("auth_token", "MY_SECRET_TOKEN");
getUrl.searchParams.set("browser", "http");
getUrl.searchParams.set("url", "https://httpbin.org/get");
getUrl.searchParams.set("method", "GET");
getUrl.searchParams.set("timeout", "30");
getUrl.searchParams.set("encoding", "utf8");
getUrl.searchParams.set("usedefaultHeaders", "true");
getUrl.searchParams.set("autoredirect", "true");

fetch(getUrl, {
  method: "GET",
  headers: {
    "Accept": "application/json"
  }
})
  .then(response => response.text())
  .then(console.log)
  .catch(console.error);

// POST-запрос
fetch("http://127.0.0.1:9118/corseu", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    auth_token: "MY_SECRET_TOKEN",
    browser: "http",
    url: "https://httpbin.org/post",
    method: "POST",
    data: { sample: "value" },
    timeout: 30,
    encoding: "utf8",
    usedefaultHeaders: true,
    autoredirect: true
  })
})
  .then(response => response.text())
  .then(console.log)
  .catch(console.error);
```

Параметр `httpversion` принимает значения `1` или `2` и по умолчанию соответствует HTTP/1.1. Поле `browser` можно установить в `playwright`, чтобы использовать управление через Playwright вместо стандартного `HttpClient`.