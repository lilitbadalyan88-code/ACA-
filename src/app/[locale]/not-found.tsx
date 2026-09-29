import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
      <Link href="/" className="mt-8 inline-block text-accent underline-offset-4 hover:underline">
        {t("back")}
      </Link>
    </section>
  );
}
