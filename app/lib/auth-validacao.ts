import type { AuthError } from "@supabase/supabase-js";

export function senhaValida(senha: string): boolean {
  return senha.length >= 8;
}

export function traduzirErroAuth(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "E-mail ou senha incorretos.";
    case "user_already_exists":
      return "Já existe uma conta com esse e-mail.";
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de entrar — verifique sua caixa de entrada.";
    case "over_email_send_rate_limit":
      return "Muitas tentativas seguidas. Aguarde um pouco antes de tentar de novo.";
    case "weak_password":
      return "Senha muito fraca — use pelo menos 8 caracteres.";
    case "email_address_invalid":
      return "Esse e-mail não é aceito. Tente outro endereço.";
    default:
      return error.message;
  }
}
