"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { STATUS_COLOR } from "@/lib/constants";
import type { Project } from "@/types";

import "leaflet/dist/leaflet.css";

/** Centra el mapa suavemente cuando cambia el proyecto seleccionado. */
function FlyToSelected({ project }: { project: Project | null }) {
  const map = useMap();

  useEffect(() => {
    if (project) {
      map.flyTo([project.lat, project.lng], Math.max(map.getZoom(), 6), {
        duration: 0.8,
      });
    }
  }, [project, map]);

  return null;
}

/**
 * Mapa Leaflet con marcadores circulares coloreados por estado del proyecto.
 * Debe cargarse con `next/dynamic` y `ssr: false` (Leaflet requiere `window`).
 */
export function ProjectMap({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[-35.5, -71]}
      zoom={4}
      minZoom={3}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected project={selected} />
      {projects.map((project) => {
        const isSelected = project.id === selectedId;
        return (
          <CircleMarker
            key={project.id}
            center={[project.lat, project.lng]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: STATUS_COLOR[project.status],
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect(project.id) }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <span className="font-medium">{project.name}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
