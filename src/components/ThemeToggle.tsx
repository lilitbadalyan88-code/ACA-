"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

const order = ["system", "light", "dark"] as const;

export function ThemeToggle() {
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Тема известна только в браузере — до этого показываем пустую кнопку.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme : "system") as (typeof order)[number];
  const next = order[(order.indexOf(current) + 1) % order.length];
  const label = {
    system: t("themeSystem"),
    light: t("themeLight"),
    dark: t("themeDark"),
  }[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`${t("theme")}: ${label}`}
      aria-label={`${t("theme")}: ${label}`}
      className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
    >
      {!mounted ? null : current === "light" ? (
        <SunIcon />
      ) : current === "dark" ? (
        <MoonIcon />
      ) : (
        <MonitorIcon />
      )}
    </button>
  );
}
