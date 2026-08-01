"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { formatCurrency, getImagePath } from "@/src/utils"
import AddProductButton from "./AddProductButton"

type ProductQuickViewProps = {
    product: Product
}

export default function ProductQuickView({ product }: ProductQuickViewProps) {
    const [isOpen, setIsOpen] = useState(false)
    const imagePath = getImagePath(product.image)
    const isOutOfStock = product.stock <= 0

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="group block text-left"
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                        fill
                        className={`object-cover transition duration-300 ${isOutOfStock ? '' : 'group-hover:scale-[1.03]'}`}
                        src={imagePath}
                        alt={`Imagen platillo ${product.name}`}
                    />
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <h3 className="min-h-[4rem] text-2xl font-semibold tracking-tight text-slate-900">{product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description ?? 'Producto disponible en Fresh Coffee.'}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {isOutOfStock ? (
                            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                                Agotado
                            </span>
                        ) : (
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                Stock: {product.stock}
                            </span>
                        )}
                    </div>
                    <p className="mt-4 text-3xl font-black text-amber-500">
                        {formatCurrency(product.price)}
                    </p>
                </div>
            </button>

            {isOpen ? createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.25rem] border border-white/60 bg-white shadow-2xl shadow-slate-900/30">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                            aria-label="Cerrar detalle del producto"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="relative min-h-[20rem] bg-slate-100 lg:min-h-[28rem]">
                                <Image
                                    fill
                                    className="object-cover"
                                    src={imagePath}
                                    alt={`Imagen platillo ${product.name}`}
                                />

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent p-6 lg:p-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/75">Fresh Coffee</p>
                                    <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white">{product.name}</h3>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between bg-white p-6 lg:p-8">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Detalle del producto</p>
                                    <p className="mt-4 inline-flex rounded-full bg-amber-50 px-4 py-2 text-2xl font-black text-amber-600 ring-1 ring-amber-100">
                                        {formatCurrency(product.price)}
                                    </p>
                                    <div className="mt-3">
                                        {isOutOfStock ? (
                                            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                                                Producto agotado
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                                Stock disponible: {product.stock}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Descripción</p>
                                        <p className="mt-3 text-base leading-8 text-slate-600">
                                            {product.description ?? 'Producto disponible en Fresh Coffee.'}
                                        </p>
                                    </div>

                                    <div className="mt-6 grid gap-3 rounded-[2rem] border border-slate-200 p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Ideal para</span>
                                            <span className="text-sm font-medium text-slate-700">Un antojo con buen café</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Preparación</span>
                                            <span className="text-sm font-medium text-slate-700">Hecho al momento</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <AddProductButton
                                        product={product}
                                        onAdd={() => setIsOpen(false)}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            ) : null}
        </>
    )
}
