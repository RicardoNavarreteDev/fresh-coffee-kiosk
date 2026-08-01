"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/src/lib/prisma"
import { OrderSchema } from "@/src/schema"

export async function createOrder(data: unknown){
    const result = OrderSchema.safeParse(data)

    if(!result.success){
        return {
            ok: false,
            errors: result.error.issues
        }
    }

    try {
        const quantitiesByProductId = new Map<number, number>()

        for (const item of result.data.order) {
            quantitiesByProductId.set(item.id, (quantitiesByProductId.get(item.id) ?? 0) + item.quantity)
        }

        const productIds = Array.from(quantitiesByProductId.keys())
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                price: true,
                stock: true,
            },
        })

        if (products.length !== productIds.length) {
            return {
                ok: false,
                errors: [{ message: 'Hay productos inválidos en el pedido' }],
            }
        }

        const productsById = new Map(products.map((product) => [product.id, product]))
        let computedTotal = 0

        for (const [productId, quantity] of quantitiesByProductId.entries()) {
            const product = productsById.get(productId)

            if (!product) {
                return {
                    ok: false,
                    errors: [{ message: 'Hay productos inválidos en el pedido' }],
                }
            }

            if (product.stock < quantity) {
                return {
                    ok: false,
                    errors: [{ message: 'Uno de los productos no tiene stock suficiente' }],
                }
            }

            computedTotal += product.price * quantity
        }

        const createdOrder = await prisma.$transaction(async (tx) => {
            for (const [productId, quantity] of quantitiesByProductId.entries()) {
                const updateResult = await tx.product.updateMany({
                    where: {
                        id: productId,
                        stock: {
                            gte: quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                })

                if (updateResult.count !== 1) {
                    throw new Error('Uno de los productos no tiene stock suficiente')
                }
            }

            return tx.order.create({
                data: {
                    name: result.data.name,
                    total: computedTotal,
                    orderProducts: {
                        create: Array.from(quantitiesByProductId.entries()).map(([productId, quantity]) => ({
                            productId,
                            quantity
                        }))
                    }
                }
            })
        })

        revalidatePath('/admin/orders')
        revalidatePath('/orders')
        revalidatePath('/admin/products')

        return {
            ok: Boolean(createdOrder)
        }
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            errors: [
                {
                    message: error instanceof Error ? error.message : 'No se pudo registrar el pedido'
                }
            ]
        }
    }
}
