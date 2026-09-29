import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ComingSoon } from "@/components/ComingSoon";

export default function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations();
  return <ComingSoon title={t("gallery.title")} text={t("gallery.comingSoon")} back={t("create.back")} />;
}
