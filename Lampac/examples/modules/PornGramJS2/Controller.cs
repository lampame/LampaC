using Microsoft.AspNetCore.Mvc;
using Shared;
using System.Threading.Tasks;

namespace PornGramJS;

public class ApiController : BaseSisiController
{
    public ApiController() : base(ModInit.conf) { }

    [HttpGet]
    [Route("porngram")]
    [Route("porngram/{*suffix}")]
    async public Task<ActionResult> Index()
    {
        if (await IsRequestBlocked(rch: false))
            return badInitMsg;

        var js = JSRuntime(ModInit.jsFile);
        string result = await js.InvokeAsync<string>("handle");

        return ContentTo(result);
    }
}
