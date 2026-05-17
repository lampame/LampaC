using Microsoft.AspNetCore.Mvc;
using Shared;

namespace PingPong;

public class PingPongController : BaseController
{
    [Route("lamson/ping")]
    public ActionResult Index()
    {
        return Content("pong");
    }
}
