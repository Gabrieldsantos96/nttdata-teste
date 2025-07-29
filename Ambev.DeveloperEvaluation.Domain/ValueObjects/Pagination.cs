namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;
public record PaginatedResponse<T>(List<T> Data, int TotalItems, int CurrentPage, int TotalPages);
public record GroupedPaginatedResponse<T>(Dictionary<string, IList<T>>? Data, int TotalItems, int CurrentPage, int TotalPages);
