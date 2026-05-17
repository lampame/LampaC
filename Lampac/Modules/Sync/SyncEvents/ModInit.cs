using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace SyncEvents;

public class ModInit : IModuleLoaded
{
    public void Loaded(InitspaceModel baseconf)
    {
        NwsEvents.Start(onlyreg: false);
    }

    public void Dispose()
    {
        NwsEvents.Stop();
    }
}
