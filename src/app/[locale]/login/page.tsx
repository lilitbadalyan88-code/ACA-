import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ComingSoon } from "@/components/ComingSoon";

export default function LoginPage({ params }: PageProps<"/[locale]/login">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations();
  return <ComingSoon title={t("login.title")} text={t("login.comingSoon")} back={t("create.back")} />;
}
