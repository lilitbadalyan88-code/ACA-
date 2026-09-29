// Переводит код ошибки Supabase в ключ из messages/*.json -> auth.errors.
const map: Record<string, string> = {
  invalid_credentials: "invalid_credentials",
  email_not_confirmed: "email_not_confirmed",
  user_already_exists: "user_already_exists",
  email_exists: "user_already_exists",
  weak_password: "weak_password",
  over_email_send_rate_limit: "rate_limit",
  over_request_rate_limit: "rate_limit",
  email_address_invalid: "email_invalid",
  validation_failed: "email_invalid",
  same_password: "same_password",
};

export function authErrorKey(error: unknown): string {
  if (error && typeof error === "object") {
    const code = "code" in error ? String(error.code) : "";
    if (map[code]) return map[code];
    const name = "name" in error ? String(error.name) : "";
    if (name === "AuthRetryableFetchError" || error instanceof TypeError) return "network";
  }
  return "generic";
}
