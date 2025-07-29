using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Queries;
public sealed class GetProfileQueryHandler(IClaimsService claimsService) : IRequestHandler<GetProfileQuery, UserProfileResult>
{
    public Task<UserProfileResult> Handle(GetProfileQuery input, CancellationToken ct)
    {
        var userProfileDto = new UserProfileResult()
        {
            RefId = claimsService.GetUserRefId(),
            Name = claimsService.GetUsernameValueObject()!,
            Address = claimsService.GetAddressValueObject()!,
            Phone = claimsService.GetPhone()!,
            Status = claimsService.GetStatus()!,
            Role = claimsService.GetRole()!,
        };

        return Task.FromResult(userProfileDto);
    }
}

