import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { contactLeadSchema } from "@/lib/validation";

/** Guarda un lead comercial del formulario de contacto de la portada. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { name, company, email, personRut, companyRut, phone, topics, locale } =
    parsed.data;

  await prisma.contactLead.create({
    data: {
      name,
      company,
      email,
      personRut: personRut ?? null,
      companyRut: companyRut ?? null,
      phone: phone ?? null,
      topics: [...topics],
      locale,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
