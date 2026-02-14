namespace Shared.Engine
{
    public record HybridCacheEntry<T>(bool success, T value, bool singleCache);

    public class BaseHybridCache
    {
        public record TempEntry(DateTime extend, bool IsSerialize, DateTime ex, object value);

        protected static bool IsCapacityCollection(Type type)
        {
            if (type == typeof(string) || type.IsArray)
                return false;

            try
            {
                foreach (var iface in type.GetInterfaces())
                {
                    if (!iface.IsGenericType)
                        continue;

                    var def = iface.GetGenericTypeDefinition();
                    if (def == typeof(ICollection<>) || def == typeof(IReadOnlyCollection<>))
                        return true;
                }
            }
            catch { }

            return false;
        }

        protected static int GetCapacity(object value)
        {
            if (value is string)
                return 0;

            try
            {
                foreach (var iface in value.GetType().GetInterfaces())
                {
                    if (!iface.IsGenericType)
                        continue;

                    var def = iface.GetGenericTypeDefinition();

                    if (def == typeof(ICollection<>) || def == typeof(IReadOnlyCollection<>))
                    {
                        var countProperty = iface.GetProperty("Count");

                        if (countProperty?.PropertyType == typeof(int))
                            return (int)countProperty.GetValue(value);
                    }
                }
            }
            catch { }

            return 0;
        }

        protected static object CreateCollectionWithCapacity(Type type, int capacity)
        {
            try
            {
                if (!IsCapacityCollection(type))
                    return null;

                if (typeof(Newtonsoft.Json.Linq.JToken).IsAssignableFrom(type))
                    return null;

                var ctor = type
                    .GetConstructors()
                    .FirstOrDefault(c =>
                    {
                        var p = c.GetParameters();
                        return p.Length == 1 && p[0].ParameterType == typeof(int);
                    });

                if (ctor != null)
                    return ctor.Invoke(new object[] { capacity });

                if (type.IsInterface && type.IsGenericType)
                {
                    var listType = typeof(List<>).MakeGenericType(type.GetGenericArguments());
                    var listCtor = listType.GetConstructor(new[] { typeof(int) });
                    if (listCtor != null)
                        return listCtor.Invoke(new object[] { capacity });
                }
            }
            catch { }

            return null;
        }
    }
}
