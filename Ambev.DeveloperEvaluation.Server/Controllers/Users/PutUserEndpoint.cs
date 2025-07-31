using Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;


namespace Ambev.DeveloperEvaluation.Server.Controllers.Users;

public sealed class UpdateUserEndpoint(IMediator mediator) : Endpoint<UpdateUserDto, MutationResult<User>>
{
    public override void Configure()
    {
        Put(ApiRoutes.Users.UpdateUser);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(UpdateUserDto req, CancellationToken ct)
    {
        var userId = Route<Guid>("id", isRequired: true);

        var result = await mediator.Send(new UpdateUserCommand
        {
            City = req.City,
            Email = req.Email,
            Geolocation = req.Geolocation,
            Name = req.Name,
            Number = req.Number,
            Phone = req.Phone,
            RefId = userId,
            Role = req.Role,
            Status = req.Status,
            Street = req.Street,
            UserName = req.UserName,
            Zipcode = req.Zipcode
        }, ct);

        await SendOkAsync(result, ct);
    }
}