import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";

async function getCategories() {
    return prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })
}

export const dynamic = 'force-dynamic'

async function searchProducts(searchTerm: string){
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        },
        include: {
            category: true
        },
        orderBy: {
            id: 'asc'
        }
    })
    return products
}


export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
   const { search = '' } = await searchParams;
   const [products, categories] = await Promise.all([searchProducts(search), getCategories()]);
    
    return(
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>
            <div className="panel mt-6 rounded-[1.75rem] p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Búsqueda</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Explora productos dentro del catálogo</p>
                    </div>

                    <ProductSearchForm/>
                </div>
            </div>
            {products.length ? (
                <ProductTable
                products={products}
                categories={categories}
            />
            ): <div className="panel mt-8 rounded-[1.75rem] px-5 py-6 text-center text-lg text-slate-500">No hay resultados</div>}
            
        </>
    )
}
