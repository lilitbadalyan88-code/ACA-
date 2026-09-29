import { useTranslations } from "next-intl";
import { site } from "@config/site";

export function Footer() {
  const t = useTranslations("footer");
  return (
    // Нижний отступ на телефоне — чтобы подвал не прятался под нижней панелью.
    <footer className="border-t border-subtle pb-24 sm:pb-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span className="max-w-[65ch]">{t("privacy")}</span>
      </div>
    </footer>
  );
}
