import { Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { HScrollCarousel } from "@/components/shared/hscroll-carousel";
import { LinkedinIcon } from "@/components/shared/social-icons";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { TEAM } from "@/lib/constants";
import { pickText } from "@/lib/formatters";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

/** Carrusel del equipo (datos en TEAM, avatares placeholder con iniciales). */
export function TeamCarousel() {
  const t = useTranslations("home.team");
  const locale = useLocale();

  return (
    <section id="equipo" className="scroll-mt-20 border-t">
      <div className="container py-16 sm:py-20">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-16">
          <HScrollCarousel
            label={t("title")}
            prevLabel={t("prev")}
            nextLabel={t("next")}
          >
            {TEAM.map((member) => (
              <Card key={member.email} className="w-64 shrink-0 snap-start">
                <CardContent className="flex h-full flex-col items-center gap-3 p-6 text-center">
                  {/* Avatar placeholder: iniciales sobre color determinista */}
                  <span
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white",
                      getAvatarColor(member.name),
                    )}
                    aria-hidden
                  >
                    {getInitials(member.name)}
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{member.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {pickText(member.role, locale)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={t("emailAria", { name: member.name })}
                      className="rounded-md border p-2 text-muted-foreground transition-colors hover:border-brand-300 hover:text-foreground"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("linkedinAria", { name: member.name })}
                      className="rounded-md border p-2 text-muted-foreground transition-colors hover:border-brand-300 hover:text-foreground"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </HScrollCarousel>
        </div>
      </div>
    </section>
  );
}
