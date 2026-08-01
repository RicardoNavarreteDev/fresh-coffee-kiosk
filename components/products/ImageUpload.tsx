"use client"
import { getImagePath } from "@/src/utils"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useState } from "react"
import { TbPhotoPlus } from "react-icons/tb"


export default function ImageUpload({image}: {image: string | undefined}) {
  const [imageUrl, setImageUrl] = useState('')
  return (
    <CldUploadWidget
        onSuccess={(result, {widget}) => {
            if(result.event === 'success') {
                widget.close()
                   // @ts-expect-error: 'setImageUrl' expects a secure URL, and TypeScript may not infer this correctly
                setImageUrl(result.info?.secure_url)
            }     
        }}
        uploadPreset="RicardoN"
        options={{
            maxFiles: 1,
            clientAllowedFormats: ['jpg', 'jpeg', 'webp'],
            maxFileSize: 2000000,
        }}
    >
        {({open}) => (
            <>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Imagen del producto</label>
                        <p className="text-sm leading-6 text-slate-500">Formatos permitidos: JPG, JPEG y WEBP. Tamaño máximo: 2 MB.</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 ring-1 ring-slate-100">
                        <button
                            type="button"
                            onClick={() => open()}
                            className="inline-flex rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:bg-white"
                        >
                            <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
                                <TbPhotoPlus size={22} />
                            </span>
                            Subir foto
                        </button>
                    </div>
                </div>

                {(imageUrl || image) && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Vista previa</label>
                        <div className="relative h-64 w-64 overflow-hidden rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-200 shadow-sm">
                            <Image
                                fill
                                src={imageUrl ? imageUrl : getImagePath(image!)}
                                alt="Imagen Producto"
                                style={{objectFit: 'cover'}}
                            />
                        </div>
                    </div>
                )}
                <input type="hidden" name="image" value={imageUrl ? imageUrl : image ?? ''} readOnly />
            </>
        )}
    </CldUploadWidget>
  )
}
