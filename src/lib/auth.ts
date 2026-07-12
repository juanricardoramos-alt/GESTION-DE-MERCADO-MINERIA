import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";
import { credentialsSchema } from "@/lib/validation";

/**
 * Instancia completa de Auth.js (runtime Node): credenciales con bcrypt,
 * adapter de Prisma para cuentas OAuth y claims role/tier en el JWT.
 * El middleware usa la variante liviana construida desde auth.config.ts.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        // Cuentas solo-OAuth no tienen hash: no pueden entrar por credenciales.
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * role/tier se hornean en el token al iniciar sesión y se refrescan
     * con `useSession().update()` (p. ej. tras un cambio de plan). Las
     * decisiones de acceso críticas siempre re-consultan la base
     * (ver src/lib/access.ts); el claim es solo para UI y middleware.
     */
    async jwt({ token, user, trigger }) {
      const userId = user?.id ?? (trigger === "update" ? token.sub : null);
      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, tier: true },
        });
        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
          token.tier = dbUser.tier;
        }
      }
      return token;
    },
  },
});
