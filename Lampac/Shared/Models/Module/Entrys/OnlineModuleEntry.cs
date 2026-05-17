using Shared.Models.Module.Interfaces;
using System.Reflection;

namespace Shared.Models.Module.Entrys;

public class OnlineModuleEntry
{
    public static List<IModuleOnline> Modules;
    public static List<IModuleOnlineAsync> ModulesAsync;

    public static List<IModuleOnlineSpider> Spiders;
    public static List<IModuleOnlineSpiderAsync> SpidersAsync;

    static readonly object _lock = new object();

    public static void EnsureCache(bool forced = false)
    {
        if (forced == false && Modules != null)
            return;

        lock (_lock)
        {
            if (forced == false && Modules != null)
                return;

            Modules = new List<IModuleOnline>();
            ModulesAsync = new List<IModuleOnlineAsync>();
            Spiders = new List<IModuleOnlineSpider>();
            SpidersAsync = new List<IModuleOnlineSpiderAsync>();

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
                        Serilog.Log.Error(rtle, "CatchId={CatchId}", "id_aeff5762");
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

                            if (typeof(IModuleOnline).IsAssignableFrom(type))
                            {
                                // Требуется public parameterless ctor
                                var instance = Activator.CreateInstance(type) as IModuleOnline;
                                if (instance != null)
                                    Modules.Add(instance);
                            }

                            if (typeof(IModuleOnlineAsync).IsAssignableFrom(type))
                            {
                                var instance = Activator.CreateInstance(type) as IModuleOnlineAsync;
                                if (instance != null)
                                    ModulesAsync.Add(instance);
                            }

                            if (typeof(IModuleOnlineSpider).IsAssignableFrom(type))
                            {
                                var instance = Activator.CreateInstance(type) as IModuleOnlineSpider;
                                if (instance != null)
                                    Spiders.Add(instance);
                            }

                            if (typeof(IModuleOnlineSpiderAsync).IsAssignableFrom(type))
                            {
                                var instance = Activator.CreateInstance(type) as IModuleOnlineSpiderAsync;
                                if (instance != null)
                                    SpidersAsync.Add(instance);
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
                Serilog.Log.Error(ex, "{Class} {CatchId}", "OnlineModuleEntry", "id_vmvbnc5h");
            }
        }
    }

}
