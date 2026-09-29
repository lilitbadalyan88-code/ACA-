"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Каждый язык подписан на самом себе, без флагов.
const labels: Record<(typeof routing.locales)[number], string> = {
  hy: "Հայ",
  ru: "Рус",
  en: "Eng",
};

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className="flex items-center text-sm">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1 text-muted/60" aria-hidden>·</span>}
          <Link
            href={pathname}
            locale={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={`rounded-md px-1.5 py-2 transition-colors ${
              l === locale ? "font-semibold text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {labels[l]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
