"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { HomeIcon, ImagesIcon, SparkleIcon } from "./icons";

// Нижняя панель как в приложении — только на телефоне.
export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const items = [
    { href: "/", label: t("home"), Icon: HomeIcon },
    { href: "/create", label: t("create"), Icon: SparkleIcon },
    { href: "/gallery", label: t("gallery"), Icon: ImagesIcon },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-subtle bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      <ul className="grid grid-cols-3">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon />
                <span className="max-w-full truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
