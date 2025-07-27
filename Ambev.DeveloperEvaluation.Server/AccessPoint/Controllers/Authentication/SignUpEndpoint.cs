using Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.AccessPoint.Controllers.Authentication;
public class SignUpEndpoint(IMediator mediator) : Endpoint<SignUpDto, MutationResult<object>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.Register);
        AllowAnonymous();
    }
    public override async Task HandleAsync(SignUpDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new SignUpCommand()
        {
            Command = req
        }, ct);

        await SendOkAsync(result, ct);
    }
}