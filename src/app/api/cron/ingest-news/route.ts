import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { ingestNews } from "@/lib/news-ingest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Endpoint del cron de Vercel (cada 6 horas, ver vercel.json). Vercel envía
 * `Authorization: Bearer ${CRON_SECRET}` automáticamente cuando la variable
 * está configurada en el proyecto.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "cron_unconfigured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = await ingestNews(prisma);
  const added = results.reduce((sum, result) => sum + result.added, 0);
  return NextResponse.json({ ok: true, added, results });
}
