namespace Shared.Models.SISI.OnResult
{
    public class OnErrorResult
    {
        public OnErrorResult(string msg)
        {
            this.msg = msg;
        }

        public bool accsdb { get; set; } = true;

        public bool error { get; set; } = true;

        public string msg { get; set; }
    }
}
