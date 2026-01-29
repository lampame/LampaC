using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Engine
{
    public static class CryptoKit
    {
        public static string RandomKey()
        {
            Span<byte> key = stackalloc byte[32]; // 256-bit
            RandomNumberGenerator.Fill(key);

            int base64Length = ((key.Length + 2) / 3) * 4;

            return string.Create(base64Length, key, static (span, key) =>
            {
                Convert.TryToBase64Chars(key, span, out _);
            });
        }

        public static bool TestKey(string keyBase64)
        {
            try
            {
                byte[] key = Convert.FromBase64String(keyBase64);

                Span<byte> nonce = stackalloc byte[12];
                RandomNumberGenerator.Fill(nonce);

                Span<byte> plaintext = stackalloc byte[4];
                Encoding.UTF8.GetBytes("test", plaintext);

                Span<byte> ciphertext = stackalloc byte[plaintext.Length];
                Span<byte> tag = stackalloc byte[16];

                using (var aes = new AesGcm(key, 16))
                {
                    aes.Encrypt(nonce, plaintext, ciphertext, tag);

                    Span<byte> decrypted = stackalloc byte[ciphertext.Length];
                    aes.Decrypt(nonce, ciphertext, tag, decrypted);

                    return decrypted.SequenceEqual("test"u8);
                }
            }
            catch
            {
                return false;
            }
        }

        public static unsafe bool Write(string keyBase64, ReadOnlySpan<char> json, string filePath)
        {
            byte* pPlain = null;
            byte* pCipher = null;

            try
            {
                byte[] key = Convert.FromBase64String(keyBase64);

                Span<byte> nonce = stackalloc byte[12];
                RandomNumberGenerator.Fill(nonce);

                Span<byte> tag = stackalloc byte[16];

                int plainLen = Encoding.UTF8.GetByteCount(json);
                pPlain = (byte*)NativeMemory.Alloc((nuint)plainLen);
                pCipher = (byte*)NativeMemory.Alloc((nuint)plainLen);

                var plaintext = new Span<byte>(pPlain, plainLen);
                var ciphertext = new Span<byte>(pCipher, plainLen);

                int written = Encoding.UTF8.GetBytes(json, plaintext);
                if (written != plainLen)
                    return false; // на всякий случай

                using (var aes = new AesGcm(key, 16))
                    aes.Encrypt(nonce, plaintext, ciphertext, tag);

                using (var fs = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    fs.Write(nonce);
                    fs.Write(tag);
                    fs.Write(ciphertext);
                }

                return true;
            }
            catch
            {
                return false;
            }
            finally
            {
                if (pPlain != null) NativeMemory.Free(pPlain);
                if (pCipher != null) NativeMemory.Free(pCipher);
            }
        }

        public static unsafe string ReadFile(string keyBase64, string filePath)
        {
            byte* pData = null;

            try
            {
                using (var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: PoolInvk.rentChunk, options: FileOptions.SequentialScan))
                {
                    long len64 = fs.Length;

                    if (len64 < 28)
                        return null;

                    if (len64 > int.MaxValue)
                        return null;

                    int len = (int)len64;

                    pData = (byte*)NativeMemory.Alloc((nuint)len);
                    var data = new Span<byte>(pData, len);

                    int total = 0;
                    while (total < len)
                    {
                        int n = fs.Read(data.Slice(total));
                        if (n <= 0)
                            return null;

                        total += n;
                    }

                    return Read(keyBase64, data);
                }
            }
            catch
            {
                return null;
            }
            finally
            {
                if (pData != null)
                    NativeMemory.Free(pData);
            }
        }

        public static unsafe string Read(string keyBase64, ReadOnlySpan<char> data)
        {
            int maxLen = (data.Length / 4) * 3 + 3;

            byte* pData = null;

            try
            {
                pData = (byte*)NativeMemory.Alloc((nuint)maxLen);
                var decoded = new Span<byte>(pData, maxLen);

                if (!Convert.TryFromBase64Chars(data, decoded, out int written))
                    return null;

                return Read(keyBase64, decoded.Slice(0, written));
            }
            catch
            {
                return null;
            }
            finally
            {
                if (pData != null)
                    NativeMemory.Free(pData);
            }
        }

        public static string Read(string keyBase64, byte[] data)
        {
            return Read(keyBase64, data.AsSpan());
        }

        public static unsafe string Read(string keyBase64, ReadOnlySpan<byte> data)
        {
            byte* pPlain = null;

            try
            {
                byte[] key = Convert.FromBase64String(keyBase64);

                ReadOnlySpan<byte> nonce = data.Slice(0, 12);
                ReadOnlySpan<byte> tag = data.Slice(12, 16);
                ReadOnlySpan<byte> ciphertext = data.Slice(28);

                int plainLen = ciphertext.Length;

                pPlain = (byte*)NativeMemory.Alloc((nuint)plainLen);
                var plaintext = new Span<byte>(pPlain, plainLen);

                using (var aes = new AesGcm(key, 16))
                    aes.Decrypt(nonce, ciphertext, tag, plaintext);

                int charCount = Encoding.UTF8.GetCharCount(plaintext);

                return string.Create(charCount, (Ptr: (IntPtr)pPlain, Len: plainLen), static (dest, state) =>
                {
                    var bytes = new ReadOnlySpan<byte>((byte*)state.Ptr, state.Len);
                    Encoding.UTF8.GetChars(bytes, dest);
                });
            }
            catch
            {
                return null;
            }
            finally
            {
                if (pPlain != null)
                    NativeMemory.Free(pPlain);
            }
        }
    }
}
