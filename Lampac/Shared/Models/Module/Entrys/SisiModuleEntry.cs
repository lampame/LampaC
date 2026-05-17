using Shared.Models.Module.Interfaces;
using System.Reflection;

namespace Shared.Models.Module.Entrys;

public class SisiModuleEntry
{
    public static List<IModuleSisi> Modules;
    public static List<IModuleSisiAsync> ModulesAsync;

    static readonly object _lock = new object();

    public static void EnsureCache(bool forced = false)
    {
        if (forced == false && Modules != null)
            return;

        lock (_lock)
        {
            if (forced == false && Modules != null)
                return;

            Modules = new List<IModuleSisi>();
            ModulesAsync = new List<IModuleSisiAsync>();

            try
            {
                foreach (var mod in CoreInit.modules.Where(m => m?.assembly != null && m.enable))
                {
                    var asm = mod.assembly;

                    IEnumerable<Type> types;

                    try
                    {
                        types = asm.GetTypes();
                    }
                    catch (ReflectionTypeLoadException rtle)
                    {
                        Serilog.Log.Error(rtle, "CatchId={CatchId}", "id_83c22b34");
                        types = rtle.Types.Where(t => t != null);
                    }
                    catch
                    {
                        continue;
                    }

                    foreach (var type in types)
                    {
                        try
                        {
                            if (!type.IsClass || type.IsAbstract)
                                continue;

                            if (typeof(IModuleSisi).IsAssignableFrom(type))
                            {
                                // Требуется public parameterless ctor
                                var instance = Activator.CreateInstance(type) as IModuleSisi;
                                if (instance != null)
                                    Modules.Add(instance);
                            }

                            if (typeof(IModuleSisiAsync).IsAssignableFrom(type))
                            {
                                var instance = Activator.CreateInstance(type) as IModuleSisiAsync;
                                if (instance != null)
                                    ModulesAsync.Add(instance);
                            }
                        }
                        catch
                        {
                            // игнорируем сломанные типы
                        }
                    }
                }
            }
            catch (System.Exception ex)
            {
                Serilog.Log.Error(ex, "{Class} {CatchId}", "SisiModuleEntry", "id_txay880j");
            }
        }
    }
}
