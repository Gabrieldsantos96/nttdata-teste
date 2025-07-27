using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public sealed class SignUpCommandHandler(UserManager<User> userManager, IPasswordHelper passwordHelper) : IRequestHandler<SignUpCommand, MutationResult<object>>
{
    public async Task<MutationResult<object>> Handle(SignUpCommand input, CancellationToken ct)
    {
        var newUser = User.Create
            (email: input.Command.Email,
            userName: input.Command.Email,
            name: input.Command.Name,
            phone: input.Command.Phone,
            role: input.Command.Role,
            status: input.Command.Status,
            street: input.Command.Street,
            zipcode: input.Command.Zipcode,
            number: input.Command.Number,
            city: input.Command.City,
            geo: input.Command.Geo
            );

        newUser.PasswordHash = passwordHelper.GeneratePassword(newUser, input.Command.Password);

        var result = await userManager.CreateAsync(newUser);

        if (result.Succeeded)
        {
            return MutationResult<object>.Ok("Usuário criado com sucesso", new object());
        }

        throw new Exception("Erro ao tentar criar usuário");

    }
}


