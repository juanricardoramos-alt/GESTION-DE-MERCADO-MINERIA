import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { viewerHasTier } from "@/lib/access";
import { UPLOADS_ROOT } from "@/lib/admin/uploads";
import { PREMIUM_CONTENT_TIER } from "@/lib/constants";
import { prisma } from "@/lib/db";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Sirve los archivos subidos desde el panel admin. Los PDFs de estudios
 * premium exigen el tier requerido: adivinar la URL no salta el paywall
 * (mismo criterio server-side que en las páginas).
 */
export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } },
) {
  const relative = params.path.join("/");
  if (!/^[a-z0-9/_.-]+$/i.test(relative) || relative.includes("..")) {
    return new NextResponse("not found", { status: 404 });
  }

  const absolute = path.join(UPLOADS_ROOT, relative);
  if (!absolute.startsWith(UPLOADS_ROOT + path.sep)) {
    return new NextResponse("not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(absolute).toLowerCase()];
  if (!contentType) {
    return new NextResponse("not found", { status: 404 });
  }

  if (relative.startsWith("studies/")) {
    const study = await prisma.study.findFirst({
      where: { fileUrl: `/uploads/${relative}` },
      select: { premium: true },
    });
    if (!study) return new NextResponse("not found", { status: 404 });
    if (study.premium && !(await viewerHasTier(PREMIUM_CONTENT_TIER))) {
      return new NextResponse("forbidden", { status: 403 });
    }
  }

  try {
    const data = await readFile(absolute);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
