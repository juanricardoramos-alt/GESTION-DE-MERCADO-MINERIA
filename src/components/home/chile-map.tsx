import type { Project } from "@/types";

/**
 * Silueta simplificada de Chile continental (trazado propio, ~30 vértices)
 * con pines de proyectos reales proyectados por lat/lng (equirectangular).
 * No es cartografía de precisión: es un soporte visual de la cartera.
 */

/** Contorno aproximado [lng, lat]: costa de norte a sur y frontera de vuelta. */
const OUTLINE: Array<[number, number]> = [
  [-70.35, -18.35],
  [-70.6, -19.7],
  [-70.25, -21.4],
  [-70.5, -23.5],
  [-70.6, -25.3],
  [-70.9, -27.2],
  [-71.4, -29.2],
  [-71.7, -31.0],
  [-71.7, -33.0],
  [-72.2, -35.0],
  [-73.2, -37.2],
  [-73.5, -38.8],
  [-73.4, -40.3],
  [-73.8, -42.0],
  [-74.4, -43.7],
  [-75.5, -46.5],
  [-75.2, -48.7],
  [-74.6, -50.7],
  [-73.5, -52.5],
  [-71.5, -53.9],
  [-69.0, -52.4],
  [-69.3, -51.0],
  [-72.0, -49.0],
  [-71.7, -45.0],
  [-71.8, -43.0],
  [-71.4, -40.0],
  [-71.0, -38.0],
  [-70.4, -35.0],
  [-70.0, -33.0],
  [-69.9, -30.0],
  [-68.4, -27.0],
  [-67.0, -24.0],
  [-67.2, -22.9],
  [-68.9, -19.2],
  [-69.5, -17.6],
];

const MIN_LNG = -76;
const MAX_LNG = -66;
const MIN_LAT = -56;
const MAX_LAT = -17;
const WIDTH = 220;
const HEIGHT = 700;

function project(lng: number, lat: number): [number, number] {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * WIDTH;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * HEIGHT;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

const OUTLINE_PATH =
  OUTLINE.map(([lng, lat], index) => {
    const [x, y] = project(lng, lat);
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") + " Z";

export function ChileMap({
  projects,
  ariaLabel,
}: {
  projects: Project[];
  ariaLabel: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className="h-[420px] w-auto sm:h-[480px]"
    >
      <path
        d={OUTLINE_PATH}
        fill="#EEF2FF"
        stroke="#C7D2FE"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {projects.map((item) => {
        const [x, y] = pinPosition(item);
        return (
          <g key={item.id}>
            <circle
              cx={x}
              cy={y}
              r="7"
              fill="#0D9488"
              fillOpacity="0.25"
            />
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="#0D9488"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <title>{`${item.name} — ${item.region}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

function pinPosition(item: Project): [number, number] {
  const lng = Math.min(Math.max(item.lng, MIN_LNG), MAX_LNG);
  const lat = Math.min(Math.max(item.lat, MIN_LAT), MAX_LAT);
  return project(lng, lat);
}
