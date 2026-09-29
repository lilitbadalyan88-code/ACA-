# Lumina — AI фото генератор и редактор

Загружаете свои фото, выбираете тему, и AI создаёт новые снимки в этом стиле.
Языки: армянский, русский, английский. Работает на телефоне и устанавливается как приложение (PWA).

## Что уже готово

- Главная страница: блок «до/после» с ползунком, «Как это работает», карточки тем, кнопка «Начать».
- Переключатель языка `Հայ · Рус · Eng`: язык определяется по браузеру и запоминается.
- Светлая, тёмная и системная тема (кнопка в шапке).
- Мобильная версия: нижняя панель навигации, крупные кнопки под палец.
- PWA: иконка, манифест, офлайн-страница.
- Аккаунты: вход по email и через Google (см. «Этап 2» ниже).
- Разделы «Создать» и «Мои фото» пока заглушки.

Картинки пока временные, нарисованные. Настоящие бесплатные фото будет добавлять еженедельный агент (см. ниже).

## Где что лежит

| Что | Где |
|---|---|
| Тексты интерфейса | `messages/hy.json`, `messages/ru.json`, `messages/en.json` |
| Темы генерации | `config/themes.ts` |
| Лимиты (размер фото, генерации в день) | `config/limits.ts` |
| Название сайта | `config/site.ts` |
| Цвета | `src/app/globals.css` (начало файла) |
| Страницы | `src/app/[locale]/` |
| Бесплатные фото и их лицензии | `public/library/`, `public/library/manifest.json` |

## Как проверить через Vercel (без установки чего-либо)

1. Зайдите на https://vercel.com и нажмите **Sign Up → Continue with GitHub**.
2. Нажмите **Add New… → Project**, найдите репозиторий `ACA-` и нажмите **Import**.
3. Ничего не меняйте в настройках и нажмите **Deploy**. Через 1–2 минуты появится ссылка на сайт.
4. После этого каждое изменение в GitHub автоматически создаёт новую версию.
   Ссылку на неё видно во вкладке **Deployments**.

Что проверить:
- переключить языки и тему, закрыть и снова открыть сайт: выбор должен сохраниться;
- открыть сайт на телефоне, подвигать ползунок «до/после»;
- установить как приложение: на iPhone в Safari **Поделиться → На экран «Домой»**,
  на Android в Chrome **⋮ → Установить приложение**.

## Как запустить на своём компьютере (по желанию)

1. Установите Node.js 20 или новее: https://nodejs.org (кнопка LTS).
2. В папке проекта выполните:
   ```bash
   npm install
   npm run dev
   ```
3. Откройте http://localhost:3000

## Еженедельный агент бесплатных фото

Каждый понедельник агент запускает `scripts/fetch-free-photos.mjs`: скачивает фото с лицензиями
CC0 и Public Domain через Openverse, проверяет их и отправляет в ветку `claude/weekly-free-photos`.
Автор, лицензия и ссылка на источник каждого фото записываются в `public/library/manifest.json`.

## Этап 2: аккаунты (вход по email и через Google)

Что сделано: регистрация, вход, сброс пароля, вход через Google, страница «Аккаунт»
(выход, смена пароля, удаление аккаунта со всеми фото). Страницы «Создать» и «Мои фото»
открываются только после входа. Раз в день сервер удаляет фото старше 30 дней.

Настройка делается один раз.

### Шаг 1. Создать таблицы в Supabase

1. Откройте в GitHub файл `supabase/migrations/0001_init.sql`, нажмите **Raw** и скопируйте весь текст.
2. В Supabase: слева **SQL Editor → New query**, вставьте текст и нажмите **Run**.
3. Должно появиться `Success. No rows returned`.

### Шаг 2. Вписать ключи в Vercel

1. В Supabase нажмите кнопку **Connect** вверху (или **Project Settings → API Keys**) и найдите:
   - **Project URL** (вида `https://abcd.supabase.co`);
   - **Publishable key** (`sb_publishable_…`; в старых проектах он называется `anon public`);
   - **Secret key** (`sb_secret_…`, нажмите **Reveal**; в старых проектах `service_role`).
2. В Vercel: ваш проект → **Settings → Environment Variables**. Добавьте по одной:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key |
   | `SUPABASE_SECRET_KEY` | Secret key |
   | `CRON_SECRET` | любые 40+ случайных букв и цифр |

3. **Deployments** → у верхней строки **⋯ → Redeploy**. Без этого ключи не подхватятся.

Secret key никому не показывайте и не присылайте в чат: он даёт полный доступ к базе.

### Шаг 3. Разрешить адреса сайта в Supabase

Supabase → **Authentication → URL Configuration**:
- **Site URL:** адрес вашего сайта, например `https://aca-xxxx.vercel.app`;
- **Redirect URLs → Add URL:** `https://aca-xxxx.vercel.app/**` и `http://localhost:3000/**`.

### Шаг 4. Вход через Google

1. Откройте https://console.cloud.google.com и создайте проект `Lumina` (выпадающий список проектов вверху → **New project**).
2. Меню → **APIs & Services → OAuth consent screen** → **Get started**:
   App name `Lumina`, ваш email, Audience **External**, снова ваш email → **Create**.
3. **Clients → Create client** → тип **Web application**:
   - **Authorized JavaScript origins:** `https://aca-xxxx.vercel.app`;
   - **Authorized redirect URIs:** адрес из Supabase → **Authentication → Sign In / Providers → Google → Callback URL**
     (вида `https://abcd.supabase.co/auth/v1/callback`).
   Нажмите **Create** и скопируйте **Client ID** и **Client secret**.
4. Supabase → **Authentication → Sign In / Providers → Google**: включите, вставьте Client ID и Client secret → **Save**.
5. Google → **Audience**: пока приложение в режиме *Testing*, войти могут только люди из списка **Test users**.
   Добавьте туда почты знакомых или нажмите **Publish app**.

### Шаг 5. Проверить

- Зарегистрируйтесь по email: придёт письмо, ссылка из него должна открыть сайт уже с входом.
- Выйдите и войдите через Google.
- Откройте «Мои фото» без входа: сайт должен попросить войти.
- «Забыли пароль?»: придёт письмо со ссылкой на страницу нового пароля.

Встроенная почта Supabase отправляет только несколько писем в час. Для вас и знакомых этого хватит,
позже можно подключить свой почтовый сервис.

## Ключи и сервисы

Все ключи хранятся только на сервере: в файле `.env.local` на компьютере
и в **Vercel → Project → Settings → Environment Variables** для сайта в интернете.
Шаблон лежит в `.env.example`.

- **Google Gemini** (этап 4): генерация фото. Ключ берётся в Google AI Studio.
  До подключения работает бесплатный тестовый режим `AI_PROVIDER=mock`.
