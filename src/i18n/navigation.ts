import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de navegación conscientes del locale.
 * Usar siempre estos en lugar de los de `next/link` / `next/navigation`
 * para que los enlaces conserven el prefijo /es o /en.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
