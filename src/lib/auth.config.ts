import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Configuración de Auth.js compartida con el middleware (runtime Edge):
 * NADA de este módulo puede importar Prisma ni bcrypt. El provider de
 * credenciales y el callback jwt que consulta la base viven en auth.ts.
 */

/** Google se habilita solo si hay credenciales configuradas. */
export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: googleEnabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  callbacks: {
    // Mapea los claims del token a la sesión (corre también en Edge,
    // donde el token ya viene firmado con role/tier desde el sign-in).
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role;
      if (token.tier) session.user.tier = token.tier;
      return session;
    },
  },
} satisfies NextAuthConfig;
