import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { removeFiles } from "@/lib/storage/remove-files";
import { limits } from "@config/limits";

// Раз в день (см. vercel.json) удаляет фото старше limits.retentionDays дней.
// Vercel сам добавляет заголовок Authorization: Bearer <CRON_SECRET>.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - limits.retentionDays * 24 * 60 * 60 * 1000).toISOString();
  const result: Record<string, number> = {};

  for (const [table, bucket] of [
    ["images", "generated"],
    ["uploads", "uploads"],
  ] as const) {
    const { data, error } = await admin.from(table).select("id, storage_path").lt("created_at", cutoff).limit(1000);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await removeFiles(admin, bucket, data.map((r) => r.storage_path));
    if (data.length) await admin.from(table).delete().in("id", data.map((r) => r.id));
    result[table] = data.length;
  }

  // Старые записи о генерациях (их фото уже удалены выше).
  await admin.from("generations").delete().lt("created_at", cutoff);

  return NextResponse.json({ ok: true, removed: result });
}
