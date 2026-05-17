using Microsoft.Extensions.DependencyInjection;

namespace Shared.Models.Module;

public class ConfigureModel
{
    public IServiceCollection services { get; set; }

    public IMvcBuilder mvcBuilder { get; set; }
}
