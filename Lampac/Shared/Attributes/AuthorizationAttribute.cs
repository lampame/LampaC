namespace Shared.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class AuthorizationAttribute : Attribute
{
    public AuthorizationAttribute(string accessDeniedMessage = null, string redirectUri = null)
    {
        this.accessDeniedMessage = accessDeniedMessage;
        this.redirectUri = redirectUri;
    }

    public string accessDeniedMessage { get; }

    public string redirectUri { get; }
}
