using Microsoft.IO;

namespace Shared.Services.Pools;

public static class PoolInvk
{
    public static readonly RecyclableMemoryStreamManager msm = new RecyclableMemoryStreamManager(new RecyclableMemoryStreamManager.Options
    (
        blockSize: bufferSize,                         // small blocks (80 КБ)
        largeBufferMultiple: 1024 * 1024,              // ступень роста 1 MB
        maximumBufferSize: 10 * 1024 * 1024,           // не кешируем >10 MB
        maximumSmallPoolFreeBytes: 128L * 1024 * 1024, // максимальный размер пула small blocks (128 MB)
        maximumLargePoolFreeBytes: 32L * 1024 * 1024   // общий размер пула largeBufferMultiple/maximumBufferSize (32 MB)
    )
    {
        AggressiveBufferReturn = false
    });


    public static int bufferSize
    {
        get
        {
            int size = CoreInit.conf.pool.BufferSize > 0 ? CoreInit.conf.pool.BufferSize : 81920;
            if (CoreInit.conf.lowMemoryMode)
                return Math.Min(size, 4096);

            return size;
        }
    }


    static readonly int[] sizesRent =
    {
        128 * 1024,
        512 * 1024,
        1024 * 1024,
        5 * 1024 * 1024,
        10 * 1024 * 1024,
        20 * 1024 * 1024
    };

    public static int RentedLen(int length = 0)
    {
        for (int i = 0; i < sizesRent.Length; i++)
        {
            if (sizesRent[i] >= length)
                return sizesRent[i];
        }

        throw new ArgumentException("large rent");
    }
}
