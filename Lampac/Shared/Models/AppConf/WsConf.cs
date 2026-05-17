namespace Shared.Models.AppConf;

public class WsConf
{
    public bool send_pong { get; set; }

    public int inactiveAfterMinutes { get; set; }

    public int MaximumReceiveMessageSize { get; set; }

    public bool rch { get; set; }

    public int minVersion { get; set; }
}
