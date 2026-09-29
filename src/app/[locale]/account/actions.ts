"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { removeFiles } from "@/lib/storage/remove-files";

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}

// Удаляет все фото пользователя из хранилища, затем сам аккаунт.
// Записи в таблицах удаляются автоматически (on delete cascade).
export async function deleteAccount(locale: string): Promise<{ ok: false } | never> {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  try {
    const admin = createAdminClient();
    for (const [table, bucket] of [
      ["uploads", "uploads"],
      ["images", "generated"],
    ] as const) {
      const { data, error } = await admin.from(table).select("storage_path").eq("user_id", user.id);
      if (error) throw error;
      await removeFiles(admin, bucket, data.map((r) => r.storage_path));
    }
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
  } catch (e) {
    console.error("deleteAccount failed", e);
    return { ok: false };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
