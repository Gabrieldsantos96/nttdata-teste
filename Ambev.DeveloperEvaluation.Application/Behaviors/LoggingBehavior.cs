using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace Ambev.DeveloperEvaluation.Application.Behaviors;

public sealed class LoggingBehaviour<TRequest>(ILogger<TRequest> logger) : IRequestPreProcessor<TRequest>
    where TRequest : notnull
{
    public Task Process(TRequest request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Starting feature execution: {featureFromRequestName}, user {userId}",
            typeof(TRequest).Name,
            "1");
        return Task.CompletedTask;
    }
}
