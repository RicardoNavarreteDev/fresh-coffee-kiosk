import Link from 'next/link'
import { login } from '@/actions/login-action'
import Logo from '@/components/ui/Logo'

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
    retryAfter?: string
    redirectTo?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, retryAfter, redirectTo = '/admin/orders' } = await searchParams

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel flex flex-col justify-between rounded-[2.5rem] px-6 py-8 lg:px-10 lg:py-12">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Acceso admin</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 lg:text-6xl">
              Controla productos, revisa pedidos y administra el quiosco desde un solo lugar.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">
              Ingresa con tu cuenta de administracion para ver el historial completo de pedidos, revisar su detalle y gestionar el flujo del negocio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <article className="panel-muted rounded-[2rem] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Pedidos</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">Consulta todos los pedidos en un solo panel, incluyendo pendientes y completados.</p>
            </article>
            <article className="panel-muted rounded-[2rem] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Detalle</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">Abre cada pedido para revisar cliente, fecha, productos, cantidades y total.</p>
            </article>
            <article className="panel-muted rounded-[2rem] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Control</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">Marca pedidos como listos o elimínalos cuando corresponda.</p>
            </article>
          </div>
        </section>

        <section className="panel flex items-center justify-center rounded-[2.5rem] px-6 py-8 lg:px-10 lg:py-12">
          <div className="w-full max-w-md space-y-6">
            <Logo />

            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Fresh Coffee</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Iniciar sesion</h2>
              <p className="text-sm leading-7 text-slate-500">Accede al panel administrativo del quiosco.</p>
            </div>

            {error === 'blocked' ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Demasiados intentos de inicio de sesión. Espera {retryAfter ?? 'unos segundos'} antes de volver a intentar.
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Credenciales incorrectas. Revisa el correo y la clave del administrador.
              </div>
            ) : null}

            <form action={login} className="space-y-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Correo</label>
                <input id="email" name="email" type="email" className="field-input" placeholder="admin@freshcoffee.cl" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Clave</label>
                <input id="password" name="password" type="password" className="field-input" placeholder="Ingresa tu clave" />
              </div>

              <button type="submit" className="button-primary w-full">
                Entrar al panel
              </button>
            </form>

            <Link href="/" className="button-secondary w-full">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
