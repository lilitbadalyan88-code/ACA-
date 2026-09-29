import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Все страницы, кроме служебных файлов, API и статики.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
