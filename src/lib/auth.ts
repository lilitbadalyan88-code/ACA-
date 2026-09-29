import "server-only";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/supabase/server";

// Закрытая страница: без входа отправляем на /login и потом возвращаем обратно.
export async function requireUser(locale: string, path: string) {
  const user = await getCurrentUser();
  if (!user) {
    return redirect({ href: { pathname: "/login", query: { next: `/${locale}${path}` } }, locale });
  }
  return user;
}
