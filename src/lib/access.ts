import type { Tier } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Autorización server-side. A diferencia del claim `tier` del JWT (que puede
 * quedar un paso atrás tras un cambio de plan), estas funciones re-consultan
 * la base, por lo que son la fuente de verdad para decidir qué contenido
 * sale del servidor.
 */

const TIER_RANK: Record<Tier, number> = {
  FREE: 0,
  PROFESIONAL: 1,
  CORPORATIVO: 2,
};

export function tierSatisfies(tier: Tier, required: Tier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[required];
}

export interface Viewer {
  id: string;
  tier: Tier;
  role: "USER" | "ADMIN";
}

/** Usuario actual con tier fresco desde la base; null si no hay sesión. */
export async function getViewer(): Promise<Viewer | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, tier: true, role: true },
  });
  return user;
}

/** ¿El usuario actual alcanza el tier requerido? (anónimo = no; ADMIN = sí). */
export async function viewerHasTier(required: Tier): Promise<boolean> {
  const viewer = await getViewer();
  if (!viewer) return false;
  return viewer.role === "ADMIN" || tierSatisfies(viewer.tier, required);
}
