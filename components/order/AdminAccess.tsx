"use client"

import { useActionState, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminAvatarPreset } from '@prisma/client'
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { loginFromOrderModal, type LoginState } from '@/actions/login-action'
import { logout } from '@/actions/logout-action'
import AdminAvatar from '@/components/admin/AdminAvatar'

const initialState: LoginState = {
  error: '',
}

function SubmitButton() {
  return (
    <button type="submit" className="button-primary w-full">
      Entrar al panel
    </button>
  )
}

type AdminAccessProps = {
  isAuthenticated: boolean
  avatarPreset?: AdminAvatarPreset
  avatarImage?: string | null
}

export default function AdminAccess({ isAuthenticated, avatarPreset = 'BEAR', avatarImage }: AdminAccessProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [state, formAction] = useActionState(loginFromOrderModal, initialState)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (state.error) {
      setIsOpen(true)
    }
  }, [state.error])

  if (isAuthenticated) {
    return (
      <div className="mx-3 mt-6 border-t border-slate-200 pt-5">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-4">
            <AdminAvatar avatarPreset={avatarPreset} avatarImage={avatarImage} sizeClassName="h-12 w-12" emojiClassName="text-2xl" />

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Admin</p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-slate-900">Sesión iniciada</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <Link href="/admin/orders" className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800">
              Ir al panel
            </Link>

            <form action={logout}>
              <input type="hidden" name="redirectTo" value={pathname} />
              <button type="submit" className="button-secondary w-full">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-3 mt-6 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex w-full items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left text-slate-700 transition hover:border-slate-300 hover:bg-white"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-slate-700">
            <UserCircleIcon className="h-7 w-7" />
          </span>

          <span className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Admin</span>
            <span className="mt-1 text-sm font-semibold tracking-tight text-slate-900">Iniciar sesión</span>
          </span>
        </button>
      </div>

      {isMounted && isOpen ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Acceso admin</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Inicia sesión para entrar al panel</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Accede sin salir del quiosco. Al entrar te llevamos al panel administrativo.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="Cerrar ventana de inicio de sesión"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="redirectTo" value="/admin/orders" />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-admin-email">Correo</label>
                <input
                  id="order-admin-email"
                  name="email"
                  type="email"
                  className="field-input"
                  placeholder="admin@freshcoffee.cl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-admin-password">Clave</label>
                <input
                  id="order-admin-password"
                  name="password"
                  type="password"
                  className="field-input"
                  placeholder="Ingresa tu clave"
                />
              </div>

              {state.error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {state.error}
                </div>
              ) : null}

              <SubmitButton />
            </form>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  )
}
