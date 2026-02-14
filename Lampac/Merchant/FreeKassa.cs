using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Shared;
using Shared.Engine;
using System;
using System.IO;
using IO = System.IO.File;

namespace Merchant.Controllers
{
    /// <summary>
    /// https://docs.freekassa.ru/
    /// </summary>
    public class FreeKassa : MerchantController
    {
        static FreeKassa() { Directory.CreateDirectory("merchant/invoice/freekassa"); }


        [HttpGet]
        [AllowAnonymous]
        [Route("freekassa/new")]
        public ActionResult Index(string email)
        {
            if (!AppInit.conf.Merchant.FreeKassa.enable || string.IsNullOrWhiteSpace(email))
                return Content(string.Empty);

            string transid = DateTime.Now.ToBinary().ToString().Replace("-", "");

            IO.WriteAllText($"merchant/invoice/freekassa/{transid}", decodeEmail(email));

            string hash = CrypTo.md5($"{AppInit.conf.Merchant.FreeKassa.shop_id}:{AppInit.conf.Merchant.accessCost}:{AppInit.conf.Merchant.FreeKassa.secret}:USD:{transid}");
            return Redirect("https://pay.freekassa.ru/" + $"?m={AppInit.conf.Merchant.FreeKassa.shop_id}&oa={AppInit.conf.Merchant.accessCost}&o={transid}&s={hash}&currency=USD");
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("freekassa/callback")]
        public ActionResult Callback(string AMOUNT, long MERCHANT_ORDER_ID, string SIGN)
        {
            if (!AppInit.conf.Merchant.FreeKassa.enable || !IO.Exists($"merchant/invoice/freekassa/{MERCHANT_ORDER_ID}"))
                return StatusCode(403);

            WriteLog("freekassa", JsonConvert.SerializeObject(HttpContext.Request.Form));

            if (CrypTo.md5($"{AppInit.conf.Merchant.FreeKassa.shop_id}:{AMOUNT}:{AppInit.conf.Merchant.FreeKassa.secret}:{MERCHANT_ORDER_ID}") == SIGN)
            {
                string email = IO.ReadAllText($"merchant/invoice/freekassa/{MERCHANT_ORDER_ID}");
                PayConfirm(email, "freekassa", MERCHANT_ORDER_ID.ToString());

                return Content("YES");
            }

            return Content("SIGN != hash");
        }
    }
}
