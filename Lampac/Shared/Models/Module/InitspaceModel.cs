using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Shared.Models.Module;

public class InitspaceModel
{
    public string path { get; set; }

    public INws nws { get; set; }

    public IConfiguration configuration { get; set; }

    public IServiceCollection services { get; set; }

    public IApplicationBuilder app { get; set; }
}
