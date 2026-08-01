import { prisma } from "@/src/lib/prisma"

export async function GET() {

      const orders = await prisma.order.findMany({
        orderBy: {
          date: 'desc'
        },
        include: {
          orderProducts:{
            include: {
              product: true
            }
          }
        }
      })
    return Response.json(orders)
}
