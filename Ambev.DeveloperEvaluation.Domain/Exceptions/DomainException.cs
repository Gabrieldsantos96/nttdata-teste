namespace Ambev.DeveloperEvaluation.Domain.Exceptions;

public class MiddlewareException : Exception
{
    public MiddlewareException()
    { }

    public MiddlewareException(string message)
        : base(message)
    { }

    public MiddlewareException(string message, Exception innerException)
        : base(message, innerException)
    { }
}

public class DomainException : Exception
{
    public DomainException()
    { }

    public DomainException(string message)
        : base(message)
    { }

    public DomainException(string message, Exception innerException)
        : base(message, innerException)
    { }
}
