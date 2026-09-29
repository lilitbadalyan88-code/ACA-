import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Удаляет файлы из хранилища пачками (API принимает до 1000 путей, берём по 100).
export async function removeFiles(admin: SupabaseClient, bucket: string, paths: string[]) {
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await admin.storage.from(bucket).remove(paths.slice(i, i + 100));
    if (error) throw error;
  }
}
