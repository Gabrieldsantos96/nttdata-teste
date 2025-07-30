using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;

public class S3FileStorageService : IFileStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _baseUrl;

    public S3FileStorageService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        var s3Section = configuration.GetSection("S3");
        _bucketName = s3Section["BucketName"]!;
        _baseUrl = s3Section["BaseUrl"]!;
    }

    public async Task<(string, string)> UploadFileAsync(string base64String, string fileName = "image", CancellationToken ct = default)
    {
        try
        {

            if (base64String.Contains(","))
            {
                base64String = base64String.Split(',')[1];
            }

            byte[] fileBytes = Convert.FromBase64String(base64String);

            if (string.IsNullOrEmpty(fileName))
            {
                throw new ArgumentException("File name is missing or empty.", nameof(fileName));
            }

            string contentType = DetectContentType(fileBytes);

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var extension = GetExtensionFromContentType(contentType);
            var safeFileName = string.Concat(fileName.Split(Path.GetInvalidFileNameChars())).Replace(" ", "_");
            var finalFileName = $"{safeFileName}_{timestamp}{extension}";

            using var fileStream = new MemoryStream(fileBytes);

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = finalFileName,
                InputStream = fileStream,
                ContentType = contentType
            };

            PutObjectResponse response = await _s3Client.PutObjectAsync(putRequest, ct);

            if (response.HttpStatusCode == HttpStatusCode.OK)
            {
                return ($"{_baseUrl}{finalFileName}", finalFileName);
            }
            else
            {
                Console.WriteLine($"Falha no upload para o S3. Status: {response.HttpStatusCode}");
                return (string.Empty, string.Empty);
            }
        }
        catch (FormatException ex)
        {
            Console.WriteLine($"Erro: A string Base64 é inválida: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro no upload para o S3: {ex.Message}");
            throw;
        }
    }
    private static string DetectContentType(byte[] fileBytes)
    {
        if (fileBytes.Length < 4)
        {
            return "application/octet-stream";
        }

        if (fileBytes[0] == 0xFF && fileBytes[1] == 0xD8 && fileBytes[2] == 0xFF)
        {
            return "image/jpeg";
        }
        if (fileBytes[0] == 0x89 && fileBytes[1] == 0x50 && fileBytes[2] == 0x4E && fileBytes[3] == 0x47)
        {
            return "image/png";
        }
        if (fileBytes[0] == 0x47 && fileBytes[1] == 0x49 && fileBytes[2] == 0x46 && fileBytes[3] == 0x38)
        {
            return "image/gif";
        }

        return "application/octet-stream";
    }

    private static string GetExtensionFromContentType(string contentType)
    {
        return contentType switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/gif" => ".gif",
            _ => ".bin"
        };
    }
    public static AmazonS3Client CreateAmazonS3Client(IConfiguration configuration)
    {
        var awsSection = configuration.GetSection("AWS");
        var s3Section = configuration.GetSection("S3");

        var awsAccessKeyId = awsSection["AccessKey"];
        var awsSecretAccessKey = awsSection["SecretKey"];
        var serviceURL = s3Section["BaseUrl"]!;
        var region = s3Section["Region"]!;

        var config = new AmazonS3Config
        {
            ServiceURL = serviceURL,
            RegionEndpoint = RegionEndpoint.GetBySystemName(region),
            ForcePathStyle = true
        };

        return new AmazonS3Client(awsAccessKeyId, awsSecretAccessKey, config);
    }
}