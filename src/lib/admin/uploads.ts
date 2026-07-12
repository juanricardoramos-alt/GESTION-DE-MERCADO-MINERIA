import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Almacenamiento local de archivos subidos desde el panel admin, en
 * uploads/ (fuera de public: `next start` no sirve archivos agregados a
 * public tras el build). Los sirve el route handler /uploads/[...path],
 * que además aplica el paywall a los PDFs premium. Para producción
 * multi-instancia, reemplazar por un bucket (S3/GCS) con la misma firma.
 */

export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

const ALLOWED: Record<
  "pdf" | "image",
  { mime: ReadonlySet<string>; maxBytes: number; extFor: (type: string) => string }
> = {
  pdf: {
    mime: new Set(["application/pdf"]),
    maxBytes: 25 * 1024 * 1024,
    extFor: () => ".pdf",
  },
  image: {
    mime: new Set(["image/jpeg", "image/png", "image/webp"]),
    maxBytes: 5 * 1024 * 1024,
    extFor: (type) =>
      type === "image/png" ? ".png" : type === "image/webp" ? ".webp" : ".jpg",
  },
};

export class UploadError extends Error {}

/**
 * Persiste el archivo y devuelve su URL pública (/uploads/...).
 * El nombre se deriva de ids validados, nunca del nombre del archivo.
 */
export async function saveUpload(
  file: File,
  kind: "pdf" | "image",
  baseName: string,
): Promise<string> {
  const rules = ALLOWED[kind];
  if (!rules.mime.has(file.type)) throw new UploadError("invalid_type");
  if (file.size === 0 || file.size > rules.maxBytes) {
    throw new UploadError("invalid_size");
  }
  if (!/^[a-z0-9_-]+$/i.test(baseName)) throw new UploadError("invalid_name");

  const dir = path.join(UPLOADS_ROOT, kind === "pdf" ? "studies" : "images");
  await mkdir(dir, { recursive: true });

  const fileName = `${baseName}${rules.extFor(file.type)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), bytes);

  return `/uploads/${kind === "pdf" ? "studies" : "images"}/${fileName}`;
}

/** Borra un archivo subido previamente (ignora los que ya no existen). */
export async function deleteUpload(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/")) return;
  const relative = publicUrl.replace(/^\/uploads\//, "");
  if (relative.includes("..")) return;
  await unlink(path.join(UPLOADS_ROOT, relative)).catch(() => undefined);
}
