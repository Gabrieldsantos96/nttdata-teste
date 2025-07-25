using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
public sealed class GetProfileQuery : IRequest<UserProfileDto>;