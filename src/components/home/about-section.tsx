import { MonitorPlay } from "lucide-react";
import { useTranslations } from "next-intl";

import { ChileMap } from "@/components/home/chile-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOME_VIDEO_ID } from "@/lib/constants";
import type { Project } from "@/types";

/**
 * Quiénes somos: copy institucional + silueta de Chile con los proyectos
 * destacados de la cartera (datos reales), y bloque de video institucional.
 */
export function AboutSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("home.about");

  return (
    <section className="border-b bg-slate-50/70">
      <div className="container py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title={t("title")} subtitle={t("p1")} />
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              {t("p2")}
            </p>
          </div>

          <figure className="flex flex-col items-center">
            <ChileMap projects={projects} ariaLabel={t("mapAria")} />
            <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full bg-teal-600 ring-2 ring-teal-600/25"
              />
              {t("mapCaption")}
            </figcaption>
          </figure>
        </div>

        {/* Video institucional (embed responsivo; ID en constants.ts) */}
        <div className="mx-auto mt-14 max-w-3xl">
          <h3 className="text-center text-lg font-semibold">
            {t("videoTitle")}
          </h3>
          <div className="mt-4 overflow-hidden rounded-xl border shadow-sm">
            {HOME_VIDEO_ID ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${HOME_VIDEO_ID}`}
                title={t("videoTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-600 to-teal-700 px-6 text-center text-white">
                <MonitorPlay className="h-10 w-10 opacity-80" aria-hidden />
                <p className="max-w-md text-sm text-white/85">
                  {t("videoPlaceholder")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
