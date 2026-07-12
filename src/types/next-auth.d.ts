import type { Role, Tier } from "@prisma/client";
import type { DefaultSession } from "next-auth";
// Import explícito para que la declaración de abajo AUMENTE el módulo
// next-auth/jwt en vez de redeclararlo vacío.
import type {} from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      tier: Tier;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    tier?: Tier;
  }
}
