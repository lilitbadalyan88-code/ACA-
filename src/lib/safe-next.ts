// Разрешаем возврат только на страницы этого же сайта (защита от подмены ссылки).
export function safeNext(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
