import { redirect } from "next/navigation";

import { getViewer, type Viewer } from "@/lib/access";

/**
 * Guardia de administración (defensa en profundidad): el middleware ya corta
 * /admin por rol del JWT, pero cada página y server action re-verifica el
 * rol FRESCO desde la base antes de tocar datos.
 */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "ADMIN") {
    redirect("/");
  }
  return viewer;
}

/** Variante para server actions: lanza en vez de redirigir. */
export async function assertAdmin(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "ADMIN") {
    throw new Error("forbidden");
  }
  return viewer;
}
