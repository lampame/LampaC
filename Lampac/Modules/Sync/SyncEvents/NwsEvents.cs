using Shared;
using Shared.Models.Events;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SyncEvents;

public static class NwsEvents
{
    static readonly ConcurrentDictionary<string, string> eventClients = new();
    static int initialized = 0;
    static bool _onlyreg;

    public static void Start(bool onlyreg)
    {
        if (System.Threading.Interlocked.Exchange(ref initialized, 1) == 1)
            return;

        _onlyreg = onlyreg;
        EventListener.NwsMessage += OnNwsMessage;
        EventListener.NwsDisconnected += OnNwsDisconnected;
    }

    public static void Stop()
    {
        EventListener.NwsMessage -= OnNwsMessage;
        EventListener.NwsDisconnected -= OnNwsDisconnected;
        System.Threading.Interlocked.Exchange(ref initialized, 0);
    }

    static void OnNwsDisconnected(EventNwsDisconnected e)
    {
        if (!string.IsNullOrEmpty(e.connectionId))
            eventClients.TryRemove(e.connectionId, out _);
    }

    static void OnNwsMessage(EventNwsMessage e)
    {
        switch (e.method?.ToLowerInvariant())
        {
            case "registryevent":
                {
                    string uid = GetStringArg(e.args, 0);
                    if (!string.IsNullOrEmpty(uid))
                        eventClients.AddOrUpdate(e.connectionId, uid, (_, __) => uid);
                    break;
                }

            case "events":
                {
                    if (_onlyreg)
                        break;
                    string uid = GetStringArg(e.args, 0);
                    string name = GetStringArg(e.args, 1);
                    string data = GetStringArg(e.args, 2);
                    _ = SendAsync(e.connectionId, uid, name, data);
                    break;
                }

            case "eventsid":
                {
                    if (_onlyreg)
                        break;
                    string targetConnection = GetStringArg(e.args, 0);
                    string uid = GetStringArg(e.args, 1);
                    string name = GetStringArg(e.args, 2);
                    string data = GetStringArg(e.args, 3);
                    _ = SendToConnectionAsync(targetConnection, uid, name, data);
                    break;
                }
        }
    }

    public static Task SendAsync(string connectionId, string uid, string name, string data)
    {
        if (string.IsNullOrEmpty(uid) || string.IsNullOrEmpty(name))
            return Task.CompletedTask;

        var targets = eventClients
            .Where(i => i.Value == uid && (connectionId == null || i.Key != connectionId))
            .Select(i => i.Key)
            .ToArray();

        if (targets.Length == 0)
            return Task.CompletedTask;

        var tasks = new List<Task>(targets.Length);
        foreach (string targetId in targets)
            tasks.Add(Startup.Nws.SendAsync(targetId, "event", uid, name, data ?? string.Empty));

        return Task.WhenAll(tasks);
    }

    static Task SendToConnectionAsync(string connectionId, string uid, string name, string data)
    {
        if (string.IsNullOrEmpty(connectionId) || string.IsNullOrEmpty(name))
            return Task.CompletedTask;

        return Startup.Nws.SendAsync(connectionId, "event", uid ?? string.Empty, name, data ?? string.Empty);
    }

    static string GetStringArg(JsonElement args, int index)
    {
        if (args.ValueKind != JsonValueKind.Array || args.GetArrayLength() <= index)
            return null;

        var element = args[index];
        if (element.ValueKind == JsonValueKind.String)
            return element.GetString();

        if (element.ValueKind == JsonValueKind.Null)
            return null;

        return element.ToString();
    }
}
