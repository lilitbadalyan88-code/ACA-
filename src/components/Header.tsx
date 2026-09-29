import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { UserIcon } from "./icons";

export function Header() {
  const t = useTranslations("nav");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-subtle/70 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {site.name}
          </Link>

          <nav className="ml-6 hidden items-center gap-6 text-sm text-muted sm:flex">
            <Link href="/create" className="transition-colors hover:text-fg">
              {t("create")}
            </Link>
            <Link href="/gallery" className="transition-colors hover:text-fg">
              {t("gallery")}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href="/login"
              aria-label={t("login")}
              className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg sm:hidden"
            >
              <UserIcon />
            </Link>
            <Link
              href="/login"
              className="hidden rounded-full border border-subtle px-4 py-2 text-sm transition-colors hover:border-fg/30 sm:inline-block"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </header>
      <MobileNav />
    </>
  );
}
