using Shared.Services.Native;
using System.Collections.Concurrent;
using System.Threading;

namespace Shared.Services.Pools;

public sealed class BufferPool : IDisposable
{
    static readonly ConcurrentBag<NativeBuffer<byte>> _pool = new();

    #region OpenStat
    public static int Free
        => _pool.Count;

    static long _disposeCount;

    public static long DisposeCount
        => Interlocked.Read(ref _disposeCount);
    #endregion

    private NativeBuffer<byte> _nbuf;
    private int _disposed;

    public BufferPool()
    {
        if (!_pool.TryTake(out _nbuf))
            _nbuf = new NativeBuffer<byte>(PoolInvk.bufferSize);
    }

    public Memory<byte> Memory
        => _nbuf.Memory;

    public Span<byte> Span
       => _nbuf.Memory.Span;

    public void Dispose()
    {
        if (Interlocked.Exchange(ref _disposed, 1) != 0)
            return;

        bool IsExpires = _nbuf.IsExpires;
        int maxCount = (CoreInit.conf?.pool?.BufferMax ?? 500_000000) / PoolInvk.bufferSize; // ~500Mb
        if (1 > maxCount)
            maxCount = 1;

        if (IsExpires || _pool.Count >= maxCount)
        {
            if (!IsExpires)
                Interlocked.Increment(ref _disposeCount);

            ((IDisposable)_nbuf).Dispose();
            return;
        }

        _pool.Add(_nbuf);
    }
}
