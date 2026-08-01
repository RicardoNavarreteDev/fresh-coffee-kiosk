"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import { OrderIdSchema } from '@/src/schema'

export async function deleteOrder(formData: FormData) {
  const data = {
    orderId: formData.get('order_id'),
  }

  const result = OrderIdSchema.safeParse(data)

  if (!result.success) {
    return
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: result.data.orderId,
      },
      include: {
        orderProducts: true,
      },
    })

    if (!order || order.status !== 'PENDING') {
      return
    }

    for (const item of order.orderProducts) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    await tx.order.update({
      where: {
        id: result.data.orderId,
      },
      data: {
        status: 'CANCELLED',
        orderReadyAt: null,
      },
    })
  })

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  revalidatePath('/admin/products')

  redirect('/admin/orders')
}
