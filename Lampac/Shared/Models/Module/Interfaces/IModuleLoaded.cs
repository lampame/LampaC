namespace Shared.Models.Module.Interfaces;

public interface IModuleLoaded
{
    void Loaded(InitspaceModel baseconf);

    void Dispose();
}
