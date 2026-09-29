import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireUser } from "@/lib/auth";
import { NewPasswordForm } from "@/components/NewPasswordForm";

// Сюда ведёт ссылка из письма «Сброс пароля» (и кнопка «Сменить пароль»).
export default async function NewPasswordPage({ params }: PageProps<"/[locale]/account/password">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser(locale, "/account/password");
  const t = await getTranslations("auth");

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[400px]">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">{t("newPasswordTitle")}</h1>
        <NewPasswordForm />
      </div>
    </section>
  );
}
