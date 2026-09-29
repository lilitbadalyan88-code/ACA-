import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { refreshSession } from "./lib/supabase/proxy";

const intl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Сначала язык (перенаправление на /hy, /ru, /en), потом продление входа.
  const response = intl(request);
  return refreshSession(request, response);
}

export const config = {
  // Все страницы, кроме служебных файлов, API и статики.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
