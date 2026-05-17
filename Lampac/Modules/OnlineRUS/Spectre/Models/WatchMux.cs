using System;
using System.Net.WebSockets;
using System.Threading;

namespace Spectre;

public class WatchMux : IDisposable
{
    public string streamId { get; set; }

    public ClientWebSocket ws { get; set; }

    public CancellationTokenSource wscts { get; set; }

    public DateTime lastreq { get; set; }

    public string edge_hash { get; set; }

    public string resolution { get; set; }

    public string requestOrigin { get; set; }

    public string requestReferer { get; set; }

    public int current_time { get; set; }

    public int last_time { get; set; }

    public void Dispose()
    {
        edge_hash = null;
        resolution = null;
        lastreq = default;

        try
        {
            wscts?.Cancel();
        }
        catch { }

        try
        {
            _ = ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None).ContinueWith(i => ws = null);
        }
        catch { }
    }
}
