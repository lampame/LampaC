using Newtonsoft.Json;

namespace Shared.Models.AppConf
{
    public class BaseModule
    {
        public bool allowExternalIpAccessToLocalRequest { get; set; }

        public bool ws { get; set; }

        public bool nws { get; set; }

        public bool kurwaCron { get; set; }

        public BaseModuleMiddlewares Middlewares { get; set; }

        public BaseModuleSql Sql { get; set; }

        public string[] EnableControllers { get; set; }
    }


    public class BaseModuleMiddlewares
    {
        public bool proxy { get; set; }

        public bool proxyimg { get; set; }

        public bool proxycub { get; set; }

        public bool proxytmdb { get; set; }

        #region staticFiles
        public bool staticFiles { get; set; }

        public bool unknownStaticFiles { get; set; }


        [JsonProperty("staticFilesMappings", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> staticFilesMappings = new Dictionary<string, string>() 
        {
            [".m4s"] = "video/mp4",
            [".ts"] = "video/mp2t",
            [".mp4"] = "video/mp4",
            [".mkv"] = "video/x-matroska",
            [".m3u"] = "application/x-mpegURL",
            [".m3u8"] = "application/vnd.apple.mpegurl",
            [".webm"] = "video/webm",
            [".mov"] = "video/quicktime",
            [".avi"] = "video/x-msvideo",
            [".wmv"] = "video/x-ms-wmv",
            [".flv"] = "video/x-flv",
            [".ogv"] = "video/ogg",
            [".m2ts"] = "video/MP2T",
            [".vob"] = "video/x-ms-vob",

            [".apk"] = "application/vnd.android.package-archive",
            [".aab"] = "application/vnd.android.appbundle",
            [".xapk"] = "application/vnd.android.package-archive",
            [".apkm"] = "application/vnd.android.package-archive",
            [".obb"] = "application/octet-stream",

            [".exe"] = "application/vnd.microsoft.portable-executable",
            [".msi"] = "application/x-msi",
            [".bat"] = "application/x-msdownload",
            [".cmd"] = "application/x-msdownload",
            [".msix"] = "application/msix",
            [".msixbundle"] = "application/msixbundle",
            [".appx"] = "application/appx",
            [".appxbundle"] = "application/appxbundle",

            [".deb"] = "application/vnd.debian.binary-package",
            [".rpm"] = "application/x-rpm",
            [".sh"] = "application/x-sh",
            [".bin"] = "application/octet-stream",
            [".run"] = "application/x-msdownload",
            [".appimage"] = "application/octet-stream",

            [".pkg"] = "application/octet-stream",
            [".dmg"] = "application/x-apple-diskimage",

            [".zip"] = "application/zip",
            [".rar"] = "application/vnd.rar",
            [".7z"] = "application/x-7z-compressed",
            [".gz"] = "application/gzip",
            [".tar"] = "application/x-tar",
            [".tgz"] = "application/gzip",

            [".iso"] = "application/x-iso9660-image"
        };
        #endregion

        public bool statistics { get; set; }

        public bool staticache { get; set; }

        public bool module { get; set; }
    }


    public class BaseModuleSql
    {
        public bool externalids { get; set; }

        public bool sisi { get; set; }

        public bool syncUser { get; set; }
    }
}
