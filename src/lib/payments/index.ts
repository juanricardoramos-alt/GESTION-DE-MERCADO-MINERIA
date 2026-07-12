import type { PaymentProvider } from "@/lib/payments/provider";
import { stripeProvider } from "@/lib/payments/stripe";

/**
 * Registro de pasarelas. Para sumar Transbank o Flow: implementar
 * PaymentProvider, agregarlo aquí y seleccionar con PAYMENT_PROVIDER.
 */
const PROVIDERS: Record<string, PaymentProvider> = {
  [stripeProvider.id]: stripeProvider,
};

export function getPaymentProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER ?? "stripe";
  const provider = PROVIDERS[id];
  if (!provider) {
    throw new Error(`Unknown payment provider "${id}"`);
  }
  return provider;
}
