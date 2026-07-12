import type { Tier } from "@prisma/client";

/**
 * Abstracción de la capa de pagos. La app solo habla con esta interfaz;
 * Stripe es la primera implementación y Transbank/Flow pueden sumarse
 * implementándola sin tocar rutas ni UI (ver src/lib/payments/index.ts).
 */

/** Planes que se pueden comprar (FREE no pasa por la pasarela). */
export type PaidTier = Exclude<Tier, "FREE">;

export interface CheckoutInput {
  userId: string;
  email: string;
  tier: PaidTier;
  locale: "es" | "en";
  /** URLs absolutas de retorno. */
  successUrl: string;
  cancelUrl: string;
}

export interface PortalInput {
  userId: string;
  returnUrl: string;
}

export interface HostedRedirect {
  url: string;
}

/** La pasarela no tiene credenciales configuradas en el entorno. */
export class PaymentsNotConfiguredError extends Error {
  constructor(providerId: string) {
    super(`Payment provider "${providerId}" is not configured`);
    this.name = "PaymentsNotConfiguredError";
  }
}

export interface PaymentProvider {
  /** Identificador persistido en Subscription.provider. */
  readonly id: string;

  /** Inicia el flujo de pago hospedado para un plan pagado. */
  createCheckout(input: CheckoutInput): Promise<HostedRedirect>;

  /**
   * Portal de autogestión (cambiar medio de pago, cancelar, facturas).
   * Devuelve null si el usuario no tiene cliente en la pasarela.
   */
  createPortal(input: PortalInput): Promise<HostedRedirect | null>;

  /**
   * Procesa el webhook entrante: verifica la firma y sincroniza
   * Subscription/User.tier en la base. Devuelve la Response HTTP.
   */
  handleWebhook(request: Request): Promise<Response>;
}
