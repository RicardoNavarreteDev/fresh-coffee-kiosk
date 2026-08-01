"use client"

import { ProductSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { createProduct } from "@/actions/create-product-action";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


export default function AddProductForm({children}: {children: React.ReactNode}) {

    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            categoryId: formData.get('categoryId'),
            description: formData.get('description'),
            image: formData.get('image')
        }
        const result = ProductSchema.safeParse(data)
        if(!result.success){
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        const response = await createProduct(result.data)
        if(response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success('Producto Creado correctamente')
        router.push('/admin/products')
    }
  return (
    <div className="panel mt-10 max-w-3xl rounded-[2rem] px-5 py-5 shadow-sm mx-auto lg:p-8">
        <form 
            className="space-y-5"
            onSubmit={handleSubmit}
        >
            {children}
            <input 
                type="submit" 
                className="button-primary mt-5 w-full cursor-pointer"
                value='Registrar Producto'
            />

        </form>

    </div>
  )
}
