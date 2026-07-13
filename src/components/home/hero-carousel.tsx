"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SECTORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

/**
 * Hero full-bleed que rota por los 5 sectores. Autoplay pausable (botón y
 * hover), respeta prefers-reduced-motion (sin rotación automática) y expone
 * puntos indicadores accesibles. Se desplaza -mt-16 para quedar bajo el
 * header translúcido.
 */
export function HeroCarousel() {
  const t = useTranslations();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => {
      if (!hovering.current) {
        setActive((index) => (index + 1) % SECTORS.length);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t("home.heroCarousel.ariaLabel")}
      className="relative -mt-16 h-[85vh] min-h-[560px] w-full overflow-hidden bg-slate-950"
      onMouseEnter={() => {
        hovering.current = true;
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      {SECTORS.map((sector, index) => {
        const isActive = index === active;
        return (
          <div
            key={sector}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${SECTORS.length}`}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              isActive ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {/* Placeholder SVG: reemplazar por fotografía con licencia (README) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/hero/${sector}.svg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay en degradado: garantiza contraste AA del texto */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/35"
            />

            <div className="container relative flex h-full flex-col justify-end pb-28 pt-24 sm:pb-32">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                {t("home.heroCarousel.ariaLabel")}
              </p>
              <h1 className="mt-3 max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {t(`sectors.${sector}`)}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {t(`home.heroCarousel.slides.${sector}`)}
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href={`/mapa?sector=${sector}`}>
                    {t("home.heroCarousel.cta")}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controles: puntos + pausa. bottom-16 + z-30 los mantiene visibles y
          clickeables por encima de la franja de KPIs que se solapa (-mt-10). */}
      <div className="absolute inset-x-0 bottom-16 z-30 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2" role="group">
          {SECTORS.map((sector, index) => (
            <button
              key={sector}
              type="button"
              aria-label={t("home.heroCarousel.goTo", {
                sector: t(`sectors.${sector}`),
              })}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                index === active
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={
            paused ? t("home.heroCarousel.play") : t("home.heroCarousel.pause")
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          className="rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {paused ? (
            <Play className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
