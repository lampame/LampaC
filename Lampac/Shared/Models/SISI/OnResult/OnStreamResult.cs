using Shared.Models.SISI.Base;

namespace Shared.Models.SISI.OnResult
{
    public class OnStreamResult
    {
        public OnStreamResult(int recomendsCount) 
        {
            recomends = new PlaylistItem[recomendsCount];
        }

        public Dictionary<string, string> qualitys { get; set; }

        public Dictionary<string, string> qualitys_proxy { get; set; }

        public Dictionary<string, string> headers_stream { get; set; }

        public PlaylistItem[] recomends { get; set; }
    }
}
