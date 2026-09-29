import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Вызов из серверного компонента: cookie обновит proxy.
        }
      },
    },
  });
}

export type CurrentUser = { id: string; email: string | null };

// Текущий пользователь или null. Не падает, если Supabase ещё не настроен или недоступен.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // Страница всегда строится заново для каждого посетителя, даже пока Supabase не настроен.
  await connection();
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ? { id: data.user.id, email: data.user.email ?? null } : null;
  } catch {
    return null;
  }
}
