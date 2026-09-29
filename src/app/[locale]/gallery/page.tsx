import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireUser } from "@/lib/auth";
import { ComingSoon } from "@/components/ComingSoon";

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser(locale, "/gallery");
  const t = await getTranslations();
  return <ComingSoon title={t("gallery.title")} text={t("gallery.comingSoon")} back={t("create.back")} />;
}
