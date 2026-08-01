import { prisma } from "@/src/lib/prisma"
import ImageUpload from "./ImageUpload"
import { Product } from "@prisma/client"

async function getCategories() {
    return await prisma.category.findMany()
}

type ProductFormProps = {
    product?: Product
}

export default async function ProductForm({product}: ProductFormProps) {
    const cateogries = await getCategories()

    return (
        <>
            <div className="space-y-2">
                <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="name"
                >Nombre:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="field-input"
                    placeholder="Nombre Producto"
                    defaultValue={product?.name}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="price"
                >Precio (CLP):</label>
                <input
                    id="price"
                    name="price"
                    className="field-input"
                    placeholder="Ej: 5.990"
                    defaultValue={product?.price}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="stock"
                >Stock:</label>
                <input
                    id="stock"
                    name="stock"
                    className="field-input"
                    placeholder="Ej: 20"
                    defaultValue={product?.stock ?? 20}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="categoryId"
                >Categoría:</label>
                <select
                    className="field-input"
                    id="categoryId"
                    name="categoryId"
                    defaultValue={product?.categoryId}
                >
                    <option value="">-- Seleccione --</option>
                    {cateogries.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    id="description"
                    name="description"
                    className="field-input min-h-32 resize-y"
                    placeholder="Describe el producto para el modal del cliente"
                    defaultValue={product?.description ?? ''}
                />
            </div>

            <ImageUpload
                image={product?.image}
            />
        </>
    )
}
