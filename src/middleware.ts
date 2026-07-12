import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth.config";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Instancia liviana para Edge: solo decodifica el JWT (sin Prisma/bcrypt).
const { auth } = NextAuth(authConfig);

/** Rutas que exigen sesión iniciada (sin importar el plan). */
const AUTH_PREFIXES = ["/cuenta"];
/** Rutas premium: exigen plan PROFESIONAL o CORPORATIVO. */
const PREMIUM_PREFIXES = ["/analisis"];
/** Rutas de administración: exigen rol ADMIN. */
const ADMIN_PREFIXES = ["/admin"];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Separa el locale del path lógico (/es/analisis → /analisis).
  const localeMatch = pathname.match(/^\/(es|en)(?=\/|$)/);
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const path = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";

  const user = request.auth?.user;
  const isProtected =
    matches(path, AUTH_PREFIXES) ||
    matches(path, PREMIUM_PREFIXES) ||
    matches(path, ADMIN_PREFIXES);

  if (isProtected && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matches(path, ADMIN_PREFIXES) && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // El middleware corta el paso con el tier del JWT (puede ir un paso atrás
  // tras un cambio de plan); la autorización fina re-consulta la base en el
  // Server Component (src/lib/access.ts).
  if (matches(path, PREMIUM_PREFIXES) && user?.tier === "FREE") {
    return NextResponse.redirect(new URL(`/${locale}/membresia`, request.url));
  }

  return intlMiddleware(request);
});

export const config = {
  // Raíz y rutas localizadas; /api queda fuera a propósito.
  matcher: ["/", "/(es|en)/:path*"],
};
