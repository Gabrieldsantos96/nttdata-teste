using Ambev.DeveloperEvaluation.Shared.Models;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public record RefreshJwtDto(string RefreshToken);
public record RefreshJwtCommand(string RefreshToken): IRequest<MutationResult<RefreshTokenResult>>;
public sealed class RefreshJwtCommandValidator : AbstractValidator<RefreshJwtCommand>
{
    public RefreshJwtCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("token"));
    }
}
public record RefreshTokenResult(string AccessToken, string RefreshTokenHash);
