using Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.AccessPoint.Controllers.Authentication;
public class SignInEndpoint(IMediator mediator) : Endpoint<SignInDto, SignInResult>
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.SignIn);
        AllowAnonymous();
    }
    public override async Task HandleAsync(SignInDto req, CancellationToken ct)
    {
        var token = await mediator.Send(new SignInCommand()
        {
            Email = req.Email,
            Password = req.Password
        }, ct);

        await SendOkAsync(token, ct);
    }
}