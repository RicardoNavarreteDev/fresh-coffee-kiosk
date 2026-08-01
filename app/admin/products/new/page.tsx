import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";

export const dynamic = 'force-dynamic'


export default function NewProductPage() {
  return (
      <>
        <Heading>Nuevo Producto</Heading>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Crea un producto nuevo para el catálogo, define su precio en pesos chilenos y agrega una descripción clara para el modal del cliente.
        </p>

        <AddProductForm>
          <ProductForm/> 
      </AddProductForm>
    </>
  )
}
