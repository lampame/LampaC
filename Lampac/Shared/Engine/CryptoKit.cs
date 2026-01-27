using System.Security.Cryptography;
using System.Text;

namespace Shared.Engine
{
    public static class CryptoKit
    {
        public static string RandomKey()
        {
            byte[] key = new byte[32]; // 256-bit
            RandomNumberGenerator.Fill(key);
            return Convert.ToBase64String(key);
        }

        public static bool Write(string keyBase64, string json, string filePath)
        {
            try
            {
                byte[] key = Convert.FromBase64String(keyBase64);

                byte[] nonce = RandomBytes(12);
                byte[] plaintext = Encoding.UTF8.GetBytes(json);

                byte[] ciphertext = new byte[plaintext.Length];
                byte[] tag = new byte[16];

                using (var aes = new AesGcm(key, 16))
                {
                    aes.Encrypt(nonce, plaintext, ciphertext, tag);
                }

                using (var fs = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                {
                    fs.Write(nonce, 0, nonce.Length);
                    fs.Write(tag, 0, tag.Length);
                    fs.Write(ciphertext, 0, ciphertext.Length);
                }

                return true;
            }
            catch 
            {
                return false;
            }
        }

        public static string Read(string keyBase64, string filePath)
        {
            try
            {
                return Read(keyBase64, File.ReadAllBytes(filePath));
            }
            catch
            {
                return null;
            }
        }

        public static string Read(string keyBase64, byte[] data)
        {
            try
            {
                byte[] key = Convert.FromBase64String(keyBase64);

                byte[] nonce = new byte[12];
                byte[] tag = new byte[16];
                byte[] ciphertext = new byte[data.Length - 28];

                Buffer.BlockCopy(data, 0, nonce, 0, 12);
                Buffer.BlockCopy(data, 12, tag, 0, 16);
                Buffer.BlockCopy(data, 28, ciphertext, 0, ciphertext.Length);

                byte[] plaintext = new byte[ciphertext.Length];

                using (var aes = new AesGcm(key, 16))
                {
                    aes.Decrypt(nonce, ciphertext, tag, plaintext);
                }

                return Encoding.UTF8.GetString(plaintext);
            }
            catch 
            {
                return null;
            }
        }

        static byte[] RandomBytes(int len)
        {
            byte[] b = new byte[len];
            RandomNumberGenerator.Fill(b);
            return b;
        }
    }
}
