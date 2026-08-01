# AGENTS.md

## Working Agreement
- Before editing code, briefly explain the intended change so the user can confirm direction.
- Fix behavior first, verify it, then discuss broader improvements.

## Repo Shape
- `README.md` is still the default Next.js template; trust `package.json`, `app/*`, `actions/*`, and Prisma files instead.
- This is one Next.js 15 App Router app, not a monorepo. `@/*` maps to the repo root.
- Main entry areas are `app/page.tsx` (redirects to the first order category), `app/order/*` (customer flow), `app/orders/*` (public ready-orders screen), `app/login/page.tsx`, and `app/admin/*` (admin panel).
- `/` queries Prisma for the first category and redirects into the ordering flow, so the root route still needs a working `DATABASE_URL`.

## Commands
- `npm run dev`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `npx prisma validate`
- `npx prisma db seed`
- Preferred verification order: `npm run lint` -> `npx tsc --noEmit` -> `npm run build`
- There is no test suite; `npm run build` is the highest-signal check for App Router issues.

## Data Flow
- Server writes live in `actions/*.ts`; they validate with Zod from `src/schema/index.ts` and call Prisma directly.
- Prisma schema is `prisma/schema.prisma`; seed inputs live in `prisma/data/categories.ts` and `prisma/data/products.ts`.
- Customer cart/order state is client-side Zustand in `src/store.ts`; checkout submits through `actions/create-order-action.ts`.
- `create-order-action.ts`, `complete-order-action.ts`, and `delete-order-action.ts` revalidate both `/admin/orders` and `/orders`; preserve that coupling when changing order status flow.

## Admin/Auth
- `/admin/*` is protected by `middleware.ts`; unauthenticated users are redirected to `/login?redirectTo=...`.
- Admin auth is a simple cookie check in `src/auth.ts`, not NextAuth or a database-backed session.
- Production requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. Dev falls back to hardcoded credentials in `src/auth.ts`.

## Gotchas
- Keep existing `export const dynamic = 'force-dynamic'` on order and admin product routes unless you intentionally redesign data fetching.
- The public ready-orders screen is a client page that polls `/orders/api` with SWR every 60s.
- Product images can be seeded local filenames or Cloudinary URLs. Keep `src/utils/index.ts#getImagePath` behavior intact.
- Cloudinary uploads use `components/products/ImageUpload.tsx` with `uploadPreset="RicardoN"`.
- The repo mixes `route.ts` and `route.tsx`; treat route-file renames as build-sensitive.
