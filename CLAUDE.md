@AGENTS.md

# Проект Lumina — AI фото генератор и редактор

- Next.js 16 (App Router, `src/proxy.ts` вместо middleware), TypeScript, Tailwind CSS 4.
- Языки: `hy`, `ru`, `en` (next-intl). Никакого текста прямо в коде — только `messages/*.json`, все три файла с одинаковыми ключами.
- Армянский: шрифт Noto Sans Armenian идёт после Inter; без `uppercase` для армянского; конец предложения `։`.
- Темы генерации — `config/themes.ts`, лимиты — `config/limits.ts`, название — `config/site.ts`.
- Дизайн: минимализм, отступы кратны 8px, один акцентный цвет (`--accent` в `src/app/globals.css`), светлая и тёмная тема.
- API-ключи только на сервере (`.env.local`, без `NEXT_PUBLIC_`).
- Библиотека бесплатных фото: `public/library/` + `manifest.json`, пополняется скриптом `scripts/fetch-free-photos.mjs` (только CC0 / Public Domain).
- Проверки перед коммитом: `npm run lint`, `npm run typecheck`, `npm run build`.
