import { Mail, MapPin, Mountain, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";

/* lucide-react ya no incluye íconos de marcas: SVG propios para redes. */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

const PLATFORM_LINKS = [
  { key: "news", href: "/noticias" },
  { key: "map", href: "/mapa" },
  { key: "directory", href: "/empresas" },
  { key: "analytics", href: "/analisis" },
  { key: "reports", href: "/estudios" },
  { key: "membership", href: "/membresia" },
] as const;

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Marca */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <Mountain className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Andes<span className="text-indigo-400">Intel</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {t("footer.tagline")}
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-md border border-slate-800 p-2 text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={SITE.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              className="rounded-md border border-slate-800 p-2 text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Plataforma */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t("footer.platform")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {PLATFORM_LINKS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Compañía */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t("footer.company")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.about")}
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.methodology")}
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.careers")}
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.legal")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t("footer.contact")}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="transition-colors hover:text-white"
              >
                {SITE.contactEmail}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <span>{SITE.phone}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>{t("footer.rights", { year })}</p>
          <p>{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
