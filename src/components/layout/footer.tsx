import { Mail, MapPin, Mountain, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { LinkedinIcon, XIcon } from "@/components/shared/social-icons";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";

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
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
              <Mountain className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              {t("brand.leading")}{" "}
              <span className="text-brand-400">{t("brand.accent")}</span>
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
