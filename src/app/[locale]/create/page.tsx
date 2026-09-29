import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ComingSoon } from "@/components/ComingSoon";

export default function CreatePage({ params }: PageProps<"/[locale]/create">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("create");
  return <ComingSoon title={t("title")} text={t("comingSoon")} back={t("back")} />;
}
