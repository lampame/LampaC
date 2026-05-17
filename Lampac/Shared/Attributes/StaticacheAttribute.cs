namespace Shared.Attributes;

public record StatiCacheEntry(DateTimeOffset ex);


[AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class StaticacheAttribute : Attribute
{
    public StaticacheAttribute(int cacheMinutes = 1)
    {
        if (0 >= cacheMinutes)
            cacheMinutes = 1;

        this.cacheMinutes = cacheMinutes;
    }

    public int cacheMinutes { get; }
}
