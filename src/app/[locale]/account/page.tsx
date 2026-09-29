import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/lib/auth";
import { DeleteAccount, SignOutButton } from "@/components/AccountActions";

export default async function AccountPage({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale, "/account");
  const t = await getTranslations("account");

  return (
    <section className="mx-auto max-w-[640px] px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>

      <div className="mt-10">
        <p className="text-sm text-muted">{t("signedInAs")}</p>
        <p className="mt-1 break-all text-lg font-medium">{user.email}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <SignOutButton locale={locale} />
        <Link href="/account/password" className="text-center text-accent underline-offset-4 hover:underline">
          {t("changePassword")}
        </Link>
      </div>

      <div className="mt-24 border-t border-subtle pt-10">
        <h2 className="text-xl font-semibold">{t("deleteTitle")}</h2>
        <p className="mt-2 max-w-[55ch] text-muted">{t("deleteText")}</p>
        <div className="mt-6">
          <DeleteAccount locale={locale} />
        </div>
      </div>
    </section>
  );
}
