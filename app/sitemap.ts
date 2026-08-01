import type { MetadataRoute } from 'next'
import { prisma } from '@/src/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const categories = await prisma.category.findMany({
    select: { slug: true },
    orderBy: { id: 'asc' },
  })

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/orders`,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/order/${category.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ]
}
