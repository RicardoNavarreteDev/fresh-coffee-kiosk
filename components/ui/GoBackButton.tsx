"use client"
import { useRouter } from 'next/navigation'

export default function GoBackButton() {
    const router = useRouter()
  return (
            <button
              onClick={() =>router.back()}
              className="button-secondary w-full lg:w-auto"
            >Volver</button>
  )
}
