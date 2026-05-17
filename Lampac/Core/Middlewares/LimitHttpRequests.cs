using Microsoft.AspNetCore.Http;
using Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Middlewares;

public class LimitHttpRequests
{
    private static int _activeHttpRequests;
    public static int ActiveHttpRequests
        => Volatile.Read(ref _activeHttpRequests);

    private readonly RequestDelegate _next;

    public LimitHttpRequests(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.RequestAborted.IsCancellationRequested)
            return;

        if (CoreInit.conf.listen.LimitHttpRequests > 0)
        {
            if (_activeHttpRequests >= CoreInit.conf.listen.LimitHttpRequests)
            {
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                return;
            }
        }

        Interlocked.Increment(ref _activeHttpRequests);

        try
        {
            await _next(context);
        }
        finally
        {
            Interlocked.Decrement(ref _activeHttpRequests);
        }
    }
}
