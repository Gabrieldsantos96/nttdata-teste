namespace Ambev.DeveloperEvaluation.Shared.Validations;

public class ValidationHelper
{
    public static string RequiredErrorMessage(string fieldName)
    {
        return $"o campo '{fieldName}' é obrigatório";
    }

    public static string MaxLengthErrorMessage(string fieldName, int maxLength)
    {
        return $"'{fieldName}' não pode ter mais que {maxLength} caracteres";
    }

    public static string MinLengthErrorMessage(string fieldName, int minLength)
    {
        return $"'{fieldName}' deve ter pelo menos {minLength} caracteres";
    }

    public static string ExactLengthErrorMessage(string fieldName, int length)
    {
        return $"'{fieldName}' deve ter exatamente {length} caracteres";
    }

    public static string InvalidFormatErrorMessage(string fieldName)
    {
        return $"'{fieldName}' está em um formato inválido";
    }

    public static string InvalidErrorMessage(string fieldName)
    {
        return $"'{fieldName}' está inválido";
    }
}