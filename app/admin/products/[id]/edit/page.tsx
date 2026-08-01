import EditProductForm from "@/components/products/EditProductForm";
import ProductForm from "@/components/products/ProductForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { notFound} from "next/navigation";

export const dynamic = 'force-dynamic'


async function getProductById(id: number){
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })
  if(!product){
    notFound()
  }
  return product
}
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const product = await getProductById(+id)
  
  
  return (
      <>
        <Heading>Editar Producto : {product.name}</Heading>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Ajusta los datos visibles del producto para mantener el catálogo actualizado y consistente con la experiencia del cliente.
        </p>

        <GoBackButton/>

        <EditProductForm>
            <ProductForm
              product = {product}
            />
        </EditProductForm>
      </>
  )
}
