import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hy", "ru", "en"],
  // Используется, только если язык браузера не hy/ru/en.
  defaultLocale: "ru",
  // Язык определяется по браузеру и запоминается в cookie.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
