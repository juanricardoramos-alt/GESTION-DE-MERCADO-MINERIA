import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { newsletterSubscribeSchema } from "@/lib/validation";

/** Alta al boletín. Idempotente: re-suscribir el mismo correo no falla. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = newsletterSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { email, locale } = parsed.data;
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, locale },
    update: { locale },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
