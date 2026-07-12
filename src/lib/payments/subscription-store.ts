import type { SubscriptionStatus, Tier } from "@prisma/client";

import { prisma } from "@/lib/db";

/**
 * Persistencia del estado de suscripción, común a todas las pasarelas:
 * cada webhook termina llamando a estas funciones. `User.tier` es el tier
 * EFECTIVO que consume el paywall, por eso se recalcula aquí y en ningún
 * otro lugar.
 */

/** PAST_DUE conserva el acceso (periodo de gracia); cancelado vuelve a FREE. */
function effectiveTier(status: SubscriptionStatus, tier: Tier): Tier {
  return status === "ACTIVE" || status === "PAST_DUE" ? tier : "FREE";
}

export interface SubscriptionState {
  userId: string;
  provider: string;
  tier: Tier;
  status: SubscriptionStatus;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/** Alta, renovación, cambio de plan, cancelación: un solo camino de escritura. */
export async function applySubscriptionState(
  state: SubscriptionState,
): Promise<void> {
  const data = {
    tier: state.tier,
    status: state.status,
    provider: state.provider,
    providerCustomerId: state.providerCustomerId,
    providerSubscriptionId: state.providerSubscriptionId,
    currentPeriodEnd: state.currentPeriodEnd,
    cancelAtPeriodEnd: state.cancelAtPeriodEnd,
  };
  await prisma.$transaction([
    prisma.subscription.upsert({
      where: { userId: state.userId },
      create: { userId: state.userId, ...data },
      update: data,
    }),
    prisma.user.update({
      where: { id: state.userId },
      data: { tier: effectiveTier(state.status, state.tier) },
    }),
  ]);
}

/** Busca el dueño de una suscripción de pasarela ya registrada. */
export async function findUserIdBySubscription(
  provider: string,
  providerSubscriptionId: string,
): Promise<string | null> {
  const row = await prisma.subscription.findFirst({
    where: { provider, providerSubscriptionId },
    select: { userId: true },
  });
  return row?.userId ?? null;
}

export async function getSubscriptionByUser(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}
