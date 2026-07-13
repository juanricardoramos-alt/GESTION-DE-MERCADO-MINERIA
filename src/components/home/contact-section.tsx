import { useTranslations } from "next-intl";

import { ContactForm } from "@/components/home/contact-form";

/** Formulario de contacto sobre imagen con overlay oscuro de marca. */
export function ContactSection() {
  const t = useTranslations("home.contact");

  return (
    <section id="contacto" className="relative scroll-mt-20 overflow-hidden">
      {/* Fondo: placeholder del hero + overlay brand oscuro (contraste AA) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/mineria.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-950/90" />

      <div className="container relative py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-white/80">{t("subtitle")}</p>
        </div>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
