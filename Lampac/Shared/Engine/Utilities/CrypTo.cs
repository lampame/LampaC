using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Engine
{
    public class CrypTo
    {
        #region md5 - StringBuilder
        public static unsafe string md5(StringBuilder text)
        {
            if (text == null || text.Length == 0)
                return string.Empty;

            int byteCount = 0;
            foreach (var chunk in text.GetChunks())
            {
                if (chunk.IsEmpty)
                    continue;

                byteCount += Encoding.UTF8.GetByteCount(chunk.Span);
            }

            if (byteCount == 0)
                return string.Empty;

            if (byteCount < 512)
            {
                Span<byte> utf8 = stackalloc byte[byteCount];
                int offset = 0;

                foreach (var chunk in text.GetChunks())
                {
                    if (chunk.IsEmpty)
                        continue;

                    offset += Encoding.UTF8.GetBytes(chunk.Span, utf8.Slice(offset));
                }

                Span<byte> hash = stackalloc byte[16];     // MD5 = 16 байт
                if (!MD5.TryHashData(utf8, hash, out _))
                    return string.Empty;

                Span<char> hex = stackalloc char[32];      // 16 байт -> 32 hex-символа
                if (!Convert.TryToHexStringLower(hash, hex, out _))
                    return string.Empty;

                return new string(hex);
            }
            else
            {
                char* nativeBuffer = (char*)NativeMemory.Alloc((nuint)(text.Length * sizeof(char)));
                Span<char> buffer = new Span<char>(nativeBuffer, text.Length);

                try
                {
                    int offset = 0;
                    foreach (var chunk in text.GetChunks())
                    {
                        if (chunk.IsEmpty)
                            continue;

                        chunk.Span.CopyTo(buffer.Slice(offset));
                        offset += chunk.Length;
                    }

                    return md5(buffer);
                }
                finally
                {
                    NativeMemory.Free(nativeBuffer);
                }
            }
        }
        #endregion

        #region md5 - string
        public static string md5(ReadOnlySpan<char> text)
        {
            if (text.IsEmpty)
                return string.Empty;

            int byteCount = Encoding.UTF8.GetByteCount(text);
            if (byteCount < 512)
                return md5Stack(text, byteCount);

            return md5Native(text, byteCount);
        }

        static unsafe string md5Native(ReadOnlySpan<char> text, int byteCount)
        {
            byte* nativeBuffer = (byte*)NativeMemory.Alloc((nuint)byteCount);
            Span<byte> utf8 = new Span<byte>(nativeBuffer, byteCount);

            try
            {
                Encoding.UTF8.GetBytes(text, utf8);

                Span<byte> hash = stackalloc byte[16];     // MD5 = 16 байт
                if (!MD5.TryHashData(utf8, hash, out _))
                    return string.Empty;

                Span<char> hex = stackalloc char[32];      // 16 байт -> 32 hex-символа
                if (!Convert.TryToHexStringLower(hash, hex, out _))
                    return string.Empty;

                return new string(hex);
            }
            finally
            {
                NativeMemory.Free(nativeBuffer);
            }
        }

        static string md5Stack(ReadOnlySpan<char> text, int byteCount)
        {
            Span<byte> utf8 = stackalloc byte[byteCount];

            Encoding.UTF8.GetBytes(text, utf8);

            Span<byte> hash = stackalloc byte[16];     // MD5 = 16 байт
            if (!MD5.TryHashData(utf8, hash, out _))
                return string.Empty;

            Span<char> hex = stackalloc char[32];      // 16 байт -> 32 hex-символа
            if (!Convert.TryToHexStringLower(hash, hex, out _))
                return string.Empty;

            return new string(hex);
        }
        #endregion

        #region md5File
        public static string md5File(string path)
        {
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
                return string.Empty;

            try
            {
                Span<byte> hash = stackalloc byte[16];

                using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, PoolInvk.bufferSize, FileOptions.SequentialScan))
                {
                    int bytesWritten = MD5.HashData(stream, hash);
                    if (bytesWritten != 16)
                        return string.Empty;
                }

                Span<char> hex = stackalloc char[32];
                if (!Convert.TryToHexStringLower(hash, hex, out _))
                    return string.Empty;

                return new string(hex);
            }
            catch { return string.Empty; }
        }
        #endregion

        #region md5binary
        public static byte[] md5binary(string text)
        {
            if (text == null)
                return null;

            using (var md5 = MD5.Create())
            {
                var result = md5.ComputeHash(Encoding.UTF8.GetBytes(text));
                return result;
            }
        }
        #endregion

        public static string DecodeBase64(string base64Text)
        {
            if (string.IsNullOrEmpty(base64Text))
                return string.Empty;

            try
            {
                return Encoding.UTF8.GetString(Convert.FromBase64String(base64Text));
            }
            catch { }

            return string.Empty;
        }

        public static string Base64(string text)
        {
            if (text == null)
                return string.Empty;

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(text));
        }

        public static string Base64(byte[] text)
        {
            if (text == null)
                return string.Empty;

            return Convert.ToBase64String(text);
        }

        public static string SHA256(string text)
        {
            using (SHA256 sha256 = System.Security.Cryptography.SHA256.Create())
            {
                // Compute the hash of the given string
                byte[] hashValue = sha256.ComputeHash(Encoding.UTF8.GetBytes(text));

                // Convert the byte array to string format
                return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
            }
        }

        public static string SHA(string text)
        {
            using (SHA1 sha = SHA1.Create())
            {
                // Compute the hash of the given string
                byte[] hashValue = sha.ComputeHash(Encoding.UTF8.GetBytes(text));

                // Convert the byte array to string format
                return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
            }
        }

        public static string AES256(string text, string secret_pw, string secret_iv)
        {
            using (Aes encryptor = Aes.Create())
            {
                encryptor.Mode = CipherMode.CBC;
                encryptor.KeySize = 256;
                encryptor.BlockSize = 128;
                encryptor.Padding = PaddingMode.PKCS7;

                // Set key and IV
                encryptor.Key = Encoding.UTF8.GetBytes(SHA256(secret_pw).Substring(0, 32));
                encryptor.IV = Encoding.UTF8.GetBytes(SHA256(secret_iv).Substring(0, 16));

                // Instantiate a new MemoryStream object to contain the encrypted bytes
                MemoryStream memoryStream = new MemoryStream();

                // Instantiate a new encryptor from our Aes object
                ICryptoTransform aesEncryptor = encryptor.CreateEncryptor();

                // Instantiate a new CryptoStream object to process the data and write it to the 
                // memory stream
                CryptoStream cryptoStream = new CryptoStream(memoryStream, aesEncryptor, CryptoStreamMode.Write);

                // Convert the plainText string into a byte array
                byte[] plainBytes = Encoding.UTF8.GetBytes(text);

                // Encrypt the input plaintext string
                cryptoStream.Write(plainBytes, 0, plainBytes.Length);

                // Complete the encryption process
                cryptoStream.FlushFinalBlock();

                // Convert the encrypted data from a MemoryStream to a byte array
                byte[] cipherBytes = memoryStream.ToArray();

                // Close both the MemoryStream and the CryptoStream
                memoryStream.Close();
                cryptoStream.Close();

                // Convert the encrypted byte array to a base64 encoded string
                return Convert.ToBase64String(cipherBytes, 0, cipherBytes.Length);
            }
        }

        #region unic
        static string ArrayList => "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890";
        static string ArrayListToNumber => "1234567890";
        public static string unic(int size = 8, bool IsNumberCode = false, string addArrayList = null)
        {
            StringBuilder array = new StringBuilder(size);
            string list = IsNumberCode ? ArrayListToNumber : ArrayList + addArrayList;

            for (int i = 0; i < size; i++)
                array.Append(list[Random.Shared.Next(0, list.Length)]);

            return array.ToString();
        }
        #endregion
    }
}
