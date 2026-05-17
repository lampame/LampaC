using Newtonsoft.Json.Linq;

namespace Shared.Services.Hybrid;

public static class TypeCache<T>
{
    public static readonly Type Type = typeof(T);

    public static readonly bool IsText = Type == typeof(string);

    public static readonly bool IsDeserializable =
        Type.GetConstructor(Type.EmptyTypes) != null
        || Type.IsValueType
        || Type.IsArray
        || Type == typeof(JToken)
        || Type == typeof(JObject)
        || Type == typeof(JArray);
}
