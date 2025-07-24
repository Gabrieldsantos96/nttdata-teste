namespace Ambev.DeveloperEvaluation.Shared.Helpers;
public static class CodeGenerator
{
    public static string GenerateCode<T>() where T : class
    {
        string entityPrefix = nameof(T)[0].ToString().ToUpper();

        string baseCode = $"{entityPrefix}{DateTime.Now.ToString("yyMMdd")}";

        long ticks = DateTime.Now.Ticks;
        string suffix = (ticks % 1000000).ToString("D6");

        return $"{baseCode}-{suffix}";
    }
}