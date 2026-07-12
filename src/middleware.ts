import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Aplica el middleware a la raíz y a todas las rutas localizadas
  matcher: ["/", "/(es|en)/:path*"],
};
