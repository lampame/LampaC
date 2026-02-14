using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Shared;
using IO = System.IO;

namespace Lampac.Controllers
{
    public class SyncApiController : BaseController
    {
        [HttpGet]
        [Route("/api/sync")]
        public ActionResult Sync()
        {
            var sync = AppInit.conf.sync;
            if (!requestInfo.IsLocalRequest || !sync.enable || sync.type != "master")
                return Content("error");

            if (sync.initconf == "current")
                return Content(JsonConvert.SerializeObject(AppInit.conf), "application/json; charset=utf-8");

            var init = new AppInit();

            string confile = "sync.conf";
            if (sync.override_conf != null && sync.override_conf.TryGetValue(requestInfo.IP, out string _conf))
                confile = _conf;

            if (IO.File.Exists(confile))
                init = JsonConvert.DeserializeObject<AppInit>(IO.File.ReadAllText(confile));

            init.accsdb.users = AppInit.conf.accsdb.users;

            string json = JsonConvert.SerializeObject(init);
            json = json.Replace("{server_ip}", requestInfo.IP);

            return Content(json, "application/json; charset=utf-8");
        }
    }
}