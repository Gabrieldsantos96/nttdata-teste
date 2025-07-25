using Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Queries;
public sealed class GetProfileQueryHandler(IClaimsService claimsService) : IRequestHandler<GetProfileQuery, UserProfileDto>
{
    public Task<UserProfileDto> Handle(GetProfileQuery input, CancellationToken ct)
    {
        var userProfileDto = new UserProfileDto()
        {
            RefId = claimsService.GetUserRefId(),
            Name = claimsService.GetUsernameValueObject()!,
            Address = claimsService.GetAddressValueObject()!,
            Phone = claimsService.GetPhone()!,
            Status = claimsService.GetStatus()!
        };

        return Task.FromResult(userProfileDto);
    }
}

