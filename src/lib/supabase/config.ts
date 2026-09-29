// Адрес проекта и публичный ключ Supabase. Публичный ключ можно показывать браузеру:
// доступ к данным всё равно ограничен правилами базы (RLS).
// В новых проектах ключ называется «publishable», в старых — «anon»: подходят оба.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
