# AndesIntel — Plataforma B2B de inteligencia de mercados

Portal de suscripción (demo) con noticias, mapa de proyectos, directorio de
empresas, dashboards de mercado y biblioteca de estudios para las industrias de
**minería, energía, litio, hidrógeno verde y desalinización** en Chile.

> ⚠️ Todos los datos (noticias, proyectos, empresas, ejecutivos, series de
> mercado) son **ficticios**, creados solo para demostración. El login/registro
> es únicamente de interfaz: no hay backend de autenticación.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript estricto
- [Tailwind CSS](https://tailwindcss.com/) + componentes estilo [shadcn/ui](https://ui.shadcn.com/)
- [next-intl](https://next-intl.dev/) — bilingüe español (por defecto) / inglés
- [Recharts](https://recharts.org/) — dashboards de producción, precios, proyecciones y energía
- [React-Leaflet](https://react-leaflet.js.org/) + OpenStreetMap — mapa interactivo de proyectos

## Desarrollo

```bash
npm install
npm run dev    # http://localhost:3000 → redirige a /es
npm run build  # build de producción (prerenderiza es/en)
```

## Estructura

```
messages/            Traducciones es.json / en.json (toda la UI)
src/
  app/[locale]/      Páginas: home, noticias, mapa, empresas(/[slug]),
                     analisis, estudios, membresia, login, registro
  components/
    ui/              Primitivas shadcn/ui (button, card, badge, input, tabs)
    layout/          Header (nav + selector de idioma), footer
    home|news|map|directory|charts|reports|membership|shared/
  data/              Datos placeholder tipados (news, projects, companies,
                     market, reports, plans)
  i18n/              Configuración next-intl (routing, request, navigation)
  lib/               constants.ts (sectores/colores/marca), formatters, utils
  types/             Tipos de dominio
```

## Personalización rápida

- **Marca y contacto:** `src/lib/constants.ts` → `SITE` (el nombre visible del
  logo está en `components/layout/{header,footer}.tsx`).
- **Sectores:** son configurables — editar `SECTORS` en `src/lib/constants.ts`,
  el tipo `SectorId` en `src/types/index.ts` y las etiquetas `sectors.*` en
  `messages/{es,en}.json`. Categorías de noticias, filtros del mapa, rubros del
  directorio y badges se alimentan de ese arreglo.
- **Paleta:** variables CSS en `src/app/globals.css` (primario índigo
  `#4F46E5`); colores de gráficos en `CHART` (`src/lib/constants.ts`),
  validados para daltonismo y contraste sobre fondo blanco.
- **Datos:** reemplazar los arreglos de `src/data/*.ts` (los textos de
  contenido usan `{ es, en }`).
