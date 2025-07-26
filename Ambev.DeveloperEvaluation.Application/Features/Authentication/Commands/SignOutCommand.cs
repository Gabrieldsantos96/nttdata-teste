using Ambev.DeveloperEvaluation.Shared.Models;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public record SignOutDto(string RefreshToken);
public record SignOutCommand(string RefreshToken) : IRequest<MutationResult<object>>;
public sealed class SignOutCommandValidator : AbstractValidator<SignOutCommand>
{
    public SignOutCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("token"));
    }
}