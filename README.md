# Fresh Coffee

Quiosco digital para cafetería construido con `Next.js 15`, `Prisma` y `PostgreSQL`.

Incluye:
- flujo de pedido para clientes
- pantalla pública de pedidos listos
- panel administrativo protegido
- gestión de productos, stock y estado de pedidos
- perfil de administrador con avatar y cambio de contraseña
- métricas y rankings en la sección `Top`

## Descripción

Fresh Coffee es una aplicación web pensada para operar un quiosco/cafetería con una experiencia moderna y simple.

El proyecto conecta tres vistas principales:
- `Cliente`: arma y confirma su pedido por categoría.
- `Admin`: gestiona pedidos, productos, stock, perfil y rankings.
- `Pantalla pública`: muestra pedidos listos para retiro.

## Tecnologías

- `Next.js 15` con App Router
- `React 18`
- `TypeScript`
- `Prisma ORM`
- `PostgreSQL`
- `Zustand` para estado del pedido
- `SWR` para polling en pedidos listos
- `Tailwind CSS`
- `Cloudinary` para carga de imágenes
- `Zod` para validación

## Funcionalidades

### Cliente
- navegación por categorías
- cards de producto con modal de detalle
- resumen lateral de pedido
- control de cantidades
- bloqueo de productos agotados
- acceso admin desde el quiosco mediante modal

### Admin
- login protegido por middleware
- pedidos separados en pestañas:
  - `Pendientes`
  - `Listos`
  - `Cancelados`
- detalle de pedido en modal
- cambio de estado a listo o cancelado
- catálogo con filtros por nombre y categoría
- creación y edición de productos en modal
- control de stock y estado `agotado`
- perfil con cambio de contraseña
- avatar por preset o foto personalizada
- dashboard `Top` con producto estrella y rankings

### Público
- pantalla `/orders` para mostrar pedidos listos
- actualización periódica automática

## Estructura Principal

```text
app/
  order/                 Flujo cliente
  orders/                Pantalla pública de pedidos listos
  admin/                 Panel administrativo
  login/                 Login admin
actions/                 Server Actions
components/              UI y componentes de dominio
prisma/                  Schema, migraciones y seed
src/
  auth.ts                Sesión admin
  admin-profile.ts       Perfil admin persistido
  store.ts               Estado del pedido
  schema/                Validaciones Zod
```

## Requisitos

- `Node.js 20+`
- `npm`
- `PostgreSQL`
- variables de entorno válidas

## Variables de Entorno

Crea un archivo `.env` con lo necesario.

Variables principales:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

ADMIN_EMAIL="admin@freshcoffee.cl"
ADMIN_PASSWORD="Admin1234!"

```

Notas:
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` se usan como bootstrap inicial del perfil admin si la tabla `AdminProfile` está vacía.
- luego el admin puede cambiar contraseña desde la app.
- `NEXT_PUBLIC_APP_URL` se usa para metadata, `robots` y `sitemap`.

## Instalación

```bash
npm install
```

## Base de Datos

Validar Prisma:

```bash
npx prisma validate
```

Aplicar migraciones según tu flujo.

Poblar datos base:

```bash
npx prisma db seed
```

## Desarrollo

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Verificación Recomendada

Orden recomendado:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Chequeo Prisma:

```bash
npx prisma validate
```

## Rutas Importantes

- `/` redirige a la primera categoría disponible
- `/order/[category]` flujo de compra
- `/orders` pedidos listos
- `/login` login admin
- `/admin/orders` panel de pedidos
- `/admin/products` gestión de productos
- `/admin/profile` perfil admin
- `/admin/top` rankings y métricas

## Seguridad Aplicada

El proyecto ya incluye medidas base:
- middleware para proteger `/admin/*`
- validación con `Zod`
- server-side validation en creación de pedidos
- cálculo de total del pedido en servidor
- validación de stock antes de crear orden
- control de productos agotados en UI y store
- validación de imágenes remotas por extensión
- límites de formato y peso en cargas Cloudinary
- headers de seguridad:
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Strict-Transport-Security`

## Metadata y SEO

El proyecto incluye:
- metadata global mejorada
- Open Graph
- Twitter cards
- `robots.ts`
- `sitemap.ts`

## Gestión de Imágenes

Se usan dos fuentes:
- imágenes locales seed en `public/products`
- imágenes remotas subidas a Cloudinary

Restricciones actuales:
- formatos permitidos: `jpg`, `jpeg`, `webp`
- tamaño máximo: `2 MB`

## Estado de Pedidos

Estados persistidos:
- `PENDING`
- `COMPLETED`
- `CANCELLED`

La pantalla pública `/orders` solo muestra pedidos `COMPLETED`.

## Stock y Agotado

Cada producto tiene `stock`.

Cuando `stock = 0`:
- el admin lo ve como agotado
- el cliente ve badge `Agotado`
- el producto no se puede agregar al pedido

## Observaciones de Operación

- el perfil admin se inicializa automáticamente si la tabla está vacía
- si cambias la DB o la reinicias, asegúrate de revisar el bootstrap admin
- Cloudinary debe aceptar el preset `RicardoN` o el que decidas configurar

## Próximos Pasos Sugeridos

- descuento automático de stock al confirmar pedido
- reposición automática al cancelar
- despliegue a producción
- observabilidad y logs
- rate limiting para login
- sesiones admin más robustas

## Scripts Útiles

```bash
npm run dev
npm run lint
npm run build
npx tsc --noEmit
npx prisma validate
npx prisma db seed
```

## Licencia

Uso interno o educativo, según tu necesidad. Ajusta esta sección si vas a publicar el proyecto con una licencia formal.
