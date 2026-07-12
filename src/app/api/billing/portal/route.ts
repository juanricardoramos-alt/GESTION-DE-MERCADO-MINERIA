import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payments";
import { PaymentsNotConfiguredError } from "@/lib/payments/provider";

const portalSchema = z.object({
  locale: z.enum(["es", "en"]).default("es"),
});

/** Abre el portal de autogestión de la suscripción del usuario logueado. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = portalSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  try {
    const redirect = await getPaymentProvider().createPortal({
      userId: session.user.id,
      returnUrl: `${origin}/${parsed.data.locale}/cuenta`,
    });
    if (!redirect) {
      return NextResponse.json({ error: "no_subscription" }, { status: 404 });
    }
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
