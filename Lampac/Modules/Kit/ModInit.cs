using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace KitMod
{
    public class ModInit : IModuleLoaded
    {
        public static string folder_mod { get; private set; }

        public void Loaded(InitspaceModel conf)
        {
            folder_mod = conf.path;
        }

        public void Dispose()
        {
        }
    }
}
