import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireUser } from "@/lib/auth";
import { ComingSoon } from "@/components/ComingSoon";

export default async function CreatePage({ params }: PageProps<"/[locale]/create">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser(locale, "/create");
  const t = await getTranslations("create");
  return <ComingSoon title={t("title")} text={t("comingSoon")} back={t("back")} />;
}
