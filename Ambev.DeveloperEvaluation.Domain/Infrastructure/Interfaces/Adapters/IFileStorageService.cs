using Microsoft.AspNetCore.Http;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
public interface IFileStorageService
{
    Task<(string, string)> UploadFileAsync(string base64String, string fileName = "image", CancellationToken ct = default);
}