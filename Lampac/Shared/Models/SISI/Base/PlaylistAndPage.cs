namespace Shared.Models.SISI.Base
{
    public class PlaylistAndPage
    {
        public PlaylistAndPage() { }

        public PlaylistAndPage(int total_pages, List<PlaylistItem> playlists) 
        {
            this.total_pages = total_pages;
            this.playlists = playlists;
        }

        public PlaylistAndPage(List<PlaylistItem> playlists, int total_pages = 0)
        {
            this.total_pages = total_pages;
            this.playlists = playlists;
        }

        public int total_pages { get; set; }

        public List<PlaylistItem> playlists { get; set; }
    }
}
