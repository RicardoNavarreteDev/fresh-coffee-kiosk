import ProductCard from "@/components/products/ProductCard";
import Heading from "@/components/ui/Heading";
import Logo from "@/components/ui/Logo";
import { prisma } from "@/src/lib/prisma";

export const dynamic = 'force-dynamic'

async function getProducts(category: string) {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
  });
  return products;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params;

  const products = await getProducts(category);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <section className="panel-muted mx-auto max-w-6xl rounded-[2rem] px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <Logo
            className="flex justify-center lg:justify-start lg:pt-2"
            imageClassName="relative h-32 w-32 shrink-0 transition hover:scale-[1.02] lg:h-36 lg:w-36"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quiosco digital</p>
            <Heading>Tu pedido empieza con un buen antojo</Heading>
            <p className="max-w-3xl text-base leading-7 text-slate-600 lg:text-lg">
              Explora la categoría <span className="font-semibold text-slate-900">{categoryLabel}</span>, elige tus productos y arma tu pedido en pocos pasos.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-4 items-stretch">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
