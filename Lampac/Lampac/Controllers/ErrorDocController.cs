using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared;
using Shared.Engine;

namespace Lampac.Controllers
{
    public class ErrorDocController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        [Route("/e/acb")]
        public ActionResult Accsdb()
        {
            string shared_passwd = CrypTo.unic(8).ToLowerInvariant();
            string pw1 = CrypTo.unic(6).ToLowerInvariant();
            string pw2 = CrypTo.unic(8).ToLowerInvariant();

            return ContentTo($@"<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Настройка AccsDB</title>
    <link href='/control/npm/bootstrap.min.css' rel='stylesheet'>
</head>
<body>
    <div class='container mt-5'>
        <div class='card mt-4'>
            <div class='card-body'>
                <p class='card-text'>Добавьте в init.conf заменив email/unic_id на свои:</p>
                <pre style='background: #e9ecef; padding: 1em;'><code>""accsdb"": {{
  ""accounts"": {{
    ""{pw1}@mail.ru"": ""2040-10-17T00:00:00"", // email cub.red
    ""{pw2}"": ""2040-10-17T00:00:00"", // unic_id
  }}
}}</code></pre>
				<br>
                <p class='card-text'>Или через <a href='admin' target='_blank'>{host}/admin</a> > Пользователи > Добавить пользователя > В ID указать email/unic_id</p>
            </div>
        </div>
    </div>
    <div class='container mt-5'>
        <div class='card mt-4'>
            <div class='card-body'>
                <p class='card-text'>Если нужно разрешить внешний доступ без добавления каждого устройства, создайте пароль доступа:</p>
                <pre style='background: #e9ecef; padding: 1em;'><code>""accsdb"": {{
  ""shared_passwd"": ""{shared_passwd}""
}}</code></pre>
				<br>
                <p class='card-text'>Так все кому вы сообщили пароль <b>{shared_passwd}</b> cмогут самостоятельно авторизоваться</p>
            </div>
        </div>
    </div>
</body>
</html>");
        }
    }
}