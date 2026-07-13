# Gestión de Mercado — Plataforma B2B de inteligencia de mercados

Portal de suscripción con noticias, mapa de proyectos, directorio de
empresas, dashboards de mercado y biblioteca de estudios para las industrias de
**minería, energía, litio, hidrógeno verde y desalinización** en Chile.

> ⚠️ Todos los datos de contenido (noticias, proyectos, empresas, ejecutivos,
> series de mercado) son **ficticios**, creados solo para demostración.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript estricto
- [PostgreSQL](https://www.postgresql.org/) + [Prisma 7](https://www.prisma.io/) — persistencia
- [Tailwind CSS](https://tailwindcss.com/) + componentes estilo [shadcn/ui](https://ui.shadcn.com/)
- [next-intl](https://next-intl.dev/) — bilingüe español (por defecto) / inglés
- [Zod](https://zod.dev/) — validación de inputs y de los campos Json bilingües
- [Recharts](https://recharts.org/) — dashboards de producción, precios, proyecciones y energía
- [React-Leaflet](https://react-leaflet.js.org/) + OpenStreetMap — mapa interactivo de proyectos

## Puesta en marcha

### 1. Variables de entorno

Copiar `.env.example` a `.env` y completar los valores (ver comentarios en el
archivo). La única variable obligatoria para arrancar es `DATABASE_URL`.

### 2. Base de datos

Requiere un Postgres accesible. Con el cliente local:

```bash
createuser gestion_mercado --pwprompt --createdb
createdb gestion_mercado --owner gestion_mercado
```

Luego aplicar el esquema y poblar el contenido inicial:

```bash
npm install          # instala dependencias y genera el cliente Prisma
npm run db:deploy    # aplica las migraciones (prisma migrate deploy)
npm run db:seed      # migra el contenido de src/data/*.ts a la base
```

El seed es **idempotente** (usa upserts con los ids originales): puede
ejecutarse las veces que haga falta sin duplicar registros. Migra 12 empresas
(con sus ejecutivos), 18 proyectos, 15 noticias y 8 estudios.

En desarrollo, para crear una migración nueva tras editar
`prisma/schema.prisma`: `npm run db:migrate`.

### 3. Aplicación

```bash
npm run dev    # http://localhost:3000 → redirige a /es
npm run build  # build de producción
npm run start  # servir el build
```

## Autenticación

Auth.js (NextAuth v5) con dos métodos:

- **Credenciales**: email + contraseña (hash bcrypt). El registro vive en
  `POST /api/auth/register` y crea cuentas con plan FREE.
- **Google OAuth**: opcional; el botón aparece solo si `GOOGLE_CLIENT_ID` y
  `GOOGLE_CLIENT_SECRET` están configuradas.

La sesión es JWT y lleva `role` (USER/ADMIN) y `tier`
(FREE/PROFESIONAL/CORPORATIVO). El middleware corta el acceso a las rutas
protegidas (`/analisis` exige plan pagado, `/admin` exige rol ADMIN) y la
autorización fina re-consulta la base en el servidor (`src/lib/access.ts`).

## Pagos

La capa de pagos está abstraída detrás de `PaymentProvider`
(`src/lib/payments/provider.ts`); Stripe es la implementación activa y
Transbank/Flow pueden sumarse implementando la interfaz y registrándola en
`src/lib/payments/index.ts` (selección por `PAYMENT_PROVIDER`).

- **Checkout**: `POST /api/billing/checkout` crea la sesión de Stripe
  Checkout para Profesional (US$ 49) o Corporativo (US$ 199).
- **Webhook**: `POST /api/webhooks/stripe` verifica la firma y sincroniza
  `Subscription` + `User.tier` en alta, renovación, cambio de plan, pago
  fallido (PAST_DUE conserva acceso como gracia) y cancelación (vuelve a
  FREE). En local: `stripe listen --forward-to
  localhost:3000/api/webhooks/stripe`.
- **Portal**: `POST /api/billing/portal` abre el Billing Portal para
  gestionar medio de pago, facturas y baja; la página `/cuenta` muestra el
  estado de la suscripción.

Sin credenciales de Stripe la app funciona igual y los endpoints de pago
responden `503 payments_unconfigured`.

## Paywall server-side

El contenido premium **no sale del servidor** si el usuario no tiene el plan
requerido: la capa de datos (`getStudies({ revealPremium })`) retiene el
resumen antes de serializar, y el Server Component decide `revealPremium`
re-consultando el tier en la base (`viewerHasTier`, `src/lib/access.ts`).
El cliente solo recibe metadatos públicos + el CTA de membresía; no hay
contenido oculto con CSS ni difuminado.

## Panel de administración

`/admin` exige rol `ADMIN` (middleware + re-verificación fresca en cada
página y server action). Incluye CRUD de noticias, estudios, empresas
(con ejecutivos) y proyectos, con los campos bilingües en tabs ES/EN y
validación Zod en los server actions. Los estudios aceptan PDF y portada:
los archivos se guardan en `uploads/` (no versionado) y los sirve
`/uploads/[...path]`, que aplica el paywall a los PDFs premium (adivinar
la URL responde 403 sin el plan requerido).

Para crear la cuenta admin: definir `ADMIN_EMAIL` y `ADMIN_PASSWORD` en
`.env` y correr `npm run db:seed`.

## Búsqueda y filtros

Los filtros de `/noticias`, `/empresas` y `/mapa` se resuelven en el
servidor y viven en la URL (`?sector=&q=&page=` / `?sector=&region=&status=`),
por lo que son compartibles y navegables con atrás/adelante. La búsqueda de
texto usa full-text de Postgres (tsquery de prefijos + `ts_rank`) con
índices GIN por idioma sobre artículos y empresas
(`prisma/migrations/*_search_indexes`), más un índice GIN para el filtro
de sector de empresas. Los searchParams se validan con Zod: parámetros
inválidos degradan a los valores por defecto.

## Portada

- **Imágenes del hero**: los archivos de `public/hero/*.svg` son
  **placeholders generados** (gradientes de marca, uno por sector).
  Reemplazarlos por fotografías con licencia manteniendo los nombres
  (`mineria`, `energia`, `litio`, `hidrogeno`, `desalinizacion`; puede
  cambiarse la extensión ajustando `hero-carousel.tsx`). Lo mismo aplica
  al fondo del formulario de contacto (`contact-section.tsx`).
- **Video institucional**: configurar el ID de YouTube en `HOME_VIDEO_ID`
  (`src/lib/constants.ts`); vacío muestra un placeholder sin embed.
- **Equipo**: el arreglo `TEAM` en `src/lib/constants.ts` (datos de
  ejemplo con avatares de iniciales).
- **Leads**: el formulario de contacto guarda en la tabla `ContactLead`
  (`POST /api/contact`, validado con Zod incluyendo RUT chileno).

## Convención de contenido bilingüe

Los campos de texto con variante es/en se guardan en Postgres como columnas
`Json` con la forma `{ "es": string, "en": string }` (tipo `LocalizedText`).
Al leer, la capa de datos (`src/lib/content.ts`) valida cada campo con Zod
para que un registro malformado falle en la query y no en el render.

## Estructura

```
messages/            Traducciones es.json / en.json (toda la UI)
prisma/              schema.prisma, migraciones y seed.ts
src/
  app/[locale]/      Páginas: home, noticias, mapa, empresas(/[slug]),
                     analisis, estudios, membresia, login, registro
  components/
    ui/              Primitivas shadcn/ui (button, card, badge, input, tabs)
    layout/          Header (nav + selector de idioma), footer
    home|news|map|directory|charts|reports|membership|shared/
  data/              Contenido fuente del seed (news, projects, companies,
                     reports) + series de mercado y planes (estáticos)
  i18n/              Configuración next-intl (routing, request, navigation)
  lib/               db.ts (Prisma), content.ts (queries+mappers),
                     validation.ts (Zod), constants.ts, formatters, utils
  types/             Tipos de dominio
```

## Personalización rápida

- **Marca y contacto:** `src/lib/constants.ts` → `SITE` (el nombre visible del
  logo está en `components/layout/{header,footer}.tsx`).
- **Sectores:** editar `SECTORS` en `src/lib/constants.ts`, el tipo `SectorId`
  en `src/types/index.ts`, el enum `Sector` en `prisma/schema.prisma` y las
  etiquetas `sectors.*` en `messages/{es,en}.json`.
- **Paleta:** escala `brand` en `tailwind.config.ts` (índigo `#4F46E5`) y
  variables CSS en `src/app/globals.css`; colores de gráficos en `CHART`
  (`src/lib/constants.ts`), validados para daltonismo y contraste.
- **Contenido:** se administra en la base (los arreglos de `src/data/*.ts`
  son la fuente del seed inicial).
