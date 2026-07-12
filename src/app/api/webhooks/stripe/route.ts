import { stripeProvider } from "@/lib/payments/stripe";

/**
 * Webhook de Stripe: alta, renovación, cancelación y pagos fallidos.
 * La verificación de firma y la sincronización viven en el provider.
 */
export async function POST(request: Request) {
  return stripeProvider.handleWebhook(request);
}
