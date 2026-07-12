import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payments";
import { PaymentsNotConfiguredError } from "@/lib/payments/provider";

const checkoutSchema = z.object({
  tier: z.enum(["PROFESIONAL", "CORPORATIVO"]),
  locale: z.enum(["es", "en"]).default("es"),
});

/** Inicia el checkout hospedado del plan elegido para el usuario logueado. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const { tier, locale } = parsed.data;

  try {
    const redirect = await getPaymentProvider().createCheckout({
      userId: session.user.id,
      email: session.user.email,
      tier,
      locale,
      successUrl: `${origin}/${locale}/cuenta?checkout=success`,
      cancelUrl: `${origin}/${locale}/membresia?checkout=cancelled`,
    });
    return NextResponse.json({ url: redirect.url });
  } catch (error) {
    if (error instanceof PaymentsNotConfiguredError) {
      return NextResponse.json(
        { error: "payments_unconfigured" },
        { status: 503 },
      );
    }
    throw error;
  }
}
