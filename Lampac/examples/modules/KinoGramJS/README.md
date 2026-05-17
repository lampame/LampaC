## Доступные классы в JavaScript

Список доступных классов:

- `EpisodeTpl`
- `MovieTpl`
- `SeasonTpl`
- `SegmentTpl`
- `SimilarTpl`
- `StreamQualityTpl`
- `SubtitleTpl`
- `VideoTpl`
- `VoiceTpl`

Описание свойств, методов и логики использования:<br>
https://github.com/lampac-nextgen/lampac/tree/main/Shared/Models/Templates

## Доступные функции в JavaScript

### `log(value)`

Пишет значение в `Console.WriteLine`.

```javascript
log('hello');
log({ ok: true, id: 123 });
```

### `encryptQuery(url)`

Возвращает результат `EncryptQuery(url)`.

```javascript
const encrypted = encryptQuery('https://example.com/video?id=42');
log(encrypted);
```

### `decryptQuery(url)`

Возвращает результат `DecryptQuery(url)`.

```javascript
const decrypted = decryptQuery('ogjwrtg14e0p9DSsOdcsPYKq0ri1gJhAL++QkliYtXIJEfQAJp+C0SVWVAGxY+3G');
log(decrypted);
```

### `cacheGet(key)`

```javascript
const html = cacheGet(`${search}:${model}:${sort}:${cat}:${pg}`);
log(html);
```

### `cacheSet(key, value, ttl)`

```javascript
cacheSet(`${search}:${model}:${sort}:${cat}:${pg}`, html, 20);
```

### `streamProxy(url, headers)`

Возвращает строку из `HostStreamProxy(...)`.

```javascript
const url = streamProxy('https://cdn.example.com/master.m3u8', {
  Referer: 'https://example.com/',
  'User-Agent': 'Mozilla/5.0'
});

log(url);
```

### `imgProxy(url, height)`

Возвращает строку из `HostImgProxy(...)`.

```javascript
const preview = imgProxy('https://example.com/poster.jpg');
log(preview);
```

### `httpGet(url, addHeaders, newHeaders)`

Обёртка над `httpHydra.Get(...)`.

Сигнатура на стороне JS:

```javascript
await httpGet(url, addHeaders, newHeaders)
```

Пример:

```javascript
const response = await httpGet(
  'https://example.com/api/items',
  {
    Accept: 'application/json'
  }
);

log(response);
```

### `httpPost(url, data, addHeaders, newHeaders)`

Обёртка над `httpHydra.Post(...)`.

Сигнатура на стороне JS:

```javascript
await httpPost(url, data, addHeaders, newHeaders)
```

Пример:

```javascript
const body = JSON.stringify({
  query: 'test',
  page: 1
});

const response = await httpPost(
  'https://example.com/api/search',
  body,
  {
    'Content-Type': 'application/json'
  }
);

log(response);
```
