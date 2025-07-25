export class ValidationMessages {
  public static readonly MustAccept: string =
    "É necessário aceitar as condições"
  public static readonly FieldRequired: string = "{field} é obrigatório(a)"
  public static readonly FieldValueInvalid: string = "{field} inválido(a)"
  public static readonly MaxChars: string =
    "Máximo de {1} caracter(es) permitido(s)"
  public static readonly MinChars: string =
    "Mínimo de {1} caracter(es) necessário(s)"
  public static readonly NeededChars: string = "{1} carater(es) necessário(s)"
  public static readonly PasswordsNoMatch: string = "As senhas não conferem"
  public static readonly DefaultAuthenticationError: string =
    "Usuário ou senha inválida"
  public static readonly UserLockedOut: string =
    "Usuário bloqueado. Tente novamente dentro de alguns minutos"
  public static readonly IsNotAllowed: string =
    "Usuário bloqueado. Tente novamente dentro de alguns minutos"
}
