"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Carrusel horizontal accesible con scroll-snap y flechas. Los hijos deben
 * llevar `snap-start shrink-0` y un ancho fijo.
 */
export function HScrollCarousel({
  label,
  prevLabel,
  nextLabel,
  children,
}: {
  label: string;
  prevLabel: string;
  nextLabel: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByViewport(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
    >
      <div className="absolute -top-14 right-0 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={prevLabel}
          onClick={() => scrollByViewport(-1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label={nextLabel}
          onClick={() => scrollByViewport(1)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
      >
        {children}
      </div>
    </div>
  );
}
