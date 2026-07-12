import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { SECTOR_BADGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SectorId } from "@/types";

/** Badge de sector con color propio y etiqueta traducida. */
export function SectorBadge({
  sector,
  className,
}: {
  sector: SectorId;
  className?: string;
}) {
  const t = useTranslations("sectors");
  return (
    <Badge variant="outline" className={cn(SECTOR_BADGE[sector], className)}>
      {t(sector)}
    </Badge>
  );
}
