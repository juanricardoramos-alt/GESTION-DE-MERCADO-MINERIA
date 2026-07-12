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
