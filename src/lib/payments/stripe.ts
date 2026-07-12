import type { SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

import {
  PaymentsNotConfiguredError,
  type CheckoutInput,
  type HostedRedirect,
  type PaidTier,
  type PaymentProvider,
  type PortalInput,
} from "@/lib/payments/provider";
import {
  applySubscriptionState,
  findUserIdBySubscription,
  getSubscriptionByUser,
} from "@/lib/payments/subscription-store";

/**
 * Implementación Stripe de PaymentProvider (Checkout hospedado + Billing
 * Portal + webhooks). Toda credencial se lee en runtime para que el build
 * no dependa de tener Stripe configurado.
 */

const PROVIDER_ID = "stripe";

function getClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new PaymentsNotConfiguredError(PROVIDER_ID);
  return new Stripe(key);
}

/** price de Stripe por plan pagado (creados en el dashboard de Stripe). */
function priceIdFor(tier: PaidTier): string {
  const priceId =
    tier === "PROFESIONAL"
      ? process.env.STRIPE_PRICE_PROFESIONAL
      : process.env.STRIPE_PRICE_CORPORATIVO;
  if (!priceId) throw new PaymentsNotConfiguredError(PROVIDER_ID);
  return priceId;
}

function tierFromPriceId(priceId: string | undefined): PaidTier | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PROFESIONAL) return "PROFESIONAL";
  if (priceId === process.env.STRIPE_PRICE_CORPORATIVO) return "CORPORATIVO";
  return null;
}

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "incomplete":
      return "INCOMPLETE";
    default:
      // canceled | incomplete_expired | paused
      return "CANCELED";
  }
}

/** Desde API Basil el periodo vive en los items de la suscripción. */
function periodEnd(subscription: Stripe.Subscription): Date | null {
  const end = subscription.items.data[0]?.current_period_end;
  return typeof end === "number" ? new Date(end * 1000) : null;
}

function metadataTier(value: string | undefined): PaidTier | null {
  return value === "PROFESIONAL" || value === "CORPORATIVO" ? value : null;
}

/** Sincroniza la base con el estado actual de una suscripción de Stripe. */
async function syncSubscription(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId =
    metadataUserId(subscription.metadata) ??
    (await findUserIdBySubscription(PROVIDER_ID, subscription.id));
  if (!userId) {
    // Suscripción ajena a esta app (p. ej. creada a mano): se ignora.
    return;
  }

  const tier =
    metadataTier(subscription.metadata.tier) ??
    tierFromPriceId(subscription.items.data[0]?.price.id);
  if (!tier) return;

  await applySubscriptionState({
    userId,
    provider: PROVIDER_ID,
    tier,
    status: mapStatus(subscription.status),
    providerCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    providerSubscriptionId: subscription.id,
    currentPeriodEnd: periodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

function metadataUserId(
  metadata: Stripe.Metadata | null | undefined,
): string | null {
  const value = metadata?.userId;
  return value && value.length > 0 ? value : null;
}

async function retrieveAndSync(
  stripe: Stripe,
  subscriptionId: string,
): Promise<void> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await syncSubscription(subscription);
}

/** id de suscripción referenciado por una invoice (renovaciones/fallos). */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details;
  if (!details) return null;
  return typeof details.subscription === "string"
    ? details.subscription
    : (details.subscription?.id ?? null);
}

export const stripeProvider: PaymentProvider = {
  id: PROVIDER_ID,

  async createCheckout(input: CheckoutInput): Promise<HostedRedirect> {
    const stripe = getClient();

    // Reutiliza el cliente de Stripe si el usuario ya tuvo suscripción.
    const existing = await getSubscriptionByUser(input.userId);
    const customerId =
      existing?.provider === PROVIDER_ID
        ? (existing.providerCustomerId ?? undefined)
        : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceIdFor(input.tier), quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      locale: input.locale,
      client_reference_id: input.userId,
      ...(customerId
        ? { customer: customerId }
        : { customer_email: input.email }),
      subscription_data: {
        metadata: { userId: input.userId, tier: input.tier },
      },
      metadata: { userId: input.userId, tier: input.tier },
    });

    if (!session.url) {
      throw new Error("Stripe checkout session has no URL");
    }
    return { url: session.url };
  },

  async createPortal(input: PortalInput): Promise<HostedRedirect | null> {
    const stripe = getClient();

    const subscription = await getSubscriptionByUser(input.userId);
    if (
      subscription?.provider !== PROVIDER_ID ||
      !subscription.providerCustomerId
    ) {
      return null;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.providerCustomerId,
      return_url: input.returnUrl,
    });
    return { url: session.url };
  },

  async handleWebhook(request: Request): Promise<Response> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return new Response("webhook not configured", { status: 503 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("missing signature", { status: 400 });
    }

    let stripe: Stripe;
    try {
      stripe = getClient();
    } catch {
      return new Response("stripe not configured", { status: 503 });
    }
    const payload = await request.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch {
      return new Response("invalid signature", { status: 400 });
    }

    switch (event.type) {
      // Alta: el checkout terminó y la suscripción quedó creada.
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (subscriptionId) await retrieveAndSync(stripe, subscriptionId);
        break;
      }

      // Cambios de plan, cancelación programada, reactivación, borrado.
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object);
        break;
      }

      // Renovación cobrada y pago fallido: se re-lee el estado canónico.
      case "invoice.paid":
      case "invoice.payment_failed": {
        const subscriptionId = invoiceSubscriptionId(event.data.object);
        if (subscriptionId) await retrieveAndSync(stripe, subscriptionId);
        break;
      }

      default:
        break;
    }

    return Response.json({ received: true });
  },
};
