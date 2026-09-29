import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { Notice } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";

export default async function LoginPage({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const query = await searchParams;
  const next = safeNext(typeof query.next === "string" ? query.next : null, `/${locale}/create`);

  // Уже вошли — сразу туда, куда шли.
  if (await getCurrentUser()) redirect(next);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      {isSupabaseConfigured ? (
        <AuthForm next={next} locale={locale} initialError={query.error === "callback" ? "callback" : undefined} />
      ) : (
        <div className="mx-auto max-w-[400px]">
          <h1 className="mb-8 text-3xl font-semibold tracking-tight">{t("signInTitle")}</h1>
          <Notice>{t("notConfigured")}</Notice>
        </div>
      )}
    </section>
  );
}
