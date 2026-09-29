import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { themes } from "@config/themes";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ThemeCard } from "@/components/ThemeCard";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");
  const tt = useTranslations("themes");

  const steps = ["upload", "theme", "save"] as const;

  return (
    <>
      {/* Первый экран */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:pb-32 lg:pt-28">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-[55ch] text-lg text-muted">{t("hero.subtitle")}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/create"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-8 font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              {t("hero.cta")}
            </Link>
            <span className="text-sm text-muted">{t("hero.note")}</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[480px]">
          <BeforeAfter
            before="/examples/before-1.svg"
            after="/examples/after-1.svg"
            beforeLabel={t("beforeAfter.before")}
            afterLabel={t("beforeAfter.after")}
            sliderLabel={t("beforeAfter.sliderLabel")}
          />
          <p className="mt-3 text-center text-xs text-muted">{t("beforeAfter.placeholder")}</p>
        </div>
      </section>

      {/* Как это работает */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-32">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("steps.title")}</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((s, i) => (
              <li key={s}>
                <span className="text-sm font-medium text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{t(`steps.${s}.title`)}</h3>
                <p className="mt-2 max-w-[40ch] text-muted">{t(`steps.${s}.text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Темы */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-32">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("themes.title")}</h2>
          <p className="mt-3 text-muted">{t("themes.subtitle")}</p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <li key={theme.id}>
                <ThemeCard
                  image={theme.image}
                  title={tt(`${theme.id}.title`)}
                  description={tt(`${theme.id}.description`)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Финальный призыв */}
      <section className="border-t border-subtle">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-32">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("finalCta.title")}</h2>
          <Link
            href="/create"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-8 font-medium text-accent-fg transition-opacity hover:opacity-90 sm:w-auto"
          >
            {t("finalCta.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
