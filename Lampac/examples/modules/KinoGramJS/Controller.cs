using Microsoft.AspNetCore.Mvc;
using Shared;
using System.Threading.Tasks;

namespace KinoGramJS;

public class ApiController : BaseOnlineController
{
    public ApiController() : base(ModInit.conf) { }

    [HttpGet]
    [Route("lite/kinogram")]
    [Route("lite/kinogram/{*suffix}")]
    async public Task<ActionResult> Index()
    {
        if (await IsRequestBlocked(rch: false))
            return badInitMsg;

        var js = JSRuntime(ModInit.jsFile);
        string result = await js.InvokeAsync<string>("handle");

        return ContentTo(result);
    }
}
