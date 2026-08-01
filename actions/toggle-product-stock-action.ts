"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/src/lib/prisma'

export async function toggleProductStock(productId: number, currentStock: number) {
  await prisma.product.update({
    where: { id: productId },
    data: {
      stock: currentStock > 0 ? 0 : 10,
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/admin/products/search')
  revalidatePath('/order/[category]')
}
