"use client"

import { SearchSchema } from "@/src/schema"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"


export default function ProductSearchForm() {
    const router = useRouter()

    const handleSearchForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const data = {
            search: formData.get('search')
        }
        const result = SearchSchema.safeParse(data)
        if(!result.success){
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        router.push(`/admin/products/search?search=${result.data.search}`)
    }

    return (
        <form 
            onSubmit={handleSearchForm}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
            <input 
                type="text"
                name="search" 
                placeholder="Buscar Producto"
                className="field-input w-full sm:min-w-72"
            />
            <input 
                type="submit" 
                value={'Buscar'}
                className="button-secondary cursor-pointer"
            />
        </form>
    )
}
