namespace Ambev.DeveloperEvaluation.Shared.Validations;

public static class ValidationMessages
{
    public const string MustAccept = "É necessário aceitar as condições";
    public const string FieldRequired = "{field} Requerido";
    public const string FieldValueInvalid = "{field} Inválido";
    public const string MaxChars = "Máximo de {1} caracter(es) permitido(s)";
    public const string MinChars = "Mínimo de {1} caracter(es) necessário(s)";
    public const string NeededChars = "{1} carater(es) necessário(s)";
    public const string PasswordsNoMatch = "As senhas não conferem";
    public const string InvalidCaptcha = "Captcha incorreto";
    public const string NotValidableCaptcha = "Captcha não validável";
    public const string InvalidPhone = "O telefone incluindo DDD deve ter 10 números";
    public const string InvalidMobile = "O celular incluindo DDD deve ter 11 números";
    public const string DefaultAuthenticationError = "Usuário ou senha inválida";
    public const string UserLockedOut = "Usuário bloqueado. Tente novamente dentro de alguns minutos";
    public const string IsNotAllowed = "Usuário bloqueado. Tente novamente dentro de alguns minutos";
}
