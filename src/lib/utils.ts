import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind resolviendo conflictos (convención shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Iniciales para avatares (máx. 2 letras mayúsculas del nombre). */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word[0] === word[0]?.toUpperCase())
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

/**
 * Paleta corta de fondos para avatares de empresa. El color se deriva del
 * nombre con un hash determinista: cada empresa conserva siempre el mismo
 * color y las tarjetas vecinas del directorio se distinguen entre sí.
 */
const AVATAR_COLORS = [
  "bg-brand-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-slate-600",
] as const;

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
